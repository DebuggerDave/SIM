import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User, UserResponse } from './models';
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = "http://localhost:8000"
  loggedIn: boolean = false;
  user:User;

  constructor(private http:HttpClient) { }

  findOpponent(myUri:string){
    console.log("Searching for opponent")
     return this.http.get<UserResponse>(this.url + "/api/user/?lfg=1").pipe(map(players => {
       if(players.objects.length!=0 && players.objects[0].resource_uri!=myUri){
         return players.objects[0].resource_uri
       }
       else if (players.objects.length>2)
         {return players.objects[1].resource_uri}
       else {return undefined}
      }))
  }

  setLFG(userURI: string,setTo:number){
    let playerToChange: User;
    //Returns the user JSON object that we wish to be changed.
    this.http.get<User>(this.url + userURI).subscribe(player => {
      playerToChange = player
      //Changes the looking for game (lfg) field to 1, indicating that they are looking for a game.
      playerToChange.lfg = setTo
      //Posts the newly changed object.
      console.log("Attempting to put")
      this.http.put(this.url + userURI, playerToChange).subscribe()
  })
  }

  findUserByUsername(username:string){
    let userToReturn:User;
    return this.http.get<UserResponse>(this.url + "/api/user/?username="+username).pipe(map(response => response.objects[0]))
    

  }

  getUser(): any {return this.user;}
  setUser(newUser: any) {this.user = newUser;}

  getLoggedIn(): boolean {return this.loggedIn;}
  setLoggedIn(logged: boolean) {this.loggedIn = logged;}
}
