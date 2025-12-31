import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero-parallax',
  standalone: true,
  imports: [NgClass, RouterLink],
  templateUrl: './hero-parallax.component.html',
  styleUrl: './hero-parallax.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroParallaxComponent implements OnInit, OnDestroy {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() ctaLabel = '';
  @Input() secondaryCtaLabel = '';

  prefersReducedMotion = false;
  private animationFrame?: number;
  private readonly elementRef = inject(ElementRef) as ElementRef<HTMLElement>;

  ngOnInit(): void {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.prefersReducedMotion = mediaQuery.matches;
    mediaQuery.addEventListener('change', this.updateMotionPreference);
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationFrame ?? 0);
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.removeEventListener('change', this.updateMotionPreference);
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.prefersReducedMotion) {
      return;
    }
    cancelAnimationFrame(this.animationFrame ?? 0);
    this.animationFrame = requestAnimationFrame(() => this.applyParallax(event));
  }

  private applyParallax(event: MouseEvent) {
    const rect = this.elementRef.nativeElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (event.clientX - centerX) / rect.width;
    const deltaY = (event.clientY - centerY) / rect.height;

    this.setTransform('.hero__nebula', deltaX, deltaY, 30);
    this.setTransform('.hero__silhouette', deltaX, deltaY, 40);
    this.setTransform('.hero__glass', deltaX, deltaY, 20);
  }

  private setTransform(selector: string, deltaX: number, deltaY: number, depth: number) {
    const layer = this.elementRef.nativeElement.querySelector(selector) as HTMLElement | null;
    if (!layer) {
      return;
    }
    layer.style.transform = `translate3d(${deltaX * depth}px, ${deltaY * depth}px, 0)`;
  }

  private readonly updateMotionPreference = (event: MediaQueryListEvent) => {
    this.prefersReducedMotion = event.matches;
  };
}
