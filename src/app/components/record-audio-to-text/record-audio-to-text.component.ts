import { Component, signal } from '@angular/core';
import { AudioToTextService } from '../../services/audio-to-text.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-record-audio-to-text',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './record-audio-to-text.component.html',
  styleUrl: './record-audio-to-text.component.css',
})
export class RecordAudioToTextComponent {
  private mediaRecorder!: MediaRecorder;
  private audioChunks: Blob[] = [];
  isRecording = false;
  transcription: string | null = null;
  audioUrl!: string;

  loading: boolean = false;

  localAudioFileUrl = signal<string | null>(null);

  constructor(private audioToTextService: AudioToTextService) {}

  startRecording() {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        this.mediaRecorder = new MediaRecorder(stream);
        this.audioChunks = [];

        this.mediaRecorder.ondataavailable = (event) => {
          this.audioChunks.push(event.data);
        };

        // this.mediaRecorder.onstop = () => {
        //   const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
        //   this.sendAudioForTranscription(audioBlob);
        // };

        // this.mediaRecorder.onstop = () => {
        //   const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
        //   this.localAudioFileUrl = URL.createObjectURL(audioBlob);
        // };

        this.mediaRecorder.start();
        this.isRecording = true;
      })
      .catch((error) => {
        console.error('Error accessing microphone:', error);
      });
  }

  async stopRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        if (audioBlob.size > 0) {
          this.localAudioFileUrl.set(URL.createObjectURL(audioBlob));
          console.log('Recorded Blob URL:', this.localAudioFileUrl);
        } else {
          console.error('Recorded audio blob is empty');
        }
      };
    }
  }

  uploadAudio() {
    this.startLoading();
    const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
    this.sendAudioForTranscription(audioBlob);
  }

  private sendAudioForTranscription(audioBlob: Blob) {
    const file = new File([audioBlob], 'recording.wav', { type: 'audio/wav' });
    this.audioToTextService.transcribeAudioWithResource(file).subscribe(
      ({ transcription, audio }) => {
        console.log(transcription, audio);
        console.log('Transcription:', transcription);
        this.transcription = transcription.text;
        console.log('Audio File:', audio);
        const audioUrl = URL.createObjectURL(audio);
        console.log('Audio URL:', audioUrl);
        this.audioUrl = audioUrl;
        this.stopLoading();
      },
      (error) => {
        console.error('Error during transcription:', error);
        this.stopLoading();
      }
    );
  }

  private convertBlobToDataURL(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          resolve(reader.result.toString());
        } else {
          reject('Failed to convert Blob to Data URL');
        }
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(blob);
    });
  }

  startLoading() {
    this.loading = true;
  }
  stopLoading() {
    this.loading = false;
  }
}
