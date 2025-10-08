import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { LangSwitcherComponent } from '../../../shared/ui/lang-switcher/lang-switcher.component';
import { ThemeSwitchComponent } from '../../../shared/ui/theme-switch/theme-switch.component';
import { TranslationService } from '../../../core/i18n/translation.service';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    NgClass,
    NgFor,
    LangSwitcherComponent,
    ThemeSwitchComponent,
    TranslatePipe,
    AsyncPipe,
    NgIf,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  private readonly i18n = inject(TranslationService);
  scrolled = signal(false);
  menuOpen = signal(false);

  navLinks = [
    { path: '/', label: 'nav.home' },
    { path: '/sluzby', label: 'nav.services' },
    { path: '/stylisti', label: 'nav.stylists' },
    { path: '/rezervacia', label: 'nav.booking' },
    { path: '/galeria', label: 'nav.gallery' },
    { path: '/blog', label: 'nav.blog' },
    { path: '/kontakt', label: 'nav.contact' },
    { path: '/install', label: 'nav.install' },
  ];

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled.set(window.scrollY > 24);
  }

  toggleMenu() {
    this.menuOpen.set(!this.menuOpen());
  }

  closeMenu() {
    this.menuOpen.set(false);
  }

  t(key: string) {
    return this.i18n.t(key);
  }
}
