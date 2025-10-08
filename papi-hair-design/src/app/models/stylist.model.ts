import { Slot } from './slot.model';

export interface Stylist {
  id: string;
  name: string;
  bio: string;
  skills: string[];
  avatar: string;
  rating: number;
  slots: Slot[];
}
