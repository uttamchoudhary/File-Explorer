import { Component, OnInit, Input, ViewChild, ElementRef } from "@angular/core";
import { BroadcastService } from "./../../services/broadcast.service";
import { ContextMenuService } from "../../services/context-menu.service";
import { ExplorerService } from "../../services/explorer.service";

@Component({
  selector: "Folder",
  templateUrl: "./folder.component.html",
  styleUrls: ["./folder.component.scss"]
})
export class FolderComponent implements OnInit {

  @Input() files;
  @Input() showContextMenu;
  @Input() isTrash;
  @Input() allowFileOpen;

  currentIndex;
  options = {
    file: [
      {
        text: "Rename",
        action: this.doAction.bind(this),
        icon: "fa-file",
        key: 'rename'
      },
      {
        text: "Delete",
        action: this.doAction.bind(this),
        icon: "fa-trash",
        key: 'delete'
      }
    ],
    folder: [
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
      },
      {
        text: "Rename",
        action: this.doAction.bind(this),
        icon: "fa-file",
        key: 'rename'
      },
      {
        text: "Delete",
        action: this.doAction.bind(this),
        icon: "fa-trash",
        key: 'delete'
      }
    ]
  };

  constructor(
    private _broadcast: BroadcastService,
    private _contextMenu: ContextMenuService,
    private _explorer: ExplorerService
  ) {}

  ngOnInit() {}

  doAction(item, action) {
    let isFolder = item.children ? true : false;
    switch(action){
      case 'delete' :
        this._explorer.delete(item, true);
        break;
      case 'rename':
        item['renaming'] = true;
        break;
      case 'add_file':
        item['open'] = true;
        this._explorer.addFile(item);
        break;
      case 'add_folder':
        this._explorer.addFolder(item);
        break;
      case 'restore':
        this._explorer.restore(item, this.currentIndex);
      break;
      case 'remove_perm':
        this._explorer.removeFromTrash(this.currentIndex);
        break;
      default: null;
    }
  }

  openFile(file) {
    this._broadcast.publish({
      type: "OPEN_FILE",
      file: file
    });
    this._explorer.updateRecent(file, !this.isTrash && !this.showContextMenu);
  }

  showOptions(evt, type, file, index?) {
    let options = this.isTrash ? [{
      text: "Restore",
      action: this.doAction.bind(this),
      icon: "fa-redo",
      key: 'restore'
    },
    {
      text: "Remove",
      action: this.doAction.bind(this),
      icon: "fa-trash",
      key: 'remove_perm'
    }
  ] : this.options[type];

    this.currentIndex = index;
    this._contextMenu.showContextMenu(evt, options, file);
  }

}
