import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-offline-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './offline-page.component.html',
  styleUrl: './offline-page.component.scss',
})
export class OfflinePageComponent {}
