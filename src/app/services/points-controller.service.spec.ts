import { TestBed } from '@angular/core/testing';

import { PointsControllerService } from './points-controller.service';

describe('PointsControllerService', () => {
  let service: PointsControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PointsControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
