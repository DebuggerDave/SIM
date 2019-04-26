import { Injectable } from '@angular/core';

export class UserService {
  user: any = {id: 0,
          name: "",
          username: '',
          password: "",
          wins: 0,
          losses: 0,
          rank: null
        };;
  loggedIn: boolean = false;
  constructor() { }

  getUser(): any {return this.user;}
  setUser(newUser: any) {this.user = newUser;}

  getLoggedIn(): boolean {return this.loggedIn;}
  setLoggedIn(logged: boolean) {this.loggedIn = logged;}
}
