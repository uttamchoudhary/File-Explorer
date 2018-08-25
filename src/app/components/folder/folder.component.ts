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
  @Input() level;

  @ViewChild('renameInput') renameInput : ElementRef;

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

  doAction(ref, action) {
    let isFolder = ref.children ? true : false;
    switch(action){
      case 'delete' :
        
        break;
      case 'rename':
        ref['renaming'] = true;
        setTimeout(() => this.renameInput.nativeElement.focus(), 0);
        break;
      case 'add_file':
        break;
      case 'add_folder':
        break;
      default:
        null;
    }
    
    console.log(action);
  }

  openFile(file) {
    this._broadcast.publish({
      type: "OPEN_FILE",
      file: file
    });
  }

  showOptions(evt, type, file) {
    this._contextMenu.showContextMenu(evt, this.options[type], file);
  }

  rename(event, file){
    let name = event.target.value;
    file['renaming'] = false;

    if(!name)
      return

    let isFolder = file.children ? file['title'] = name : file['file_name'] = name;
    console.log(this._explorer.folderStructure);
  }
}
