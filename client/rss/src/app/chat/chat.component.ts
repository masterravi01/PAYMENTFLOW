import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../services/global.service';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  messages: any[] = [];
  message: string = '';
  user: string = '';

  constructor(private chatService: GlobalService) {}
  ngOnInit(): void {
    this.chatService.receiveMessages().subscribe((data) => {
      this.messages.push(data);
    });
  }

  sendMessage() {
    if (this.message.trim() && this.user.trim()) {
      this.chatService.sendMessage(this.message, this.user);
      this.message = '';
    }
  }
}
