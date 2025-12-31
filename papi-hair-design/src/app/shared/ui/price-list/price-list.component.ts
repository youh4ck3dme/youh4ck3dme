import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgFor } from '@angular/common';
import { Service } from '../../../models/service.model';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';

@Component({
  selector: 'app-price-list',
  standalone: true,
  imports: [NgFor, TranslatePipe],
  templateUrl: './price-list.component.html',
  styleUrl: './price-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PriceListComponent {
  @Input({ required: true }) services: Service[] = [];
}
