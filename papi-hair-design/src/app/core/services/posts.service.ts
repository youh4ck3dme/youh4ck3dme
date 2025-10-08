import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import postsData from '../../data/posts.json';
import { Post } from '../../models/post.model';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private readonly posts = postsData as Post[];

  getAll(): Observable<Post[]> {
    return of(this.posts);
  }

  getBySlug(slug: string): Observable<Post | undefined> {
    return of(this.posts.find((post) => post.slug === slug));
  }

  related(category: string, currentSlug: string): Observable<Post[]> {
    return of(
      this.posts
        .filter((post) => post.category === category && post.slug !== currentSlug)
        .slice(0, 3),
    );
  }
}
