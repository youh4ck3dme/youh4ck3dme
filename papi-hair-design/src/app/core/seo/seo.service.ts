import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  update(config: {
    title: string;
    description: string;
    url: string;
    image?: string;
    locale?: string;
    type?: string;
  }) {
    const fullTitle = `${config.title} | Papi Hair Design`;
    this.title.setTitle(fullTitle);
    this.meta.updateTag({ name: 'description', content: config.description });
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: config.description });
    this.meta.updateTag({ property: 'og:url', content: config.url });
    this.meta.updateTag({ property: 'og:type', content: config.type ?? 'website' });
    if (config.image) {
      this.meta.updateTag({ property: 'og:image', content: config.image });
      this.meta.updateTag({ name: 'twitter:image', content: config.image });
    }
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
    this.meta.updateTag({ name: 'twitter:description', content: config.description });

    const canonicalLink = this.ensureCanonical();
    canonicalLink.setAttribute('href', config.url);

    this.updateAlternateLinks(config.url, config.locale);
  }

  private ensureCanonical() {
    let element = this.document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
    if (!element) {
      element = this.document.createElement('link');
      element.setAttribute('rel', 'canonical');
      this.document.head.appendChild(element);
    }
    return element;
  }

  private updateAlternateLinks(url: string, locale = 'sk_SK') {
    const existing = Array.from(this.document.querySelectorAll("link[rel='alternate']"));
    existing.forEach((el) => el.remove());

    const locales = new Set<string>([locale, 'sk_SK', 'en_US']);
    locales.forEach((code) => {
      const alt = this.document.createElement('link');
      alt.setAttribute('rel', 'alternate');
      const lang = code.startsWith('sk') ? 'sk' : 'en';
      alt.setAttribute('hreflang', lang);
      alt.setAttribute('href', this.buildLocalizedUrl(url, lang));
      this.document.head.appendChild(alt);
    });
  }

  private buildLocalizedUrl(url: string, lang: 'sk' | 'en'): string {
    try {
      const parsed = new URL(url, this.document.baseURI);
      const segments = parsed.pathname.split('/').filter(Boolean);

      if (segments[0] === 'sk' || segments[0] === 'en') {
        segments[0] = lang;
      } else if (lang !== 'sk') {
        segments.unshift(lang);
      }

      parsed.pathname = `/${segments.join('/')}`;
      return parsed.toString();
    } catch (error) {
      console.warn('Unable to build localized URL', error);
      return url;
    }
  }
}
