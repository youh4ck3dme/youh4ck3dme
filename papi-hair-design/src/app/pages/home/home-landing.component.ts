import { AsyncPipe, CommonModule, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable, map } from 'rxjs';
import { HeroParallaxComponent } from '../../shared/ui/hero-parallax/hero-parallax.component';
import { GlassCardComponent } from '../../shared/ui/glass-card/glass-card.component';
import { AvatarComponent } from '../../shared/ui/avatar/avatar.component';
import { RatingStarsComponent } from '../../shared/ui/rating-stars/rating-stars.component';
import { ServicesService } from '../../core/services/services.service';
import { TranslationService } from '../../core/i18n/translation.service';
import { ServicesPageQuickItem } from './home.models';
import { SeoService } from '../../core/seo/seo.service';
import { GalleryService, GalleryItem } from '../../core/services/gallery.service';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-home-landing',
  standalone: true,
  imports: [
    CommonModule,
    HeroParallaxComponent,
    GlassCardComponent,
    AvatarComponent,
    RatingStarsComponent,
    NgFor,
    RouterLink,
    AsyncPipe,
    NgIf,
    TranslatePipe,
  ],
  templateUrl: './home-landing.component.html',
  styleUrl: './home-landing.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeLandingComponent implements OnInit {
  private readonly servicesService = inject(ServicesService);
  private readonly i18n = inject(TranslationService);
  private readonly seo = inject(SeoService);
  private readonly gallery = inject(GalleryService);
  private readonly sanitizer = inject(DomSanitizer);

  quickServices$: Observable<ServicesPageQuickItem[]> = this.servicesService.getAll().pipe(
    map((services) =>
      services.map((service) => ({
        title: service.name,
        description: service.description,
        duration: service.durationMin,
        image: service.image,
      })),
    ),
  );

  spotlight$: Observable<GalleryItem[]> = this.gallery
    .getAll()
    .pipe(map((items) => items.slice(0, 3)));
  schemaMarkup!: SafeHtml;

  ngOnInit(): void {
    this.seo.update({
      title: 'Home',
      description: 'Papi Hair Design – couture kadernícky salón s luxusnou starostlivosťou.',
      url: 'https://papi-hair.example/home',
      image: 'assets/icons/icon-512x512.png',
    });

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': 'https://papi-hair.example',
      name: 'Papi Hair Design',
      image: 'https://papi-hair.example/assets/icons/icon-512x512.png',
      description: 'Couture kadernícky salón v Bratislave.',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Laurinská 18',
        addressLocality: 'Bratislava',
        addressCountry: 'SK',
      },
      url: 'https://papi-hair.example',
      telephone: '+421905123456',
      priceRange: '$$$',
    };

    this.schemaMarkup = this.sanitizer.bypassSecurityTrustHtml(
      `<script type="application/ld+json">${JSON.stringify(schema)}</script>`,
    );
  }

  t(key: string) {
    return this.i18n.t(key);
  }
}
