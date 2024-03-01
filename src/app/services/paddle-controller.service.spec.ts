import { TestBed } from '@angular/core/testing';

import { PaddleControllerService } from './paddle-controller.service';

describe('PaddleControllerService', () => {
  let service: PaddleControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaddleControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
