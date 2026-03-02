import {
  animate,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { RouteNames } from 'src/app/app-routing.module';
import { Project } from 'src/app/shared/models/strapi.models';
import { StrapiService } from 'src/app/shared/services/strapi.service';
import { UtilsService } from 'src/app/shared/services/utils.service';

const SLIDE_DURATION = 60;
const SLIDE_GAP = 20;
const SLOT_DELAYS = [185, 175, 170, 210, 280, 340, 400];

@Component({
  selector: 'app-projects-preview',
  templateUrl: './projects-preview.component.html',
  styleUrls: ['./projects-preview.component.scss'],
  animations: [
    trigger('slideCard', [
      transition(':enter', [
        style({ transform: 'translateX(120%) rotate(2deg)', opacity: 0 }),
        animate(
          `${SLIDE_DURATION}ms ease-out`,
          style({ transform: 'translateX(0) rotate(2deg)', opacity: 1 })
        ),
      ]),
      transition(':leave', [
        animate(
          `${SLIDE_DURATION}ms ease-in`,
          style({ transform: 'translateX(-120%) rotate(2deg)', opacity: 0 })
        ),
      ]),
    ]),
  ],
})
export class ProjectsPreviewComponent implements OnInit, AfterViewInit, OnDestroy {
  allProjects: Project[] = [];
  currentProject: Project | null = null;
  routes = RouteNames;

  private isVisible = false;
  private slotTimeouts: ReturnType<typeof setTimeout>[] = [];
  private slotIndex = 0;

  constructor(
    public strapiService: StrapiService,
    private readonly utilService: UtilsService,
    public el: ElementRef
  ) {}

  ngOnInit(): void {
    this.strapiService.getProjects().subscribe((res) => {
      this.allProjects = res;
      if (this.allProjects.length > 0) {
        this.slotIndex = Math.floor(Math.random() * this.allProjects.length);
        this.currentProject = this.allProjects[this.slotIndex];
        this.slotIndex = (this.slotIndex + 1) % this.allProjects.length;
      }
      if (this.isVisible) {
        this.startSlotMachine();
      } else {
        this.checkScroll();
      }
    });
  }

  ngAfterViewInit(): void {
    this.checkScroll();
  }

  ngOnDestroy(): void {
    this.clearTimeouts();
  }

  @HostListener('window:scroll')
  checkScroll(): void {
    const rect = this.el.nativeElement.getBoundingClientRect();
    const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
    const inView = visibleHeight >= rect.height * 0.3;

    if (inView) {
      if (!this.isVisible) {
        this.isVisible = true;
        this.startSlotMachine();
      }
    } else {
      if (this.isVisible) {
        this.isVisible = false;
        this.stopSlotMachine();
      }
    }
  }

  private startSlotMachine(): void {
    if (this.allProjects.length === 0) return;
    this.clearTimeouts();

    let accumulated = 0;
    SLOT_DELAYS.forEach((delay) => {
      accumulated += delay;
      this.slotTimeouts.push(
        setTimeout(() => {
          this.swapProject(this.allProjects[this.slotIndex]);
          this.slotIndex = (this.slotIndex + 1) % this.allProjects.length;
        }, accumulated)
      );
    });
  }

  private stopSlotMachine(): void {
    this.clearTimeouts();
  }

  private clearTimeouts(): void {
    this.slotTimeouts.forEach((t) => clearTimeout(t));
    this.slotTimeouts = [];
  }

  private swapProject(newProject: Project): void {
    this.currentProject = null;
    this.slotTimeouts.push(
      setTimeout(() => {
        this.currentProject = newProject;
      }, SLIDE_DURATION + SLIDE_GAP)
    );
  }
}
