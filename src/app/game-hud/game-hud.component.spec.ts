import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameHUDComponent } from './game-hud.component';

describe('GameHUDComponent', () => {
  let component: GameHUDComponent;
  let fixture: ComponentFixture<GameHUDComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameHUDComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameHUDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
