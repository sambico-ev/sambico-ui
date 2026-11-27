import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { WelcomeText } from 'src/app/shared/models/strapi.models';
import { StrapiService } from 'src/app/shared/services/strapi.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class WelcomeComponent implements OnInit {
  welcomeText: WelcomeText | null = null;

  constructor(public strapiService: StrapiService) {}

  ngOnInit(): void {
    this.strapiService.getWelcomeText().subscribe((res) => {
      this.welcomeText = res;
    });
  }
}
