import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GameHUDComponent } from './game-hud/game-hud.component';
import { HomepageComponent } from './homepage/homepage.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: 'home', component: HomepageComponent },
  { path: 'game', component: GameHUDComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
