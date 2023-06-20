import { Component, OnInit } from '@angular/core';
import { WeclomeText } from 'src/app/shared/models/strapi.models';
import { StrapiService } from 'src/app/shared/services/strapi.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit {
  welcomeText!: WeclomeText;

  constructor(public strapiService: StrapiService) {}

  ngOnInit(): void {
    this.strapiService.getWelcomeText().subscribe((res) => {
      this.welcomeText = {
        content: res.content,
        title: res.title,
        subtitle: res.subtitle,
      };
    });
  }
}
