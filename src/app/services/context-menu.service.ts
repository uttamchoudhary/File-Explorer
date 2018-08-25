import { Injectable, ComponentFactoryResolver, ComponentRef, ViewContainerRef } from '@angular/core';
import { EventManager } from '@angular/platform-browser';

import { ContextMenuOption, ContextMenuComponent } from './../components/context-menu/context-menu.component';

@Injectable({
  providedIn: 'root'
})
export class ContextMenuService {

  private _menuAlreadyOn: boolean = false;

  private _currentContextMenu: ComponentRef<any>;

  viewContainerRef: ViewContainerRef;

  constructor(
    private _cfr: ComponentFactoryResolver,
    private _eventManager: EventManager
  ) { } 

  showContextMenu(event: MouseEvent, options: ContextMenuOption[]) : boolean {

    event.stopPropagation();
    event.preventDefault();

    if (this._menuAlreadyOn) {
      this._currentContextMenu.destroy();
      this._menuAlreadyOn = false;
    }

    let componentRef = this.viewContainerRef.createComponent(this._cfr.resolveComponentFactory(ContextMenuComponent))

    componentRef.instance.options = options;
    componentRef.instance.left = event.clientX + 'px';
    componentRef.instance.top = event.clientY + 'px';
    
    this._currentContextMenu = componentRef;
    this._menuAlreadyOn = true;

    let listener = this._eventManager.addGlobalEventListener('document', 'click',  () => {

      this._currentContextMenu.destroy();
      this._menuAlreadyOn = false;
      listener();
    })

    return false;
  }
  
}
