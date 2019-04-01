import { Component, OnInit, ViewChild } from '@angular/core';
import { GameComponent } from '../game/game.component';

@Component({
  selector: 'app-game-hud',
  templateUrl: './game-hud.component.html',
  styleUrls: ['./game-hud.component.css']
})
export class GameHUDComponent implements OnInit {
  @ViewChild(GameComponent) private game: GameComponent;

  gameState = 'Press "Start Game" to play!';
  gameOver = false;
  gameEventMsg = 'Start Game';
  isPlaying = false;
  waiting = true;

  constructor() { }

  ngOnInit() {
  }

  gameEvent() {
    this.isPlaying = true;
    this.game.restart();
    this.gameEventMsg = 'Play Again?';
    this.gameState = 'Red\'s Turn';
  }

  setTurnMsg(player: string): void {
    this.gameState = player + '\'s Turn';
  }

  setWinnerMsg(winner: string): void {
    this.isPlaying = false;
    this.gameState = winner + ' Player Wins! Press the button to play again';
  }

}
