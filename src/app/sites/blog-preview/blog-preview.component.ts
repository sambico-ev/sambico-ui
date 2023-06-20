import { Component, OnInit } from '@angular/core';
import { StrapiService } from 'src/app/shared/services/strapi.service';

@Component({
  selector: 'app-blog-preview',
  templateUrl: './blog-preview.component.html',
  styleUrls: ['./blog-preview.component.scss'],
})
export class BlogPreviewComponent implements OnInit {
  constructor(public strapiService: StrapiService) {}

  ngOnInit(): void {}
}
