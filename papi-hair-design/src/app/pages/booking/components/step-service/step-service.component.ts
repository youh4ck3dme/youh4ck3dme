import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgFor } from '@angular/common';
import { Service } from '../../../../models/service.model';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '../../../../core/i18n/translate.pipe';

@Component({
  selector: 'app-step-service',
  standalone: true,
  imports: [NgFor, ReactiveFormsModule, TranslatePipe],
  templateUrl: './step-service.component.html',
  styleUrl: './step-service.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepServiceComponent {
  @Input({ required: true }) services: Service[] = [];
  @Input({ required: true }) form!: FormGroup;
}
