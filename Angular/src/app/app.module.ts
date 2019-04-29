import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';
import { GameHUDComponent } from './game-hud/game-hud.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { HomepageComponent } from './homepage/homepage.component';
import { RegistrationComponent } from './registration/registration.component';
import { ProfileComponent } from './profile/profile.component';
import { MatchmakingService } from './matchmaking.service';
import { GameplayService } from './gameplay.service';
import { UserService } from './user.service';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    GameHUDComponent,
    LeaderboardComponent,
    HomepageComponent,
    RegistrationComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [GameplayService, MatchmakingService,UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
