import { Component, OnInit } from '@angular/core';
import { USERS } from '../../db';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute, UrlSegment } from '@angular/router';
import { UserService } from '../user.service';
import { User, UserResponse } from "../models";

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  users = USERS;
  username = new FormControl('');
  password = new FormControl('');

  constructor(private router: Router,private userService:UserService) { }

  ngOnInit() {
  }

  login() {
    let passwordToCheck = this.password.value;

    //issue request to DB for user with username
    this.userService.findUserByUsername(this.username.value).subscribe(res => {
      //store user returned from get request
      let userToCheckAgainst:User = res
      //check if the passwords match
      if(userToCheckAgainst == undefined) {
        alert("Incorrect Username or Password.");
      } else if (passwordToCheck == userToCheckAgainst.password){
        //if so go to game page
        this.router.navigate(['/game']);
        //and store user as the current user
        localStorage.setItem('loggedIn',JSON.stringify(true))
        localStorage.setItem('currentUser',JSON.stringify(userToCheckAgainst))
      } else {
        alert("Incorrect Username or Password.");
      }
    });
  }

}
