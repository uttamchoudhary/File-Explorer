import { Component, OnInit, ViewContainerRef, HostListener } from "@angular/core";

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


  constructor(
    private _explorer: ExplorerService,
    private loader: LoaderService,
    private _contextMenu: ContextMenuService,
    private _vcr: ViewContainerRef
  ) {
    _contextMenu.viewContainerRef = _vcr;
  }

  // @HostListener('window:unload', [ '$event' ])
  // beforeUnloadHander(event) {
  //   this._explorer.updateStorage();
  //   return;
  // }

  ngOnInit() {
    this.tabs = [
      {
        title: "Recent Files",
        list: [],
        open: false,
        showContextMenu: false,
        allowFileOpen: true
      },
      {
        title: "File Explorer",
        list: [],
        open: true,
        showContextMenu: true,
        allowFileOpen: true
      },
      {
        title: "Trash",
        list: [],
        open: false,
        showContextMenu: true,
        allowFileOpen: false,
        isTrash: true
      }
    ];

    this.loader.start();
    this._explorer.getStructure().subscribe(res => {
      this.tabs[1].list = res['folders'];
      this.tabs[2].list = res['trash'];
      this.tabs[0].list = res['recent'];
      this.loader.stop();
    });
    
  }

  openTab(tab){
    this.tabs.forEach(item => item.open = tab.title !== item.title ? false : !tab.open);
  }

}
