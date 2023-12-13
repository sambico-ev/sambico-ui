import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-burger-button',
  templateUrl: './burger-button.component.html',
  styleUrls: ['./burger-button.component.scss'],
})
export class BurgerButtonComponent {
  @Input() active = false;
  @Output() opened = new EventEmitter<boolean>();

  toggle() {
    this.active = !this.active;
    this.opened.emit(this.active);
  }
}
