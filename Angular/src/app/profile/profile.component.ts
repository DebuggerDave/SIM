import { Component, OnInit } from '@angular/core';
import { USERS } from '../../db';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  users = USERS;
  user;

  constructor(private route: ActivatedRoute, private location: Location) { }

  ngOnInit() {
    this.getUser()
  }

  getUser() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.users.forEach((user)=>{
      if(user.id == id){
        this.user = user;
        console.log(user);
      }
    });
  }

}
