import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GameHUDComponent } from './game-hud/game-hud.component';

const routes: Routes = [
  { path: '', redirectTo: '/game', pathMatch: 'full'},
  { path: 'game', component: GameHUDComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
