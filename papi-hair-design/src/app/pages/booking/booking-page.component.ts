import { AsyncPipe, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ServicesService } from '../../core/services/services.service';
import { StylistsService } from '../../core/services/stylists.service';
import { StepServiceComponent } from './components/step-service/step-service.component';
import { StepStylistComponent } from './components/step-stylist/step-stylist.component';
import { StepDatetimeComponent } from './components/step-datetime/step-datetime.component';
import { StepReviewComponent } from './components/step-review/step-review.component';
import { SeoService } from '../../core/seo/seo.service';
import { BookingService } from '../../core/services/booking.service';
import { ToastService } from '../../core/services/toast.service';
import { TranslationService } from '../../core/i18n/translation.service';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { Booking } from '../../models/booking.model';
import { Slot } from '../../models/slot.model';

@Component({
  selector: 'app-booking-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    StepServiceComponent,
    StepStylistComponent,
    StepDatetimeComponent,
    StepReviewComponent,
    AsyncPipe,
    NgIf,
    RouterLink,
    TranslatePipe,
  ],
  templateUrl: './booking-page.component.html',
  styleUrl: './booking-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingPageComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly services = inject(ServicesService);
  private readonly stylists = inject(StylistsService);
  private readonly seo = inject(SeoService);
  private readonly bookingService = inject(BookingService);
  private readonly toast = inject(ToastService);
  private readonly i18n = inject(TranslationService);

  readonly services$ = this.services.getAll();
  readonly stylists$ = this.stylists.getAll();
  private readonly stylistsSignal = toSignal(this.stylists$, { initialValue: [] });

  currentStep = signal(0);

  bookingForm = this.fb.group({
    serviceId: ['', Validators.required],
    stylistId: ['', Validators.required],
    slot: this.fb.group({
      dateISO: ['', Validators.required],
      start: ['', Validators.required],
      end: ['', Validators.required],
      isAvailable: [true],
    }),
    customer: this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
    }),
    notes: [''],
  });

  reviewBooking = signal<Booking | null>(null);

  get slotGroup(): FormGroup {
    return this.bookingForm.get('slot') as FormGroup;
  }

  slotsForSelectedStylist = computed(() => {
    const stylistId = this.bookingForm.value.stylistId ?? '';
    const list = this.stylistsSignal();
    const stylist = list.find((item) => item.id === stylistId);
    return stylist?.slots ?? [];
  });

  ngOnInit(): void {
    this.seo.update({
      title: 'Rezervácia',
      description: 'Rezervujte si svoj couture zážitok v Papi Hair Design aj v offline režime.',
      url: 'https://papi-hair.example/rezervacia',
    });

    this.offlineHandler = () => this.toast.show(this.i18n.t('toast.offline'), 'warning');
    this.onlineHandler = () => {
      this.toast.show(this.i18n.t('toast.online'), 'success');
      this.bookingService.flushQueue();
    };
    window.addEventListener('offline', this.offlineHandler);
    window.addEventListener('online', this.onlineHandler);
  }

  private offlineHandler!: () => void;
  private onlineHandler!: () => void;

  nextStep() {
    if (this.currentStep() < 3) {
      this.currentStep.update((value) => value + 1);
    }
  }

  prevStep() {
    if (this.currentStep() > 0) {
      this.currentStep.update((value) => value - 1);
    }
  }

  submit() {
    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      return;
    }

    const formValue = this.bookingForm.getRawValue();
    const booking = this.bookingService.createBooking({
      serviceId: formValue.serviceId ?? '',
      stylistId: formValue.stylistId ?? '',
      slot: formValue.slot as Slot,
      customer: {
        name: formValue.customer?.name ?? '',
        phone: formValue.customer?.phone ?? '',
        email: formValue.customer?.email ?? '',
      },
      notes: formValue.notes ?? '',
    });

    this.reviewBooking.set(booking);
    this.currentStep.set(3);
    this.toast.show(this.i18n.t('booking.confirmation'), 'success');
  }

  t(key: string) {
    return this.i18n.t(key);
  }

  ngOnDestroy(): void {
    window.removeEventListener('offline', this.offlineHandler);
    window.removeEventListener('online', this.onlineHandler);
  }
}
