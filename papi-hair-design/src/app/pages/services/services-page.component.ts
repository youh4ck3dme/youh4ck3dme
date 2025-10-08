import { AsyncPipe, CommonModule, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ServicesService } from '../../core/services/services.service';
import { Service } from '../../models/service.model';
import { SeoService } from '../../core/seo/seo.service';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { PriceListComponent } from '../../shared/ui/price-list/price-list.component';

@Component({
  selector: 'app-services-page',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, TranslatePipe, PriceListComponent, AsyncPipe, RouterLink],
  templateUrl: './services-page.component.html',
  styleUrl: './services-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesPageComponent implements OnInit {
  private readonly servicesService = inject(ServicesService);
  private readonly seo = inject(SeoService);

  services$ = this.servicesService.getAll();
  readonly categories: Service['category'][] = ['cut', 'color', 'styling'];

  ngOnInit(): void {
    this.seo.update({
      title: 'Služby',
      description:
        'Katalóg kaderníckych služieb Papi Hair Design vrátane couture strihov a farbenia.',
      url: 'https://papi-hair.example/sluzby',
    });
  }

  groupByCategory(services: Service[], category: Service['category']) {
    return services.filter((service) => service.category === category);
  }
}
