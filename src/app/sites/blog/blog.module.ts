import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { BlogEntryComponent } from './blog-entry/blog-entry.component';
import { BlogComponent } from './blog.component';

@NgModule({
  declarations: [BlogComponent, BlogEntryComponent],
  imports: [CommonModule, TranslateModule, RouterModule, SharedModule],
})
export class BlogModule {}
