import { Component, OnInit, ViewChild } from '@angular/core';
import { GameComponent } from '../game/game.component';
import { MatchmakingService } from '../matchmaking.service';
import { User } from '../models';
import { UserService } from '../user.service';
@Component({
  selector: 'app-game-hud',
  templateUrl: './game-hud.component.html',
  styleUrls: ['./game-hud.component.css']
})
export class GameHUDComponent implements OnInit {
  @ViewChild(GameComponent) private game: GameComponent;

  gameState = 'Press "Start Game" to play!';
  gameEventMsg = 'Start Game';
  isPlaying = false;
  waiting = true;
  currentPlayer:User;

  

  constructor(private matchmaking:MatchmakingService) { }

  ngOnInit() {
    this.currentPlayer= JSON.parse(localStorage.getItem('currentUser'));
  }

  // button click event, start game. Red starts first
  gameEvent() {
    this.isPlaying = true;
    console.log(this.currentPlayer)

    this.matchmaking.setupMatch(this.currentPlayer.resource_uri)
    this.game.restart();
    this.gameEventMsg = 'Play Again?';
    this.gameState = 'Red\'s Turn';
  }

  // emitted from child, current player's turn
  setTurnMsg(player: string): void {
    this.gameState = player + '\'s Turn';
  }

  // emitted from child, winner of game, means game ended
  setWinnerMsg(winner: string): void {
    this.isPlaying = false;
    this.gameState = winner + ' Player Wins! Press the button to play again';
  }

}
