import { Injectable, computed, signal } from '@angular/core';
import sk from '../../../assets/i18n/sk.json';
import en from '../../../assets/i18n/en.json';

type SupportedLang = 'sk' | 'en';
type Dictionary = typeof sk;

const STORAGE_KEY = 'papi-lang';

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private readonly dictionaries: Record<SupportedLang, Dictionary> = { sk, en };
  private readonly languageSignal = signal<SupportedLang>(this.readStoredLanguage());

  readonly lang$ = computed(() => this.languageSignal());
  readonly dictionary$ = computed(() => this.dictionaries[this.languageSignal()]);

  t(path: string): string {
    const segments = path.split('.');
    let current: unknown = this.dictionaries[this.languageSignal()];

    for (const key of segments) {
      if (typeof current !== 'object' || current === null || !(key in current)) {
        return path;
      }
      current = (current as Record<string, unknown>)[key];
    }

    return typeof current === 'string' ? current : path;
  }

  switch(lang: SupportedLang) {
    this.languageSignal.set(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (error) {
      console.warn('Unable to persist language preference', error);
    }
  }

  toggle() {
    this.switch(this.languageSignal() === 'sk' ? 'en' : 'sk');
  }

  private readStoredLanguage(): SupportedLang {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as SupportedLang | null;
      if (stored === 'sk' || stored === 'en') {
        return stored;
      }
      return 'sk';
    } catch (error) {
      console.warn('Unable to read stored language preference', error);
      return 'sk';
    }
  }
}
