import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TitleService } from './shared/services/title.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class AppComponent implements OnInit {
  constructor(
    private readonly titleService: TitleService,
    private route: ActivatedRoute
  ) {
    this.titleService.init();
  }

  ngOnInit() {
    this.route.fragment.subscribe((fragment) => {
      if (fragment) {
        document
          .querySelector('#' + fragment)
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }
}
