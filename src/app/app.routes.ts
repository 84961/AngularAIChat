import { Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { AAChatComponent } from './airline-ai/aa-chat.component';
import { NavigationComponent } from './navigation/navigation.component';

export const routes: Routes = [
  { path: 'chat', component: ChatComponent },
  { path: 'aa-chat', component: AAChatComponent },
  { path: 'home', component: NavigationComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' } // Default route
];
