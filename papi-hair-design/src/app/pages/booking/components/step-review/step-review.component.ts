import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { Booking } from '../../../../models/booking.model';
import { TranslatePipe } from '../../../../core/i18n/translate.pipe';

@Component({
  selector: 'app-step-review',
  standalone: true,
  imports: [NgIf, TranslatePipe],
  templateUrl: './step-review.component.html',
  styleUrl: './step-review.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepReviewComponent {
  @Input() booking: Booking | null | undefined;
}
