import { AsyncPipe, CommonModule, NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PostsService } from '../../core/services/posts.service';
import { SeoService } from '../../core/seo/seo.service';
import { TranslatePipe } from '../../core/i18n/translate.pipe';

@Component({
  selector: 'app-blog-archive-page',
  standalone: true,
  imports: [CommonModule, NgFor, RouterLink, AsyncPipe, TranslatePipe],
  templateUrl: './blog-archive-page.component.html',
  styleUrl: './blog-archive-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogArchivePageComponent {
  private readonly posts = inject(PostsService);
  private readonly seo = inject(SeoService);

  posts$ = this.posts.getAll();

  constructor() {
    this.seo.update({
      title: 'Blog',
      description: 'Inšpirácie, tipy na starostlivosť a backstage Papi Hair Design.',
      url: 'https://papi-hair.example/blog',
    });
  }
}
