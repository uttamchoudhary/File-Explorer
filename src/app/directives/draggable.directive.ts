import { Directive, HostBinding, Input, HostListener } from '@angular/core';
import { DragService } from '../services/drag.service';

@Directive({
  selector: '[myDraggable]'
})
export class DraggableDirective {
  private item;
  constructor(private dragService: DragService) {
  }

  @HostBinding('draggable')
  get draggable() {
    return true;
  }

  @Input()
  set myDraggable(file) {
    this.item = file;
  }

  @HostListener('dragstart', ['$event'])
  onDragStart(event) {
    event.dataTransfer.setData('Text', JSON.stringify(this.item));
  }
}

