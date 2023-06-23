import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProjectsPreviewComponent } from './projects-preview.component';

@NgModule({
  declarations: [ProjectsPreviewComponent],
  imports: [CommonModule, TranslateModule, RouterModule, SharedModule],
  exports: [ProjectsPreviewComponent],
})
export class ProjectsPreviewModule {}
