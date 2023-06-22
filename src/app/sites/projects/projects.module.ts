import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ProjectComponent } from './project/project.component';
import { ProjectsComponent } from './projects.component';

@NgModule({
  declarations: [ProjectsComponent, ProjectComponent],
  imports: [CommonModule, RouterModule, TranslateModule],
  exports: [ProjectsComponent, ProjectComponent],
})
export class ProjectsModule {}
