import { TestBed } from '@angular/core/testing';
import { SeoService } from './seo.service';
import { Meta, Title, MetaDefinition } from '@angular/platform-browser';

class MockTitle {
  value = '';
  setTitle(newTitle: string) {
    this.value = newTitle;
  }
}

class MockMeta {
  tags: Record<string, MetaDefinition> = {};
  updateTag(tag: MetaDefinition) {
    if (tag.name) {
      this.tags[tag.name] = tag;
    }
    if (tag.property) {
      this.tags[tag.property] = tag;
    }
  }
}

describe('SeoService', () => {
  let service: SeoService;
  let title: MockTitle;
  let meta: MockMeta;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SeoService,
        { provide: Title, useClass: MockTitle },
        { provide: Meta, useClass: MockMeta },
      ],
    });
    service = TestBed.inject(SeoService);
    title = TestBed.inject(Title) as unknown as MockTitle;
    meta = TestBed.inject(Meta) as unknown as MockMeta;
  });

  it('should update title and description', () => {
    service.update({ title: 'Home', description: 'Desc', url: 'https://example.com' });
    expect(title.value).toContain('Home | Papi Hair Design');
    expect(meta.tags['description'].content).toBe('Desc');
  });
});
