import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-glass-card',
  standalone: true,
  imports: [NgClass, NgIf],
  templateUrl: './glass-card.component.html',
  styleUrl: './glass-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlassCardComponent {
  @Input() heading = '';
  @Input() description = '';
  @Input() icon?: string;
}
