import { Component } from '@angular/core';
import { TranslatePipe } from '../../core/i18n/translate.pipe';

@Component({
  selector: 'app-policy-page',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './policy-page.component.html',
  styleUrl: './policy-page.component.scss',
})
export class PolicyPageComponent {}
