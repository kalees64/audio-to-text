import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioToTextOpenAiComponent } from './audio-to-text-open-ai.component';

describe('AudioToTextOpenAiComponent', () => {
  let component: AudioToTextOpenAiComponent;
  let fixture: ComponentFixture<AudioToTextOpenAiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AudioToTextOpenAiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AudioToTextOpenAiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
