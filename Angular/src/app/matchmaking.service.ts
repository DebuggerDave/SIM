import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval} from 'rxjs';
import { map } from 'rxjs/operators';
import {pipe, of} from 'rxjs';
import { UserService } from "./user.service";
import { GameplayService } from "./gameplay.service";
import { User, Game, GameResponse} from './models';

@Injectable({
  providedIn: 'root'
})
export class MatchmakingService {
  private url = "http://localhost:8000" // URL to game server.
  currentGame:string;


  constructor(private http: HttpClient,private userService:UserService,private gameplay:GameplayService ) { }

  //This function is called when a player presses the "search for a game" button.
  setupMatch(myURI: string){
    //Looks for an existing player who's lfg is set to 1.
    return this.userService.findOpponent(myURI).pipe(map(opponentUri => {
      //If there are no players searching for a game, we set their LFG flag to 1.
      console.log("Initiated Setup")
      if(opponentUri == undefined){
        console.log("Couldn't find opponent")
        this.userService.setLFG(myURI,1)
        //then wait for game and once one if found, return it
        return (this.waitForGame(myURI))
      }

      //If there are other players searching for a game, the player is matched with the first one that is returned from a query.

      else{
        console.log("Found opponent")
        //and return the uri of the game we just created
        return this.createMatch(myURI, opponentUri).toPromise()

      }
    }))

  }
  //Creates Match and returns its URI.
  createMatch(user1: string, user2: string){
    let matchURI: string;

    //Creates match with empty game-state.
    var body:Game = {
      "player_one": user1,
      "player_two": user2,
      "line_owner": "",
      "player_one_lines":"",
      "player_two_lines":"",
      "current_player":user1,
      "resource_uri":""
    }
    this.userService.setLFG(user1,0)
    this.userService.setLFG(user2,0)
    //return observable of posted game's uri (pretty sure this is a cold observable?)
    // return this.http.post<Game>(this.url+"game/", body).pipe(map(res => res.resource_uri))  
    return this.http.post<Game>(this.url+"/api/game/", body).pipe(map((res =>res.resource_uri))); 
 
  }

  getMatch(searchByFilter: string){
    return this.http.get<Game>(this.url + searchByFilter)
  }

  //This function will issue a get request every 2 seconds, searching whether a game has been created with myURI. If this is found, it returns the match's uri.
  async waitForGame(myURI: string){
    let game_uri:string = "";
    let intervalObject: any;
    console.log("Waiting for game")

    // intervalObject = setInterval(() => {
    //    game_uri = this.searchForGame(myURI);
    //    if(game_uri !== ""&&game_uri!==undefined){
    //      console.log("Found game")
    //      clearInterval(intervalObject)
    //      return game_uri;
    //    }
    //    else{ console.log("Still Searching")}
    // }, 2000);
    // if ( game_uri !== ""&&game_uri!==undefined){
    //   console.log("Found game")
    //      return game_uri;
    //}
    let uriPromise = new Promise((resolve, reject) =>{
        // this.searchForGame(myURI)
        //   .toPromise()
        //   .then(
        //     game =>{
        //       return game.resource_uri;
        //       console.log("Found Game!!")
        //       resolve();
        //     })

        intervalObject = setInterval(() => {
          this.searchForGame(myURI).subscribe(game =>{
            if(game!=undefined && game.resource_uri !== ""&&game.resource_uri!==undefined){
              console.log("Found game",game.resource_uri)

              clearInterval(intervalObject)
              resolve(game.resource_uri);
            }
            else{ console.log("Still Searching")}
            })
          
        }, 2000);
    })
    return uriPromise;
    
  }

  //This is a helper function that searches whether a game has been created with the given players URI as player_two.
  searchForGame(myURI: string){
    let gameResourceURI: string;
    return this.http.get<GameResponse>(this.url + "/api/game/?player_two=" + myURI).pipe(map(res => <Game>res.objects[0]))
    //return gameResourceURI

  }
}
