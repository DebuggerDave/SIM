import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval} from 'rxjs';
import { map } from 'rxjs/operators';
import {pipe } from 'rxjs';
import { UserService } from "./user.service";
import { GameplayService } from "./gameplay.service";
import { User, Game} from './models';

@Injectable({
  providedIn: 'root'
})
export class MatchmakingService {
  private url = "http://localhost:8000/api/" // URL to game server.
  
  constructor(private http: HttpClient,private userService:UserService,private gameplay:GameplayService ) { }
  
  //This function is called when a player presses the "search for a game" button.
  setupMatch(myURI: string){
    //Looks for an existing player who's lfg is set to 1.
    this.userService.findOpponent().subscribe(opponentUri => {
      //If there are no players searching for a game, we set their LFG flag to 1.
      console.log("Initiated Setup")
      if(opponentUri === null){
        console.log("Couldn't find opponent")
        this.userService.setLFG(myURI)
        //then wait for game
        var matchURI = this.waitForGame(myURI)
        //Trigger gameplay service with matchURI
        //NEED TO IMPLEMENT PASSING OFF
      }
        
      //If there are other players searching for a game, the player is matched with the first one that is returned from a query.
      else{
        //Creates an empty match object.
        console.log("Found opponent")
        let matchURI;
        this.createMatch(myURI, opponentUri).subscribe(res => {
          matchURI=res;
          localStorage.setItem('currentGame',JSON.stringify(res));
        })
        //Trigger gameplay service with matchURI

      }
    })

  }
  //Creates Match and returns its URI.
  createMatch(user1: string, user2: string){
    let matchURI: string;

    //Creates match with empty game-state.
    var body:Game = {
      "player_one": user1,
      "player_two": user2,
      "line_owner": [],
      "player_one_lines":[],
      "player_two_lines":[],
      "current_player":user1,
      "resource_uri":""
    }

    //Posts new match. Saves resource_uri to matchURI var.
    return this.http.post<Game>(this.url+"game/", body).pipe(map(res => res.resource_uri))    
  }

  getMatch(searchByFilter: string){
    let game:Game;
    this.http.get<Game>(this.url + searchByFilter).subscribe(res => game = res)
    return game;
  }

  //This function will issue a get request every 2 seconds, searching whether a game has been created with myURI. If this is found, it returns the match's uri.
  waitForGame(myURI: string){
    let game_uri:string = "";
    let intervalObject: any;
    console.log("Waiting for game")

    intervalObject = setInterval(() => {
       game_uri = this.searchForGame(myURI);
       if(game_uri !== ""){
         console.log("Found game")
         clearInterval(intervalObject)
       }
    }, 2000);
    return game_uri;
  }

  //This is a helper function that searches whether a game has been created with the given players URI as player_two.
  searchForGame(myURI: string):string{
    let gameResourceURI: string;
    this.http.get<Game>(this.url + "games/?player_two=" + myURI).subscribe(game => {
      gameResourceURI = game.resource_uri
    }) 
    return gameResourceURI
  }
}

