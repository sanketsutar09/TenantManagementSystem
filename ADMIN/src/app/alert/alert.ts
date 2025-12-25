import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-alert',
  imports: [CommonModule],
  templateUrl: './alert.html',
  styleUrl: './alert.css'
})
export class Alert {
@Input() message: string | null = null;
@Input() type: 'success' | 'error' | 'warning' = 'success';

// message: string | null = null;
// type: 'success' | 'error' | 'warning' = 'success';
timeoutId: any;

showMessage(msg: string, type: 'success' | 'error' | 'warning' = 'success') {
  this.message = msg;
  this.type = type;

  if (this.timeoutId) {
    clearTimeout(this.timeoutId);
  }

  this.timeoutId = setTimeout(() => {
    this.closeMessage();
  }, 3000);
}

closeMessage() {
  this.message = null;
  clearTimeout(this.timeoutId);
}
}
