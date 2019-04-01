import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';
import { GameHUDComponent } from './game-hud/game-hud.component';
<<<<<<< HEAD
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
=======
import { HomepageComponent } from './homepage/homepage.component';
import { RegistrationComponent } from './registration/registration.component';
>>>>>>> ab0fa5cf88d39b8784a91b83f770a2932c0422bd

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    GameHUDComponent,
<<<<<<< HEAD
    LeaderboardComponent
=======
    HomepageComponent,
    RegistrationComponent
>>>>>>> ab0fa5cf88d39b8784a91b83f770a2932c0422bd
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
