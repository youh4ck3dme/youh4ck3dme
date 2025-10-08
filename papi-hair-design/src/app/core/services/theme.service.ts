import { Injectable, WritableSignal, effect, signal } from '@angular/core';

type ThemeMode = 'dark' | 'light' | 'amoled';

const THEME_KEY = 'papi-theme-preference';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly themeSignal: WritableSignal<ThemeMode> = signal(this.getInitialTheme());
  readonly theme = this.themeSignal.asReadonly();

  constructor() {
    effect(() => {
      try {
        localStorage.setItem(THEME_KEY, this.themeSignal());
      } catch (error) {
        console.warn('Unable to persist theme preference', error);
      }
    });
  }

  setTheme(mode: ThemeMode) {
    this.themeSignal.set(mode);
  }

  cycleTheme() {
    const order: ThemeMode[] = ['dark', 'amoled', 'light'];
    const current = this.themeSignal();
    const nextIndex = (order.indexOf(current) + 1) % order.length;
    this.setTheme(order[nextIndex]);
  }

  private getInitialTheme(): ThemeMode {
    try {
      const stored = localStorage.getItem(THEME_KEY) as ThemeMode | null;
      return stored ?? 'dark';
    } catch (error) {
      console.warn('Unable to read stored theme preference', error);
      return 'dark';
    }
  }
}
