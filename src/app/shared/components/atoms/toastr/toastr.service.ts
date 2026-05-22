import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error';

export interface Toast {
  type: ToastType;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ToastrService {
  readonly toasts = signal<Toast[]>([]);

  success(message: string): void {
    this.add('success', message);
  }

  error(message: string): void {
    this.add('error', message);
  }

  dismiss(toast: Toast): void {
    this.toasts.update(list => list.filter(t => t !== toast));
  }

  private add(type: ToastType, message: string): void {
    const toast: Toast = { type, message };
    this.toasts.update(list => [...list, toast]);
    setTimeout(() => this.dismiss(toast), 4000);
  }
}
