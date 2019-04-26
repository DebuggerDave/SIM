import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { stringify } from '@angular/compiler/src/util';

@Injectable({
  providedIn: 'root'
})
export class MatchmakingService {
  private url = "localhost:8000/game/" // URL to game server.
  constructor(private http: HttpClient) { }
  //Send a request for a game to server.
  findMatch(searchByFilter: string):Observable<number[]>{
    return this.http.get<Game>(this.url + searchByFilter).pipe(map(game =>game.game_state))
    
  }
  
}
export interface Game{
    player_one:JSON,
    player_two:JSON,
    game_state:number[]
}