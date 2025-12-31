import { Slot } from './slot.model';

export interface Booking {
  id: string;
  serviceId: string;
  stylistId: string;
  slot: Slot;
  customer: {
    name: string;
    phone: string;
    email: string;
  };
  notes?: string;
  status: 'pending' | 'confirmed' | 'queued';
}
