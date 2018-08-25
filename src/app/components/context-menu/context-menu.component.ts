import { Component, OnInit } from '@angular/core';

export interface ContextMenuOption {
  text: string;
  action?: (type) => void;
  icon?: string;
  disabled?: boolean;
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

  itemClicked(i: number) {
    if (this.options[i].action) {
      this.options[i].action(this.options[i].text);
    }
  }

}
