import { Component, computed, effect, inject } from '@angular/core';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from './chat.service';
import { RouterModule } from '@angular/router';
import { marked } from 'marked';
@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  userInput = '';
  chatService = inject(ChatService);
  sanitizer = inject(DomSanitizer);
  messages = computed(() => {
    const history = this.chatService.getChatHistory()();
    return history.length > 1 ? history.slice(1) : [];
  });
  

  constructor() {
    effect(() => {
      // This effect will run whenever the chat history changes
      console.log(this.messages());
    });
  }

  parseMarkdown(content: string): SafeHtml {
    const html = marked.parse(content) as string; // Ensure the result is a string
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  sendMessage() {
    if (!this.userInput.trim()) return;
    const userMessage = this.userInput;
    this.userInput = '';
    this.chatService.sendMessage(userMessage).subscribe();
  }
}