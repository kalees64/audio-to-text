import { TestBed } from '@angular/core/testing';

import { AudioToTextService } from './audio-to-text.service';

describe('AudioToTextService', () => {
  let service: AudioToTextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AudioToTextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
