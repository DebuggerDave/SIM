import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { User, Game } from '../models';
import { GameplayService } from '../gameplay.service';
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
  currentPlayerUri = JSON.parse(localStorage.getItem('currentUser')).resource_uri;
  currentGameUri;
  gameWidth = 0;
  gameHeight = 0;
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
  playerEnum = Object.freeze({
    0: 'Red',
    1: 'Blue',
    3: 'None'
  });

  constructor(private gameplay: GameplayService) { }

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
    this.delay(1000).then(() => {this.currentGameUri = JSON.parse(localStorage.getItem('currentGame'));console.log(this.currentGameUri)});
    

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
    if (this.lineOwner[lineNum] !== 2 || !this.isPlaying) { return; }

    // check game state
    if (this.checkIfGameEnded(lineNum)) {
      this.winner.emit(this.playerEnum[(this.currentPlayer + 1) % 2]);
      this.isPlaying = false;
    }

    // add lines to player's arrays
    this.playerLines[this.currentPlayer].push(lineNum);
    this.lineOwner[lineNum] = this.currentPlayer;

    // check game should end
    if (this.isPlaying === false) { return; }

    // next turn
    this.currentPlayer = (this.currentPlayer + 1) % 2;
    this.player.emit(this.playerEnum[this.currentPlayer]);

    this.gameplay.saveGameData(this.currentGameUri,this.currentPlayerUri, this.lineOwner,this.playerLines);
    this.waitForTurn()
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
    let intervalObject;
    console.log("Waiting for your turn")
    

    //todo add while loop
    intervalObject = setInterval(() => {
      this.gameplay.getGameData(this.currentGameUri).subscribe(res =>{
        
        if (res.current_player==this.currentPlayerUri){
          console.log("It's now your turn")
          clearInterval(intervalObject)
        }
      })
    }, 1000); 

    //update local lineOwner and playerLines from opponents move
    this.gameplay.getGameData(this.currentGameUri).subscribe(res =>{
      
      
      this.lineOwner=JSON.parse(res.line_owner)
      this.playerLines = [JSON.parse(res.player_one_lines),JSON.parse(res.player_two_lines)];
      
      console.log("Got game data", res);
    });
  }
  
  //simple function to delay a call for ms milliseconds
  async delay(ms: number){
    await new Promise(resolve => setTimeout(() => resolve(), ms))
  }
}
