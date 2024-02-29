import { TestBed } from '@angular/core/testing';

import { BallControllerService } from './ball-controller.service';

describe('BallControllerService', () => {
  let service: BallControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BallControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
