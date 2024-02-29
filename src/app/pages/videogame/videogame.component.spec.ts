import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideogameComponent } from './videogame.component';

describe('VideogameComponent', () => {
  let component: VideogameComponent;
  let fixture: ComponentFixture<VideogameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideogameComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VideogameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
