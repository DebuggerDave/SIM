import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {
  testData: Data[] = [
    {place: 1, name: "Steve", wins: 1000},
    {place: 2, name: "David", wins: 100},
    {place: 3, name: "Will", wins: 10},
    {place: 4, name: "Taylor", wins: 1},
    {place: 5, name: "Spencer", wins: -1000001}
  ];
  selected: Data = new Data();

  displayPlayer(player: Data) {
    this.selected = player;
  }
  constructor() { }

  ngOnInit() {
  }

}

class Data {
  place: number;
  name: string;
  wins: number;
}
