import { Component, OnInit, ViewChild } from '@angular/core';
import { GameComponent } from '../game/game.component';
import { MatchmakingService } from '../matchmaking.service';
import { User } from '../models';
import { UserService } from '../user.service';
import { GameplayService } from '../gameplay.service';
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
  loggedIn: boolean = false;

  constructor(private matchmaking:MatchmakingService, private gameplay:GameplayService,private userService:UserService) { }


  ngOnInit() {
    this.currentPlayer= JSON.parse(localStorage.getItem('currentUser'));
    this.loggedIn = JSON.parse(localStorage.getItem('loggedIn'));
  }

  // button click event, start game. Red starts first
  gameEvent() {
    this.isPlaying = true;
    console.log(this.userService.user)

    this.matchmaking.setupMatch(this.userService.user.resource_uri).subscribe(uri => {
      uri.then(uri => {
        console.log("Current match URI:",<string>uri)
        if (<string>uri!=undefined){
          this.gameplay.currentGame=uri;
          this.matchmaking.getMatch(<string>uri).subscribe(game => {
            if (game.player_one == this.userService.user.resource_uri){
            console.log("You are player one")
            this.game.isMyTurn=true;
            this.game.playerEnum[0]="You're up! Red"
            }
            else{
              console.log("You are player two")
              this.game.playerEnum[1]="You're up! Blue"
              
            }
          })
          
          
        }
      })
    })
    //this.game.waitForTurn();

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
