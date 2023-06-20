import { Component } from '@angular/core';
import { RouteNames } from 'src/app/app-routing.module';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  routes = RouteNames;
  year = new Date().getFullYear();
}
