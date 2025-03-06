import { Component, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AAChatService } from './aa-chat.service';


@Component({
  selector: 'aa-app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './aa-chat.component.html',
  styleUrls: ['./aa-chat.component.scss']
})
export class AAChatComponent {
  userInput = '';
  chatService = inject(AAChatService);
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