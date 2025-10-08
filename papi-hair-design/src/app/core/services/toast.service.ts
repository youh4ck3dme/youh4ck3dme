import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: number;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly messagesSignal = signal<ToastMessage[]>([]);
  private counter = 0;

  messages$ = this.messagesSignal.asReadonly();

  show(message: string, type: ToastMessage['type'] = 'info', duration = 4000) {
    const toast: ToastMessage = { id: ++this.counter, message, type };
    this.messagesSignal.set([...this.messagesSignal(), toast]);
    setTimeout(() => this.dismiss(toast.id), duration);
  }

  dismiss(id: number) {
    this.messagesSignal.set(this.messagesSignal().filter((toast) => toast.id !== id));
  }
}
