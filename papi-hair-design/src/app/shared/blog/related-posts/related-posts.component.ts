import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Post } from '../../../models/post.model';

@Component({
  selector: 'app-related-posts',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink],
  templateUrl: './related-posts.component.html',
  styleUrl: './related-posts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RelatedPostsComponent {
  @Input() posts: Post[] = [];
}
