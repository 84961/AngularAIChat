import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserContentRequest } from '../common/models';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MarkdownUtils } from '../utils/markdown.utils';
import { CodeConverterService } from './code-converter.service';

@Component({
  selector: 'app-code-converter',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './code-converter.component.html',
  styleUrls: ['./code-converter.component.scss']
})
export class CodeConverterComponent {
  audioFile: File | null = null;
  transcription: string = '';
  isLoading: boolean = false;
  error: string | null = null;
  codeConverterService = inject(CodeConverterService);
  convertedCode:string = '';
  sanitizer = inject(DomSanitizer);
  isConvertingCode = false;
  pythonCode: string = '';
  selectedModel: string = 'gpt-4o-mini';

  parseMarkdown(content: string): SafeHtml {
    return MarkdownUtils.parseMarkdown(content, this.sanitizer);
  }
  
 
  async convert(code: string, modelName: string) {
    if (!code.trim()) return;
    
    this.isConvertingCode = true;
    const request: UserContentRequest = { userContent: JSON.stringify(code) };
    
    this.codeConverterService.convertCode(request,modelName).subscribe({
        next: (response) => {
            this.convertedCode = response.text;
            this.isConvertingCode = false;
        },
        error: (error) => {
            console.error('Error encountered during conversion:', error);
            this.isConvertingCode = false;
        }
    });
  }

 
  
}