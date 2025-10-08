import { ChangeDetectionStrategy, Component, HostBinding, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './layout/components/navbar/navbar.component';
import { FooterComponent } from './layout/components/footer/footer.component';
import { ToastContainerComponent } from './shared/ui/toast-container/toast-container.component';
import { ThemeService } from './core/services/theme.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, ToastContainerComponent, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private readonly themeService = inject(ThemeService);

  @HostBinding('attr.data-theme') theme: string | null = null;

  constructor() {
    effect(() => {
      const value = this.themeService.theme();
      this.theme = value;
      document.documentElement.setAttribute('data-theme', value);
    });
  }
}
