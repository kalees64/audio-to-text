import { Component } from '@angular/core';
import { AudioToTextService } from '../../services/audio-to-text.service';
import { FileSaverService } from 'ngx-filesaver';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  audioFile: File | null = null;
  transcribedText!: string;
  audioUrl!: string;
  loading: boolean = false;

  constructor(
    private audioToTextService: AudioToTextService,
    private fileSaver: FileSaverService
  ) {}

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.audioFile = file;
    }
  }

  // Only Audio to text

  // transcribe(): void {
  //   this.startLoading();
  //   if (this.audioFile) {
  //     this.audioToTextService.transcribeAudio(this.audioFile).subscribe(
  //       (response) => {
  //         console.log(response);
  //         this.transcribedText = response.text;
  //         this.stopLoading();
  //       },
  //       (error) => {
  //         console.error('Error transcribing audio:', error);
  //         this.stopLoading();
  //       }
  //     );
  //   }
  // }

  //-----------------------------------------------------------------------------------------------------

  // Audio to text and audio blob

  transcribe(): void {
    this.startLoading();
    if (this.audioFile) {
      this.audioToTextService
        .transcribeAudioWithResource(this.audioFile)
        .subscribe(
          ({ transcription, audio }) => {
            console.log('Transcription:', transcription);
            this.transcribedText = transcription.text;
            console.log('Audio File:', audio);
            const audioUrl = URL.createObjectURL(audio);
            console.log('Audio URL:', audioUrl);
            this.audioUrl = audioUrl;
            this.stopLoading();
          },
          (error) => {
            console.error('Error:', error);
            this.stopLoading();
          }
        );
    }
  }

  startLoading() {
    this.loading = true;
  }
  stopLoading() {
    this.loading = false;
  }
}
