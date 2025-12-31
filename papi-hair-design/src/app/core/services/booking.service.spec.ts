import { BookingService } from './booking.service';

describe('BookingService', () => {
  let service: BookingService;
  const originalNavigator = navigator.onLine;

  beforeEach(() => {
    localStorage.clear();
    Object.defineProperty(navigator, 'onLine', { value: false, configurable: true });
    service = new BookingService();
  });

  afterEach(() => {
    Object.defineProperty(navigator, 'onLine', { value: originalNavigator, configurable: true });
  });

  it('queues booking when offline', () => {
    const booking = service.createBooking({
      serviceId: 'test',
      stylistId: 'stylist',
      slot: { dateISO: '2024-07-01', start: '10:00', end: '11:00', isAvailable: true },
      customer: { name: 'Test', phone: '+421', email: 'test@example.com' },
      notes: '',
    });

    expect(booking.status).toBe('queued');
    expect(service.queue$().length).toBe(1);
  });
});
