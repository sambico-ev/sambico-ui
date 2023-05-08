import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TitleService } from './shared/services/title.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private readonly translate: TranslateService,
    private readonly titleService: TitleService,
    private route: ActivatedRoute
  ) {
    translate.setDefaultLang('de');
    translate.use('de');
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
