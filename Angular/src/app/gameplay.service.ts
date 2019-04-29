import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Game, User } from './models';

@Injectable({
  providedIn: 'root'
})
export class GameplayService {

  
  
  constructor(private http: HttpClient) { }
  //NEED TO FIX GAMEURI

  private url = "http://localhost:8000" // URL to api.
  
  //method pulls game 
  getGameData(currentGameUri:string){ return this.http.get<Game>(this.url + currentGameUri) }

  //This method is called at the end of a players turn.
  saveGameData(currentGameUri:string, curPlayer, lineOwner:number[], playerLines): void{
    //get game from backend
    let game: Game
    this.http.get<Game>(this.url+currentGameUri).subscribe(game_returned => {
      this.http.put(this.url + currentGameUri, game_returned);
      game = game_returned

      //Changes the game_state array so that the players chosen line is stored.
      game.line_owner = lineOwner.toString();

      //Set lines to current lines
      game.player_one_lines = playerLines[0];
      game.player_two_lines = playerLines[1];


      //This code changes the current_player to the opposite player.
      var playerToChangeTo : string 
      if(game.player_two == curPlayer) {playerToChangeTo = game.player_one}
      else{playerToChangeTo = game.player_two}
      game.current_player = playerToChangeTo

      //This posts the updated game
      console.log("PUTing game")
      this.http.put(this.url + currentGameUri, game).subscribe()
    })
  }
}

