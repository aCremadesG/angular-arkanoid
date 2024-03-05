import { TestBed } from '@angular/core/testing';

import { LevelControllerService } from './level-controller.service';

describe('LevelControllerService', () => {
  let service: LevelControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LevelControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
