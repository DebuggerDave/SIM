import { Component, OnInit } from '@angular/core';
import { USERS } from '../../db';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute, UrlSegment } from '@angular/router';
import { UserService } from '../user.service'

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  users = USERS;
  username = new FormControl('');
  password = new FormControl('');

  constructor(private router: Router, private service: UserService) { }

  ngOnInit() {
  }
  login() {
    this.users.forEach((user)=>{
      if(this.username.value == user.username && this.password.value == user.password) {
        this.service.setUser(user);
        this.service.setLoggedIn(true);
        this.router.navigate(['/game']);
      }
    });
  }

}
