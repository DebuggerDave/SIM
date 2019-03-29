import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  // Set these
  gameSize = 400;
  vertexRadius = 15;

  // not these
  gameWidth = 0;
  gameHeight = 0;
  xVal: number[] = [];
  yVal: number[] = [];

  constructor() { }

  ngOnInit() {
    this.gameWidth = this.gameSize + 2 * this.vertexRadius;
    this.gameHeight = this.gameSize + 2 * this.vertexRadius;

    this.xVal[0] = Math.cos(Math.PI / 3) * ((this.gameHeight / 2) - this.vertexRadius) + this.vertexRadius;
    this.xVal[1] = this.gameWidth - this.xVal[0];
    this.xVal[2] = this.gameWidth - this.vertexRadius;
    this.xVal[3] = this.xVal[1];
    this.xVal[4] = this.xVal[0];
    this.xVal[5] = this.vertexRadius;
    this.yVal[0] = this.vertexRadius;
    this.yVal[1] = this.vertexRadius;
    this.yVal[2] = this.gameHeight / 2;
    this.yVal[3] = this.gameHeight - this.vertexRadius;
    this.yVal[4] = this.gameHeight - this.vertexRadius;
    this.yVal[5] = this.gameHeight / 2;
  }

}
