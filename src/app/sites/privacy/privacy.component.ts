import { Component } from '@angular/core';
import { RouteNames } from 'src/app/app-routing.module';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss'],
})
export class PrivacyComponent {
  readonly routes = RouteNames;
}
