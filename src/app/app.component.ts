import { Component, OnInit, ViewContainerRef, HostListener, AfterViewInit } from "@angular/core";

import { ExplorerService } from "./services/explorer.service";
import { LoaderService } from "./services/loader.service";
import { ContextMenuService } from "./services/context-menu.service";


@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {

  public level = 0;
  public tabs;
  public loadFromRemote = false;

  constructor(
    private _explorer: ExplorerService,
    private loader: LoaderService,
    private _contextMenu: ContextMenuService,
    private _vcr: ViewContainerRef
  ) {
    _contextMenu.viewContainerRef = _vcr;
  }

  @HostListener('window:unload', [ '$event' ])
  beforeUnloadHander(event) {
    !this.loadFromRemote ? this._explorer.updateStorage() : null;
    return;
  }

  ngOnInit() {
    this.tabs = [
      {
        title: "Recent Files",
        children: [],
        open: false,
        showContextMenu: false,
        allowFileOpen: true
      },
      {
        title: "File Explorer",
        children: [],
        open: true,
        showContextMenu: true,
        allowFileOpen: true,
        options: [
          {
            text: "Add File",
            action: this.doAction.bind(this),
            icon: "fa-plus",
            key: 'add_file'
          },
          {
            text: "Add Folder",
            action: this.doAction.bind(this),
            icon: "fa-plus",
            key: 'add_folder'
          }
        ]
      },
      {
        title: "Trash",
        children: [],
        open: false,
        showContextMenu: true,
        allowFileOpen: false,
        isTrash: true,
        options: [
          {
            text: "Empty Trash",
            action: this.doAction.bind(this),
            icon: "fa-trash",
            key: 'empty'
          }
        ]
      }
    ];

    this.loader.start();
    this._explorer.getStructure().subscribe(res => {
      this.tabs[1].children = res['folders'];
      this.tabs[2].children = res['trash'];
      this.tabs[0].children = res['recent'];
      this.loader.stop();
    });
    
  }

  openTab(tab){
    this.tabs.forEach(item => item.open = tab.title !== item.title ? false : !tab.open);
  }

  doAction(item, action){
    switch(action){
      case 'add_file':
        this._explorer.addFile({ref: '', children: item});
        break;
      case 'add_folder':
        this._explorer.addFolder({ref: '', children: item});
        break;
      case 'empty':
        this._explorer.removeFromTrash();
        break;
      default: null;
    }
  }

  showOptions(evt, target) {
    this._contextMenu.showContextMenu(evt, target.options, target.children);
  }

  hardReload(){
    this.loadFromRemote = true;
    localStorage.removeItem("FILE_STRUCTURE");
    localStorage.removeItem("FILE_REF");
    localStorage.removeItem("TRASH");
    window.location.reload();
  }

}
