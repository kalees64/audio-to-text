import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordAudioToTextAssemblyAiComponent } from './record-audio-to-text-assembly-ai.component';

describe('RecordAudioToTextAssemblyAiComponent', () => {
  let component: RecordAudioToTextAssemblyAiComponent;
  let fixture: ComponentFixture<RecordAudioToTextAssemblyAiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecordAudioToTextAssemblyAiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecordAudioToTextAssemblyAiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
