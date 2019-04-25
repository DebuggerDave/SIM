import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval} from 'rxjs';
import { map } from 'rxjs/operators';
import {pipe } from 'rxjs';
import { stringify } from '@angular/compiler/src/util';
import { setFlagsFromString } from 'v8';

@Injectable({
  providedIn: 'root'
})
export class MatchmakingService {
  private url = "localhost:8000/" // URL to game server.
  
  constructor(private http: HttpClient) { }
  //Returns the uri of first player that has lfg set to 1.
  findOpponent():string{
    let URI:string;
    this.http.get<UserResponse>(this.url + "user/?lfg=1").subscribe(players => {
      URI = players.objects[0].resource_uri
    }) 
    return URI
    
  }
  setLFG(userURI: string){
    let playerToChange: User;
    //Returns the user JSON object that we wish to be changed.
    this.http.get<User>(this.url + "user/resource_uri=" + userURI).subscribe(player => playerToChange = player) 
    //Changes the looking for game (lfg) field to 1, indicating that they are looking for a game.
    playerToChange.lfg = 1
    //Posts the newly changed object.
    this.http.post(this.url + userURI, playerToChange)
  }
  //This function is called when a player presses the "search for a game" button.
  setupMatch(myURI: string){
    //Looks for an existing player who's lfg is set to 1.
    var opponent = this.findOpponent()
    //If there are no players searching for a game, we set their LFG flag to 1.
    if(opponent === null){
      this.setLFG(myURI)
      //This function puts the player in a sleep mode where they sit until it finds a game that has been instantiated with this player as player_two.
      var matchURI = this.waitForGame(myURI)
      //Trigger gameplay service with matchURI
    }
      
    //If there are other players searching for a game, the player is matched with the first one that is returned from a query.
    else{
      //Creates an empty match object.
      var matchURI = this.createMatch(myURI, opponent)
      //Trigger gameplay service with matchURI
    }
    

  }
  //Creates Match and returns its URI.
  createMatch(user1: string, user2: string): string{
    let matchURI: string;
    //Creates match with empty game-state.
    var body = {
      "player_one": user1,
      "player_two": user2,
      "game_state": []
    }
    //Posts new match. Saves resource_uri to matchURI var.
    this.http.post<Game>(this.url, body).subscribe( response => matchURI = response.resource_uri)
    return matchURI
    

  }
  getMatch(searchByFilter: string):Observable<number[]>{
    return this.http.get<Game>(this.url + searchByFilter).pipe(map(game =>game.game_state))
    
  }
  //This function will issue a get request every 2 seconds, searching whether a game has been created with myURI. If this is found, it returns the match's uri.
  waitForGame(myURI: string){
    let game_uri:string = "";
    let intervalObject: any;
    intervalObject = setInterval(() => {
       game_uri = this.searchForGame(myURI);
       if(game_uri !== "")
        clearInterval(intervalObject)
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
export interface Game{
    player_one:string,
    player_two:string,
    game_state:number[],
    resource_uri: string
}
export interface UserResponse{
  meta: {},
  objects: User[]
}
export interface User{
  email: string,
  id: number,
  password: string,
  resource_uri: string,
  username: string,
  lfg: number
}
