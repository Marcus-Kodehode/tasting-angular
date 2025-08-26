import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EasterEgg } from './easter-egg';

describe('EasterEgg', () => {
  let component: EasterEgg;
  let fixture: ComponentFixture<EasterEgg>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EasterEgg]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EasterEgg);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
