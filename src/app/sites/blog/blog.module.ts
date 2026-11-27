import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { BlogEntryComponent } from './blog-entry/blog-entry.component';
import { BlogComponent } from './blog.component';

@NgModule({
  declarations: [BlogComponent, BlogEntryComponent],
  imports: [CommonModule, TranslatePipe, RouterModule, SharedModule],
})
export class BlogModule {}
