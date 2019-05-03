import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { User, Game } from '../models';
import { GameplayService } from '../gameplay.service';
import { UserService } from '../user.service';
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})

export class GameComponent implements OnInit {
  @Output() player = new EventEmitter<string>();
  @Output() winner = new EventEmitter<string>();
  // Set these
  gameSize = 500;
  nodeRadius = 15;

  // don't set these
  currentPlayer = 0; // 0 = red, 1 = blue
  currentPlayerUri = this.userService.user.resource_uri;
  currentGameUri;
  gameWidth = 0;
  gameHeight = 0;
  isMyTurn = false;
  waitingForTurn=false;
  // x locations of nodes
  xVal: number[] = [];
  // y locations of nodes
  yVal: number[] = [];
  // describes which player placed which line, 0 = red, 1 = blue, 2 = none
  // used for changing css
  lineOwner: number[] = Array<number>(15).fill(2);
  // describes lines each player has placed, 0 = red, 1 = blue
  // used for finding triangles
  playerLines: number[][] = [[], []];
  isPlaying = false;
  // line numbers, with cooresponding nodes
  lineEnum = Object.freeze({
    0: {node1: 0, node2: 1},
    1: {node1: 0, node2: 2},
    2: {node1: 0, node2: 3},
    3: {node1: 0, node2: 4},
    4: {node1: 0, node2: 5},
    5: {node1: 1, node2: 2},
    6: {node1: 1, node2: 3},
    7: {node1: 1, node2: 4},
    8: {node1: 1, node2: 5},
    9: {node1: 2, node2: 3},
    10: {node1: 2, node2: 4},
    11: {node1: 2, node2: 5},
    12: {node1: 3, node2: 4},
    13: {node1: 3, node2: 5},
    14: {node1: 4, node2: 5}
  });
  playerEnum = {
    0: 'Red',
    1: 'Blue',
    2: 'None'
  };

  constructor(private gameplay: GameplayService,private userService:UserService) { }

  // define node locations and game size
  ngOnInit() {
    this.gameWidth = this.gameSize + 2 * this.nodeRadius;
    this.gameHeight = this.gameSize + 2 * this.nodeRadius;

    this.xVal[0] = (((this.gameHeight / 2) - this.nodeRadius) / Math.tan(Math.PI / 3)) + this.nodeRadius;
    this.xVal[1] = this.gameWidth - this.xVal[0];
    this.xVal[2] = this.gameWidth - this.nodeRadius;
    this.xVal[3] = this.xVal[1];
    this.xVal[4] = this.xVal[0];
    this.xVal[5] = this.nodeRadius;
    this.yVal[0] = this.nodeRadius;
    this.yVal[1] = this.nodeRadius;
    this.yVal[2] = this.gameHeight / 2;
    this.yVal[3] = this.gameHeight - this.nodeRadius;
    this.yVal[4] = this.gameHeight - this.nodeRadius;
    this.yVal[5] = this.gameHeight / 2;
  }

  // restart game
  restart(): void {
    this.isPlaying = true;
    this.currentPlayer = 0;
    this.lineOwner.fill(2);
    this.playerLines  = [[], []];
    this.delay(1000).then(() => {
      this.currentGameUri = this.gameplay.currentGame;
      console.log(this.currentGameUri);
      // this.gameplay.getCurrentPlayer(this.gameplay.currentGame).subscribe(player=>{
      //   if (this.userService.user.resource_uri == player){
      //     this.isMyTurn=true;
      //   }
      //   else{ this.waitForTurn()}
      // })
    });
    

  }

  // return css property to define path
  getPathString(lineNum: number): string {
    const node1 = this.lineEnum[lineNum.toString()].node1;
    const node2 = this.lineEnum[lineNum.toString()].node2;
    return 'M' + this.xVal[node1] + ' ' + this.yVal[node1] + ' ' + this.xVal[node2] + ' ' + this.yVal[node2];
  }

