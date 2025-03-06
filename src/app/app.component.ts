import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { AAChatComponent } from './airline-ai/aa-chat.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,ChatComponent,AAChatComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'angular-chat-bot';
}
