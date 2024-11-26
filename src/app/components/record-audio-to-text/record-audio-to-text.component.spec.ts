import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordAudioToTextComponent } from './record-audio-to-text.component';

describe('RecordAudioToTextComponent', () => {
  let component: RecordAudioToTextComponent;
  let fixture: ComponentFixture<RecordAudioToTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecordAudioToTextComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecordAudioToTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
