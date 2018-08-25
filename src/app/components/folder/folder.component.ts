import { Component, OnInit, Input } from '@angular/core';
import { BroadcastService } from './../../services/broadcast.service';

@Component({
  selector: 'Folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.scss']
})
export class FolderComponent implements OnInit {

  @Input() files;
  @Input() level;

  constructor(private _broadcast: BroadcastService) { 
  }

  ngOnInit() {
    
  }

  openFile(file){
    this._broadcast.publish({
      type: 'OPEN_FILE',
      file: file
    });
  }

}
