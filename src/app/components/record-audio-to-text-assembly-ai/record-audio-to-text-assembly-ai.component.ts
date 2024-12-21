import { Component, signal } from '@angular/core';
import axios from 'axios';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-record-audio-to-text-assembly-ai',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './record-audio-to-text-assembly-ai.component.html',
  styleUrl: './record-audio-to-text-assembly-ai.component.css',
})
export class RecordAudioToTextAssemblyAiComponent {
  private mediaRecorder!: MediaRecorder;
  private audioChunks: Blob[] = [];
  isRecording = false;
  transcription: string | null = null;
  audioUrl!: string;

  loading: boolean = false;

  localAudioFileUrl = signal<string | null>(null);

  startRecording() {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        this.mediaRecorder = new MediaRecorder(stream);
        this.audioChunks = [];

        this.mediaRecorder.ondataavailable = (event) => {
          this.audioChunks.push(event.data);
        };

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

  private async sendAudioForTranscription(audioBlob: Blob) {
    const apiKey = environment.ASSEMBLYAI_KEY; // Replace with your AssemblyAI API Key
    const audioFile = new File([audioBlob], 'recording.wav', {
      type: 'audio/wav',
    });

    try {
      // Upload the audio file to AssemblyAI
      const uploadResponse = await axios.post(
        'https://api.assemblyai.com/v2/upload',
        audioFile,
        {
          headers: { authorization: apiKey },
        }
      );

      // Start transcription
      const transcriptionResponse = await axios.post(
        'https://api.assemblyai.com/v2/transcript',
        { audio_url: uploadResponse.data.upload_url },
        {
          headers: { authorization: apiKey },
        }
      );

      // Poll for transcription completion
      const transcriptId = transcriptionResponse.data.id;
      let transcriptData;
      do {
        transcriptData = await axios.get(
          `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
          { headers: { authorization: apiKey } }
        );
        await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds
      } while (transcriptData.data.status !== 'completed');

      this.transcription = transcriptData.data.text;
      this.stopLoading();
    } catch (error) {
      console.error('Error during transcription:', error);
    }
  }

  startLoading() {
    this.loading = true;
  }
  stopLoading() {
    this.loading = false;
  }
}