  // line click event, check game state, update lineOwner to change css
  lineClick(lineNum: number): void {
    // do not set line color if already set
    // this.gameplay.checkIfMyTurn(this.userService.user.resource_uri,this.currentGameUri).subscribe(res =>{
    //   if(res){this.isMyTurn =true}
    // })
    if (!this.isMyTurn && !this.waitingForTurn){
      this.waitForTurn();
    }
    if (this.lineOwner[lineNum] !== 2 || !this.isPlaying || !this.isMyTurn) { return; }

    // check game state
    if (this.checkIfGameEnded(lineNum)) {
      this.winner.emit(this.playerEnum[(this.currentPlayer + 1) % 2]);
      this.isPlaying = false;
      this.gameplay.deleteGame(this.currentGameUri)
    }
    // check game should end
    if (this.isPlaying === false) { return; }

    // add lines to player's arrays
    this.playerLines[this.currentPlayer].push(lineNum);
    this.lineOwner[lineNum] = this.currentPlayer;

    

    // next turn
    

    this.gameplay.saveGameData(this.gameplay.currentGame,this.currentPlayerUri, this.lineOwner,this.playerLines);
    
    this.isMyTurn=false;
    this.waitForTurn()

    console.log("switching player from",this.currentPlayer)
    this.currentPlayer = (this.currentPlayer + 1) % 2;
    this.player.emit(this.playerEnum[this.currentPlayer]);
    console.log("switched player to",this.currentPlayer)
  }

  // bad algorithm to search for triangles in game
  // return true if game has ended
  checkIfGameEnded(lineNum: number): boolean {
    const node1Pairs = [];
    const node2Pairs = [];
    const currentNode1 = this.lineEnum[lineNum].node1;
    const currentNode2 = this.lineEnum[lineNum].node2;
    let gameOver = false;

    // find current nodes adjacent to nodes of the new line
    this.playerLines[this.currentPlayer].forEach(line => {
      const node1 = this.lineEnum[line].node1;
      const node2 = this.lineEnum[line].node2;
      if (node1 === currentNode1) {
        node1Pairs.push(node2);
      } else if (node2 === currentNode1) {
        node1Pairs.push(node1);
      } else if (node1 === currentNode2) {
        node2Pairs.push(node2);
      } else if (node2 === currentNode2) {
        node2Pairs.push(node1);
      }
    });

    // if the two arrays share an element, there is a traingle
    node1Pairs.forEach(node1Pair => {
      node2Pairs.forEach(node2Pair => {
        if (node1Pair === node2Pair) {
          gameOver = true;
        }
      });
    });

    return gameOver;
  }
  waitForTurn(){
    let myTurnYet = false;
    this.waitingForTurn=true;
    let intervalObject;
    console.log("Waiting for your turn")

    
    
    intervalObject = setInterval(() => {
      this.gameplay.getGameData(this.gameplay.currentGame).subscribe(res =>{
        console.log("Checking if it's your turn")
        if (res.current_player==this.userService.user.resource_uri){
          console.log("It's now your turn")
          clearInterval(intervalObject)
          console.log("Current Game",res)
          this.isMyTurn=true;
          this.waitingForTurn=false;
          this.gameplay.getGameData(this.gameplay.currentGame).subscribe(res =>{
            this.lineOwner=JSON.parse(res.line_owner)
            this.playerLines = [JSON.parse(res.player_one_lines),JSON.parse(res.player_two_lines)];
            console.log("Got game data", res);
            console.log("switching player from",this.currentPlayer)
            this.currentPlayer = (this.currentPlayer + 1) % 2;
            this.player.emit(this.playerEnum[this.currentPlayer]);
            console.log("switched player to",this.currentPlayer)
    });
        }
      })
    }, 1000); 


    // while(!haveIFoundGame){
    //    (function theLoop (i) {
    //       setTimeout(function () {
    //         this.gameplay.getGameData(this.currentGameUri).subscribe(res =>{
    //           if (res.current_player==this.currentPlayerUri){
    //             console.log("It's now your turn")
    //             haveIFoundGame = true;
    //           }
    //         })
    //         if (--i) {          // If i > 0, keep going
    //           theLoop(i);       // Call the loop again, and pass it the current value of i
    //         }
    //       },1000);
    //     })(10);

    // }

    //update local lineOwner and playerLines from opponents move

  }
  
  //simple function to delay a call for ms milliseconds
  async delay(ms: number){
    await new Promise(resolve => setTimeout(() => resolve(), ms))
  }

}
