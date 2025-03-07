import { Component } from '@angular/core';
import { WhisperService } from './whisper.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { inject } from '@angular/core';

@Component({
  selector: 'app-whisper',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './whisper.component.html',
  styleUrls: ['./whisper.component.scss']
})
export class WhisperComponent {
  audioFile: File | null = null;
  transcription: string = '';
  isLoading: boolean = false;
  error: string | null = null;
  whisperService = inject(WhisperService);

  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (!file) {
      this.error = 'Please select a valid audio file.';
      return;
    }

    // Check file extension as well as MIME type
    const validExtensions = ['.mp3', '.wav', '.flac'];
    const fileExt = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (!validExtensions.includes(fileExt)) {
      this.error = `Unsupported file type. Please upload MP3, WAV, or FLAC files only.`;
      this.audioFile = null;
      return;
    }

    this.audioFile = file;
    this.error = null;
    console.log('File selected:', file.name, 'Type:', file.type, 'Size:', file.size);
  }

  async transcribe() {
    if (!this.audioFile) {
      this.error = 'Please select a supported audio file first.';
      return;
    }
  
    this.isLoading = true;
    this.error = null;
    this.transcription = '';
    
    console.log('📡 Sending file to Whisper API...', this.audioFile.type);
    this.whisperService.transcribeAudio(this.audioFile).subscribe({
      next: (res) => {
        console.log('📜 Transcription received:', res);
        if (typeof res === 'string') {
          this.transcription = res;
        } else if (res && res.text) {
          this.transcription = res.text;
        } else {
          this.error = 'Invalid response format from server';
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('🚨 API Error:', err);
        this.isLoading = false;
        
        // More specific error handling
        if (err.status === 400) {
          this.error = 'Invalid file format. Please use MP3, WAV, or FLAC files only.';
        } else if (err.error?.message) {
          this.error = err.error.message;
        } else if (typeof err.error === 'string') {
          this.error = err.error;
        } else {
          this.error = 'An unexpected error occurred during transcription';
        }
      }
    });
  }
}