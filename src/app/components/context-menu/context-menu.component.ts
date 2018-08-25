import { Component, OnInit } from '@angular/core';

export interface ContextMenuOption {
  text: string;
  action?: (ref, action) => void;
  icon?: string;
  disabled?: boolean;
  key: string;
}

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss']
})
export class ContextMenuComponent {

  options: ContextMenuOption[] = [];
  left: string;
  top: string;
  ref: any;

  itemClicked(i: number) {
    if (this.options[i].action) {
      this.options[i].action(this.ref, this.options[i].key);
    }
  }

}
