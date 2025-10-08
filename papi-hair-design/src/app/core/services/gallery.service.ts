import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import galleryData from '../../data/gallery.json';

export interface GalleryItem {
  id: string;
  title: string;
  tags: string[];
  description: string;
  image: string;
  thumbnail: string;
}

@Injectable({ providedIn: 'root' })
export class GalleryService {
  private readonly items = galleryData as GalleryItem[];

  getAll(): Observable<GalleryItem[]> {
    return of(this.items);
  }

  filterByTag(tag?: string): Observable<GalleryItem[]> {
    if (!tag) {
      return this.getAll();
    }
    const normalized = tag.toLowerCase();
    return of(this.items.filter((item) => item.tags.some((t) => t.toLowerCase() === normalized)));
  }
}
