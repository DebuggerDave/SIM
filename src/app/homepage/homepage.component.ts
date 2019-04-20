import { Component, OnInit } from '@angular/core';
import { USERS } from '../../db';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute, UrlSegment } from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  users = USERS;
  username = new FormControl('');
  password = new FormControl('');

  constructor(private router: Router) { }

  ngOnInit() {
  }
  login() {
    this.users.forEach((user)=>{
      if(this.username.value == user.username && this.password.value == user.password) {
        this.router.navigate(['/game']);
      }
    });
  }

}
