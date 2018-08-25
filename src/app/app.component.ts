import { Component, OnInit, ViewContainerRef } from "@angular/core";
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

  ngOnInit() {
    this.tabs = [
      {
        title: "Recent Files",
        list: [],
        open: false
      },
      {
        title: "File Explorer",
        list: [],
        open: true
      },
      {
        title: "Trash",
        list: [],
        open: false
      }
    ];

    this.loader.start();
    this._explorer.getStructure().subscribe((res: Array<any>) => {
      this.tabs[1].list = res;
      this.loader.stop();
    });
  }

  openTab(tab){
    this.tabs.forEach(item => item.open = tab.title !== item.title ? false : !tab.open);
  }
}
