import { Component, OnInit } from '@angular/core';
import { RouteNames } from 'src/app/app-routing.module';
import { Project } from 'src/app/shared/models/strapi.models';
import { StrapiService } from 'src/app/shared/services/strapi.service';

@Component({
  selector: 'app-projects-preview',
  templateUrl: './projects-preview.component.html',
  styleUrls: ['./projects-preview.component.scss'],
})
export class ProjectsPreviewComponent implements OnInit {
  projects: Project[] = [];
  routes = RouteNames;

  constructor(public strapiService: StrapiService) {}

  ngOnInit(): void {
    this.strapiService.getProjects(2).subscribe((res) => {
      this.projects = res;
    });
  }
}
