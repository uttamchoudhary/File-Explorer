import { Component, OnInit, ViewContainerRef, OnDestroy } from "@angular/core";

import { ExplorerService } from "./services/explorer.service";
import { LoaderService } from "./services/loader.service";
import { ContextMenuService } from "./services/context-menu.service";


@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit, OnDestroy {
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

  ngOnInit() {
    this.tabs = [
      {
        title: "Recent Files",
        list: [],
        open: false,
        showContextMenu: false
      },
      {
        title: "File Explorer",
        list: [],
        open: true,
        showContextMenu: true
      },
      {
        title: "Trash",
        list: [],
        open: false,
        showContextMenu: true,
        isTrash: true
      }
    ];

    this.loader.start();
    this._explorer.getStructure().subscribe(res => {
      this.tabs[1].list = res['folders'];
      this.tabs[2].list = res['trash'];
      this.loader.stop();
    });
    
  }

  openTab(tab){
    this.tabs.forEach(item => item.open = tab.title !== item.title ? false : !tab.open);
  }

  ngOnDestroy(){
    this._explorer.updateStorage();
  }

  
}
