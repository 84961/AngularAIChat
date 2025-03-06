import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class ChatService {
  private apiUrl = environment.apiUrl;
  private apiKey = environment.apiKey;
  http = inject(HttpClient);

  private chatHistory = signal<{ role: string; content: string }[]>([
    { role: 'system', content: 'You are a helpful witty assistant who gives back responses with a touch of humour' }
  ]);

  constructor() {}

  sendMessage(message: string): Observable<any> {
    this.chatHistory.update(history => [...history, { role: 'user', content: message }]);
    const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.apiKey}` };
    const body = { messages: this.chatHistory(), model: 'gpt-4o-mini' };

    return new Observable(observer => {
      this.http.post<any>(this.apiUrl, body, { headers }).subscribe(response => {
        const botReply = response?.choices?.[0]?.message?.content || 'Error: No response';
        this.chatHistory.update(history => [...history, { role: 'system', content: botReply }]);
        observer.next(botReply);
        observer.complete();
      }, error => observer.error(error));
    });
  }

  getChatHistory() {
    return this.chatHistory.asReadonly();
  }
}