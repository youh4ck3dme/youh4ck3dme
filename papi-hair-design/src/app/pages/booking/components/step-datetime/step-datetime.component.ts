import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgFor } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Slot } from '../../../../models/slot.model';
import { TranslatePipe } from '../../../../core/i18n/translate.pipe';

@Component({
  selector: 'app-step-datetime',
  standalone: true,
  imports: [NgFor, ReactiveFormsModule, TranslatePipe],
  templateUrl: './step-datetime.component.html',
  styleUrl: './step-datetime.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepDatetimeComponent {
  @Input({ required: true }) form!: FormGroup;
  @Input() slots: Slot[] = [];
}
