export interface Service {
  id: string;
  name: string;
  category: 'cut' | 'color' | 'styling';
  durationMin: number;
  priceFrom: number;
  priceTo: number;
  description: string;
  image: string;
}
