import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {HeadersType, BodyType } from '../common/types';


@Injectable({ providedIn: 'root' })
export class ChatService {
  private useAzureOpenAI = environment.useAzureOpenAI;

  private apiUrl = this.useAzureOpenAI ? environment.apiUrl : environment.githubapiUrl;
  private apiKey = this.useAzureOpenAI ? environment.apiKey : environment.githubapiKey;
  
  http = inject(HttpClient);

  private chatHistory = signal<{ role: string; content: string }[]>([
    { role: 'system', content: 'You are a helpful witty assistant who gives back responses with a touch of humour respond back in markdown' }
  ]);

  constructor() {}

  sendMessage(message: string): Observable<any> {
    this.chatHistory.update(history => [...history, { role: 'user', content: message }]);

    const headers = this.useAzureOpenAI
      ? new HttpHeaders({
          'api-key': this.apiKey,
          'Content-Type': 'application/json'
        })
      : { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.apiKey}` } as HeadersType;

    const body: BodyType = this.useAzureOpenAI 
      ? { messages: this.chatHistory() }
      : { messages: this.chatHistory(), model: 'gpt-4o-mini' };

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