import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-rating-stars',
  standalone: true,
  imports: [NgFor],
  templateUrl: './rating-stars.component.html',
  styleUrl: './rating-stars.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RatingStarsComponent {
  @Input() rating = 0;

  get stars() {
    return Array.from({ length: 5 }, (_, index) => index < Math.round(this.rating));
  }
}
