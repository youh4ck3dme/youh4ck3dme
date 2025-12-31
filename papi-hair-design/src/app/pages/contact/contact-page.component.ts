import { ChangeDetectionStrategy, Component, OnDestroy, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SeoService } from '../../core/seo/seo.service';
import { ToastService } from '../../core/services/toast.service';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { NgIf } from '@angular/common';
import { TranslationService } from '../../core/i18n/translation.service';

const CONTACT_STORAGE_KEY = 'papi-contact-drafts';

interface ContactFormValue {
  name: string;
  email: string;
  message: string;
}

interface StoredDraft extends ContactFormValue {
  createdAt: string;
}

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe, NgIf],
  templateUrl: './contact-page.component.html',
  styleUrl: './contact-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactPageComponent implements OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly seo = inject(SeoService);
  private readonly toast = inject(ToastService);
  private readonly i18n = inject(TranslationService);

  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    message: ['', Validators.required],
  });

  isOffline = !navigator.onLine;

  constructor() {
    this.seo.update({
      title: 'Kontakt',
      description: 'Spojte sa s Papi Hair Design – rezervácie, otázky a spolupráce.',
      url: 'https://papi-hair.example/kontakt',
    });

    this.offlineHandler = () => (this.isOffline = true);
    this.onlineHandler = () => this.flushDrafts();
    window.addEventListener('offline', this.offlineHandler);
    window.addEventListener('online', this.onlineHandler);
  }

  private offlineHandler!: () => void;
  private onlineHandler!: () => void;

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (!navigator.onLine) {
      const raw = this.form.getRawValue();
      this.persistDraft({
        name: raw.name ?? '',
        email: raw.email ?? '',
        message: raw.message ?? '',
      });
      this.toast.show(this.i18n.t('contact.fallback'), 'warning');
      return;
    }

    this.toast.show(this.i18n.t('contact.success'), 'success');
    this.form.reset();
  }

  private persistDraft(value: ContactFormValue) {
    const drafts = this.loadDrafts();
    drafts.push({ ...value, createdAt: new Date().toISOString() });
    try {
      localStorage.setItem(CONTACT_STORAGE_KEY, JSON.stringify(drafts));
      this.toast.show(this.i18n.t('contact.saved'), 'warning');
    } catch (error) {
      console.error('Unable to persist contact draft', error);
    }
  }

  private loadDrafts(): StoredDraft[] {
    try {
      const raw = localStorage.getItem(CONTACT_STORAGE_KEY);
      if (!raw) {
        return [];
      }
      const parsed = JSON.parse(raw) as StoredDraft[];
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Unable to load contact drafts', error);
      return [];
    }
  }

  private flushDrafts() {
    this.isOffline = false;
    const drafts = this.loadDrafts();
    if (!drafts.length) {
      return;
    }
    localStorage.removeItem(CONTACT_STORAGE_KEY);
    this.toast.show(this.i18n.t('contact.synced'), 'success');
  }

  ngOnDestroy(): void {
    window.removeEventListener('offline', this.offlineHandler);
    window.removeEventListener('online', this.onlineHandler);
  }
}
