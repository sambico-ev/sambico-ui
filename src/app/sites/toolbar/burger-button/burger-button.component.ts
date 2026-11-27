import {
  Component,
  EventEmitter,
  Input,
  Output,
  ChangeDetectionStrategy
} from '@angular/core';

@Component({
  selector: 'app-burger-button',
  templateUrl: './burger-button.component.html',
  styleUrls: ['./burger-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class BurgerButtonComponent {
  @Input() active = false;
  @Output() opened = new EventEmitter<boolean>();

  toggle() {
    this.active = !this.active;
    this.opened.emit(this.active);
  }
}
