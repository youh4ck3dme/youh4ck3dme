import { AsyncPipe, CommonModule, NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { GalleryService, GalleryItem } from '../../core/services/gallery.service';
import { LightboxComponent } from '../../shared/gallery/lightbox/lightbox.component';
import { SeoService } from '../../core/seo/seo.service';
import { TranslatePipe } from '../../core/i18n/translate.pipe';

@Component({
  selector: 'app-gallery-page',
  standalone: true,
  imports: [CommonModule, NgFor, LightboxComponent, AsyncPipe, TranslatePipe],
  templateUrl: './gallery-page.component.html',
  styleUrl: './gallery-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GalleryPageComponent {
  private readonly gallery = inject(GalleryService);
  private readonly seo = inject(SeoService);

  filter = signal<string | undefined>(undefined);
  items$ = this.gallery.getAll();
  lightboxOpen = signal(false);
  activeItem = signal<GalleryItem | undefined>(undefined);

  constructor() {
    this.seo.update({
      title: 'Galéria',
      description: 'Pozrite si signature looky Papi Hair Design vrátane 4D stylingov.',
      url: 'https://papi-hair.example/galeria',
    });
  }

  setFilter(tag?: string) {
    this.filter.set(tag);
    this.items$ = this.gallery.filterByTag(tag);
  }

  openLightbox(item: GalleryItem) {
    this.activeItem.set(item);
    this.lightboxOpen.set(true);
  }

  closeLightbox() {
    this.lightboxOpen.set(false);
  }
}
