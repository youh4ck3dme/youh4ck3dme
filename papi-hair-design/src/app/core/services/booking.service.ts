import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { Booking } from '../../models/booking.model';
import { v4 as uuid } from 'uuid';

const QUEUE_KEY = 'papi-booking-queue';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private readonly queueSignal = signal<Booking[]>(this.loadQueue());
  private readonly destroyRef = inject(DestroyRef);
  private readonly onlineHandler = () => this.flushQueue();

  constructor() {
    window.addEventListener('online', this.onlineHandler);
    this.destroyRef.onDestroy(() => {
      window.removeEventListener('online', this.onlineHandler);
    });
  }

  get queue$() {
    return this.queueSignal.asReadonly();
  }

  createBooking(payload: Omit<Booking, 'id' | 'status'>) {
    const status: Booking['status'] = navigator.onLine ? 'pending' : 'queued';
    const booking: Booking = {
      ...payload,
      id: uuid(),
      status,
    };

    if (navigator.onLine) {
      this.simulateSubmission(booking);
    } else {
      this.enqueue(booking);
    }
    return booking;
  }

  private enqueue(booking: Booking) {
    const queuedBooking: Booking = { ...booking, status: 'queued' };
    const updated: Booking[] = [...this.queueSignal(), queuedBooking];
    this.queueSignal.set(updated);
    this.persist(updated);
  }

  flushQueue() {
    const queue = [...this.queueSignal()];
    if (!queue.length) {
      return;
    }
    queue.forEach((booking) => {
      const pending: Booking = { ...booking, status: 'pending' };
      this.simulateSubmission(pending);
    });
    this.queueSignal.set([]);
    this.persist([]);
  }

  private simulateSubmission(booking: Booking) {
    console.info('Simulating booking submission', booking);
    // Simulate network latency
    setTimeout(() => {
      console.info('Booking confirmed', booking.id);
    }, 1500);
  }

  private persist(queue: Booking[]) {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  }

  private loadQueue(): Booking[] {
    try {
      const raw = localStorage.getItem(QUEUE_KEY);
      return raw ? (JSON.parse(raw) as Booking[]) : [];
    } catch (error) {
      console.error('Failed to load booking queue', error);
      return [];
    }
  }
}
