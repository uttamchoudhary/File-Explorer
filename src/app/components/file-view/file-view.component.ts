import { Component, OnInit } from '@angular/core';
import { BroadcastService } from './../../services/broadcast.service';

@Component({
  selector: 'File-View',
  templateUrl: './file-view.component.html',
  styleUrls: ['./file-view.component.scss']
})
export class FileViewComponent implements OnInit {

  public file;

  constructor(private _broadcast: BroadcastService) { }

  ngOnInit() {
    this._broadcast.listen().subscribe(evt => {
      if(evt.type === 'OPEN_FILE'){
        this.file = evt.file;
      }
    })
  }

}
