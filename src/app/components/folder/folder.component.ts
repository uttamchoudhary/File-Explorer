import { Component, OnInit, Input } from "@angular/core";
import { BroadcastService } from "./../../services/broadcast.service";
import { ContextMenuService } from "../../services/context-menu.service";

@Component({
  selector: "Folder",
  templateUrl: "./folder.component.html",
  styleUrls: ["./folder.component.scss"]
})
export class FolderComponent implements OnInit {
  @Input() files;
  @Input() level;

  options = {
    file: [
      {
        text: "Open",
        action: this.doAction,
        icon: "fa-file"
      },
      {
        text: "Delete",
        action: this.doAction,
        icon: "fa-trash"
      }
    ],
    folder: [
      {
        text: "Add File",
        action: this.doAction,
        icon: "fa-file"
      },
      {
        text: "Add Folder",
        action: this.doAction,
        icon: "fa-folder"
      },
      {
        text: "Delete",
        action: this.doAction,
        icon: "fa-trash"
      }
    ]
  };

  constructor(
    private _broadcast: BroadcastService,
    private _contextMenu: ContextMenuService
  ) {}

  ngOnInit() {}

  doAction(action) {
    console.log(action);
  }

  openFile(file) {
    this._broadcast.publish({
      type: "OPEN_FILE",
      file: file
    });
  }

  showOptions(evt, type) {
    this._contextMenu.showContextMenu(evt, this.options[type]);
  }
}
