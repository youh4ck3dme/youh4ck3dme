import { Routes } from '@angular/router';
import { HomeLandingComponent } from './pages/home/home-landing.component';
import { ServicesPageComponent } from './pages/services/services-page.component';
import { StylistsPageComponent } from './pages/stylists/stylists-page.component';
import { BookingPageComponent } from './pages/booking/booking-page.component';
import { GalleryPageComponent } from './pages/gallery/gallery-page.component';
import { BlogArchivePageComponent } from './pages/blog/blog-archive-page.component';
import { BlogPostPageComponent } from './pages/blog/blog-post-page.component';
import { ContactPageComponent } from './pages/contact/contact-page.component';
import { PolicyPageComponent } from './pages/policy/policy-page.component';
import { InstallPageComponent } from './pages/install/install-page.component';
import { OfflinePageComponent } from './pages/offline/offline-page.component';

export const routes: Routes = [
  { path: '', component: HomeLandingComponent, title: 'Papi Hair Design' },
  { path: 'sluzby', component: ServicesPageComponent, title: 'Služby | Papi Hair Design' },
  { path: 'stylisti', component: StylistsPageComponent, title: 'Stylisti | Papi Hair Design' },
  { path: 'rezervacia', component: BookingPageComponent, title: 'Rezervácia | Papi Hair Design' },
  { path: 'galeria', component: GalleryPageComponent, title: 'Galéria | Papi Hair Design' },
  { path: 'blog', component: BlogArchivePageComponent, title: 'Blog | Papi Hair Design' },
  { path: 'blog/:slug', component: BlogPostPageComponent, title: 'Blog | Papi Hair Design' },
  { path: 'kontakt', component: ContactPageComponent, title: 'Kontakt | Papi Hair Design' },
  { path: 'policy', component: PolicyPageComponent, title: 'Ochrana súkromia | Papi Hair Design' },
  { path: 'install', component: InstallPageComponent, title: 'Inštalácia | Papi Hair Design' },
  { path: 'offline', component: OfflinePageComponent, title: 'Offline | Papi Hair Design' },
  { path: '**', component: OfflinePageComponent },
];
