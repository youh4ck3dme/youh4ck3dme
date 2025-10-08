import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-lightbox',
  standalone: true,
  imports: [NgIf],
  templateUrl: './lightbox.component.html',
  styleUrl: './lightbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LightboxComponent {
  @Input() open = false;
  @Input() image?: { src: string; title: string; description?: string };
  @Output() closed = new EventEmitter<void>();
}
