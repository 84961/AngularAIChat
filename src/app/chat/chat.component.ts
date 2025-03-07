import { Component, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from './chat.service';
import { RouterModule } from '@angular/router';
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

  sendMessage() {
    if (!this.userInput.trim()) return;
    const userMessage = this.userInput;
    this.userInput = '';
    this.chatService.sendMessage(userMessage).subscribe();
  }
}