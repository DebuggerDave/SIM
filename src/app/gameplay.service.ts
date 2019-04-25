import { Injectable } from '@angular/core';
import{HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GameplayService {

  
  
  constructor(private http: HttpClient, private gameURI: string) { }
  private url = "localhost:8000/" + this.gameURI // URL to game server.
  //method pulls current Game object data
  getGameData():Game{
    let game: Game;
    this.http.get<Game>(this.url).subscribe(game_returned => {game = game_returned}) 
    return game;
    
  }
  //Method we don't use here but need to save for right now
  async delay(ms: number){
    await new Promise(resolve => setTimeout(() => resolve(), ms))
  }
  //This method is called after the game is updated by the player whose turn it is.
  saveGameData(curPlayer, lineOwner, playerLines): void{
    //Pulls game object.
    let game: Game
    this.http.get<Game>(this.url).subscribe(game_returned => {game = game_returned})

    //Changes the game_state array so that the players chosen line is stored.
    game.line_owner = lineOwner;

    //Set lines to current lines
    game.player_one_lines = playerLines[0];
    game.player_two_lines = playerLines[1];

    //This code changes the current_player to the opposite player.
    var playerToChangeTo : string 
    if(game.player_two == curPlayer) {playerToChangeTo = game.player_one}
    else{playerToChangeTo = game.player_two}
    game.current_player = playerToChangeTo

    //This posts the updated game
    this.http.put(this.url, game)
  }
}
export interface Game{
  player_one:string,
  player_two:string,
  line_owner:number[],
  resource_uri: string,
  current_player: string,
  player_one_lines:number[],
  player_two_lines:number[],
}

export interface User{
email: string,
id: number,
password: string,
resource_uri: string,
username: string,
lfg: number
}
