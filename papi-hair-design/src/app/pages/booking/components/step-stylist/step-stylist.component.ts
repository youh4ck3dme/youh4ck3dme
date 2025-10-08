import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Stylist } from '../../../../models/stylist.model';
import { AvatarComponent } from '../../../../shared/ui/avatar/avatar.component';
import { RatingStarsComponent } from '../../../../shared/ui/rating-stars/rating-stars.component';
import { TranslatePipe } from '../../../../core/i18n/translate.pipe';

@Component({
  selector: 'app-step-stylist',
  standalone: true,
  imports: [NgFor, NgIf, ReactiveFormsModule, AvatarComponent, RatingStarsComponent, TranslatePipe],
  templateUrl: './step-stylist.component.html',
  styleUrl: './step-stylist.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepStylistComponent {
  @Input({ required: true }) stylists: Stylist[] = [];
  @Input({ required: true }) form!: FormGroup;
}
