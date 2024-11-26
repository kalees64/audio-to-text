import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { AssemblyAI } from 'assemblyai';
import { environment } from '../environments/environment.development';
import { HomeComponent } from './components/home/home.component';
import { RecordAudioToTextComponent } from './components/record-audio-to-text/record-audio-to-text.component';
import { AudioToTextOpenAiComponent } from './components/audio-to-text-open-ai/audio-to-text-open-ai.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RecordAudioToTextComponent,
    AudioToTextOpenAiComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  selectedFile: File | null = null;
  audioFileLink: string | null = null;
  loading: boolean = false;

  text: string = '';

  client = new AssemblyAI({
    apiKey: environment.ASSEMBLYAI_KEY,
  });

  constructor(private http: HttpClient) {}

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
    }
  }

  uploadFile(): void {
    this.startLoading();
    if (!this.selectedFile) {
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    const headers = new HttpHeaders({
      Authorization: environment.ASSEMBLYAI_KEY,
    });

    this.http
      .post<{ upload_url: string }>(
        environment.ASSEMBLYAI_UPLOAD_API,
        formData,
        { headers }
      )
      .subscribe(
        (response) => {
          this.audioFileLink = response.upload_url;
          console.log('Audio file link:', this.audioFileLink);
          this.audioToText();
        },
        (error) => {
          console.error('Error uploading file:', error);
        }
      );
  }

  async audioToText() {
    if (this.audioFileLink) {
      const params = {
        audio: this.audioFileLink,
        speaker_labels: true,
      };
      const transcript = await this.client.transcripts.transcribe(params);

      if (transcript.status === 'error') {
        console.error(`Transcription failed: ${transcript.error}`);
        process.exit(1);
      }

      console.log(transcript.text);
      if (transcript.text) {
        this.text = transcript.text;
      }
      this.stopLoading();
      for (let utterance of transcript.utterances!) {
        console.log(`Speaker ${utterance.speaker}: ${utterance.text}`);
      }
    }
  }

  startLoading() {
    this.loading = true;
  }
  stopLoading() {
    this.loading = false;
  }
}
