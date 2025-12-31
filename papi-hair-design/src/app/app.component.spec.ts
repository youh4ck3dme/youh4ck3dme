import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { AppComponent } from './app.component';
import { ThemeService } from './core/services/theme.service';

class ThemeServiceStub {
  private readonly mode = signal<'dark' | 'amoled' | 'light'>('dark');
  readonly theme = this.mode.asReadonly();
}

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [{ provide: ThemeService, useClass: ThemeServiceStub }],
    }).compileComponents();
  });

  it('should create the root component', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should project content with theme attribute on host', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.getAttribute('data-theme')).toBe('dark');
  });
});
