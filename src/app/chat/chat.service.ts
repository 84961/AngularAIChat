import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';
import { HttpClient, HttpHeaders } from "@angular/common/http";

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
    // below is how we need to pass for github marketplace model
    //const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.apiKey}` };
    
    // below is how we need to pass for azure open ai
    const headers = new HttpHeaders({
      'api-key': this.apiKey,
      'Content-Type': 'application/json'
    });
    // for github marketplace  need to pass the model name
    //const body = { messages: this.chatHistory(), model: 'gpt-4o-mini' };
    // for azure open ai  no need cause it will be in the api url
    const body = { messages: this.chatHistory() };

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