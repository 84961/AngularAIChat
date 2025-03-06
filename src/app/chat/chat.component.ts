import { Component, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  userInput = '';
  chatService = inject(ChatService);
  messages = this.chatService.getChatHistory();

  constructor() {
    effect(() => {
      // This effect will run whenever the chat history changes
      console.log(this.messages());
    });
  }

  sendMessage() {
    if (!this.userInput.trim()) return;
    const userMessage = this.userInput;
    this.userInput = '';
    this.chatService.sendMessage(userMessage).subscribe();
  }
}