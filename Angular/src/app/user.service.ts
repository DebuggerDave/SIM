import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User, UserResponse } from './models';
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = "http://localhost:8000/api/user/"
  loggedIn: boolean = false;
  user: User = null;

  constructor(private http:HttpClient) { }

  findOpponent(){
    console.log("Searching for opponent")
     return this.http.get<UserResponse>(this.url + "?lfg=1").pipe(map(players => players.objects[0].resource_uri))
  }

  setLFG(userURI: string){
    let playerToChange: User;
    //Returns the user JSON object that we wish to be changed.
    this.http.get<User>(this.url + "?resource_uri=" + userURI).subscribe(player => {
      playerToChange = player
      //Changes the looking for game (lfg) field to 1, indicating that they are looking for a game.
      playerToChange.lfg = 1
      //Posts the newly changed object.
      this.http.put(this.url + userURI, playerToChange)
  })
  }

  findUserByUsername(username:string){
    let userToReturn:User;
    return this.http.get<UserResponse>(this.url + "?username="+username).pipe(map(response => response.objects[0]))

  }

  getUser(): any {return this.user;}
  setUser(newUser: any) {this.user = newUser;}

  getLoggedIn(): boolean {return this.loggedIn;}
  setLoggedIn(logged: boolean) {this.loggedIn = logged;}
}
