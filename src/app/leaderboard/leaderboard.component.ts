import { Component, OnInit } from '@angular/core';
import { USERS } from '../../db';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {
  users = USERS;

  displayPlayer(player) {

  }
  constructor() {
    this.users.forEach((user) => {
      user.rank = (user.wins)/(user.wins+user.losses);
    });
    this.users.sort((a, b) => a.rank > b.rank ? -1 : a.rank < b.rank ? 1 : 0)
    this.users.forEach((user) => {
      user.rank = this.users.indexOf(user)+1;
    });
  }

  ngOnInit() {
  }

}
