import { Pipe, PipeTransform } from '@angular/core';
import { Blog } from '../models/strapi.models';
import { StrapiService } from '../services/strapi.service';

@Pipe({ name: 'imageUrl' })
export class ImageUrlPipe implements PipeTransform {
  constructor(private readonly strapiService: StrapiService) {}

  transform(
    blog: Blog | null | undefined,
    size:
      | 'large'
      | 'medium'
      | 'small'
      | 'thumbnail'
      | 'xlarge'
      | 'xsmall' = 'small'
  ): string {
    if (!blog || !blog.attributes) return 'assets/images/placeholder.png';
    const formats = blog.attributes.image?.data?.attributes?.formats;
    if (!formats) return 'assets/images/placeholder.png';
    return this.strapiService.getStrapiImageUrl(formats, size);
  }
}
