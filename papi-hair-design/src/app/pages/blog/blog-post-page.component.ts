import { AsyncPipe, CommonModule, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { PostsService } from '../../core/services/posts.service';
import { RelatedPostsComponent } from '../../shared/blog/related-posts/related-posts.component';
import { SeoService } from '../../core/seo/seo.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-blog-post-page',
  standalone: true,
  imports: [CommonModule, NgIf, RouterLink, AsyncPipe, RelatedPostsComponent],
  templateUrl: './blog-post-page.component.html',
  styleUrl: './blog-post-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogPostPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly posts = inject(PostsService);
  private readonly seo = inject(SeoService);
  private readonly sanitizer = inject(DomSanitizer);

  post$ = this.route.paramMap.pipe(
    switchMap((params) => this.posts.getBySlug(params.get('slug') ?? '')),
  );

  related$ = this.post$.pipe(
    switchMap((post) => this.posts.related(post?.category ?? '', post?.slug ?? '')),
  );

  schemaMarkup!: SafeHtml;

  ngOnInit(): void {
    this.post$
      .pipe(
        takeUntilDestroyed(),
        tap((post) => {
          if (post) {
            this.seo.update({
              title: post.title,
              description: post.excerpt,
              url: `https://papi-hair.example/blog/${post.slug}`,
              image: post.cover,
              type: 'article',
            });

            const schema = {
              '@context': 'https://schema.org',
              '@type': 'Article',
              headline: post.title,
              image: post.cover,
              datePublished: post.dateISO,
              author: { '@type': 'Organization', name: 'Papi Hair Design' },
              mainEntityOfPage: `https://papi-hair.example/blog/${post.slug}`,
            };

            this.schemaMarkup = this.sanitizer.bypassSecurityTrustHtml(
              `<script type="application/ld+json">${JSON.stringify(schema)}</script>`,
            );
          }
        }),
      )
      .subscribe();
  }
}
