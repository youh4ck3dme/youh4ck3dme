import { AsyncPipe, CommonModule, NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { StylistsService } from '../../core/services/stylists.service';
import { AvatarComponent } from '../../shared/ui/avatar/avatar.component';
import { RatingStarsComponent } from '../../shared/ui/rating-stars/rating-stars.component';
import { SeoService } from '../../core/seo/seo.service';
import { TranslatePipe } from '../../core/i18n/translate.pipe';

@Component({
  selector: 'app-stylists-page',
  standalone: true,
  imports: [CommonModule, NgFor, AvatarComponent, RatingStarsComponent, AsyncPipe, TranslatePipe],
  templateUrl: './stylists-page.component.html',
  styleUrl: './stylists-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StylistsPageComponent implements OnInit {
  private readonly stylistsService = inject(StylistsService);
  private readonly seo = inject(SeoService);

  stylists$ = this.stylistsService.getAll();

  ngOnInit(): void {
    this.seo.update({
      title: 'Stylisti',
      description:
        'Zoznámte sa s tímom kaderníkov Papi Hair Design vrátane ich špecializácií a voľných termínov.',
      url: 'https://papi-hair.example/stylisti',
    });
  }
}
