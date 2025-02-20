import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent {
  @Input() type: string = 'text';
  @Input() id: string = '';
  @Input() name: string = '';
  @Input() placeholder: string = '';
  @Input() value: string = '';

  @Output() valueChange = new EventEmitter<string>();

  onInputChange(value: string): void {
    this.valueChange.emit(value);
  }
}
