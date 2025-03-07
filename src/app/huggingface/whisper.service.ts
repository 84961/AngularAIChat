import { inject,Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WhisperService {
    private apiUrl:string = `${environment.backendEndpoint}/api/SpeechToText/transcribe-azure`;
    http = inject(HttpClient);
  
    constructor() {}
  
    transcribeAudio(file: File): Observable<any> {
      const formData = new FormData();
      formData.append('audioFile', file);  // Changed from 'file' to 'audioFile' to match the API
  
      // Remove the Content-Type header - let the browser set it automatically for FormData
      //return this.http.post<any>(this.apiUrl, formData);

      return this.http.post<any>(this.apiUrl, formData, {
        headers: {
          // Remove Content-Type header to let browser set it with boundary
          'Accept': '*/*'
        }
      });
    }
  }