import { Component } from '@angular/core';
import { RouteNames } from 'src/app/app-routing.module';
import { Project } from 'src/app/shared/models/strapi.models';
import { StrapiService } from 'src/app/shared/services/strapi.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent {
  projects: Project[] = [];
  routes = RouteNames;

  constructor(public strapiService: StrapiService) {}

  ngOnInit(): void {
    this.strapiService.getProjects().subscribe((res) => {
      this.projects = res;
    });
  }
}
