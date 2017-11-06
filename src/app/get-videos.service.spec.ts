import { TestBed, inject } from '@angular/core/testing';

import { GetVideosService } from './get-videos.service';

describe('GetVideosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GetVideosService]
    });
  });

  it('should be created', inject([GetVideosService], (service: GetVideosService) => {
    expect(service).toBeTruthy();
  }));
});
