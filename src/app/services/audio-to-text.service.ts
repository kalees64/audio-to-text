import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AudioToTextService {
  private apiUrl = environment.OPENAI_API;
  private apiKey = environment.OPENAI_KEY;

  constructor(private http: HttpClient) {}

  //Only audio to text

  // transcribeAudio(file: File): Observable<any> {
  //   const formData = new FormData();
  //   formData.append('file', file, file.name);
  //   formData.append('model', 'whisper-1');

  //   const headers = new HttpHeaders({
  //     Authorization: `Bearer ${this.apiKey}`,
  //   });

  //   return this.http.post(this.apiUrl, formData, { headers });
  // }

  //------------------------------------------------------------------------------------------------------

  // Audio to text and audio blob

  transcribeAudioWithResource(
    file: File
  ): Observable<{ transcription: any; audio: File }> {
    return new Observable((observer) => {
      // Step 1: Transcribe Audio
      const formData = new FormData();
      formData.append('file', file, file.name);
      formData.append('model', 'whisper-1');

      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.apiKey}`,
      });

      this.http.post(this.apiUrl, formData, { headers }).subscribe(
        (transcription) => {
          // Step 2: Combine the transcription with the audio file
          observer.next({
            transcription,
            audio: file, // Returning the original file
          });
          observer.complete();
        },
        (error) => {
          observer.error(error);
        }
      );
    });
  }

  // private getAudioResource(file: File): Observable<Blob> {
  //   const audioUrl = `${this.apiUrl}/audio/${file.name}`; // Replace with the correct endpoint
  //   const headers = new HttpHeaders({
  //     Authorization: `Bearer ${this.apiKey}`,
  //   });

  //   return this.http.get(audioUrl, { headers, responseType: 'blob' });
  // }
}
