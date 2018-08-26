import { Directive, HostBinding, Input, HostListener, Output, EventEmitter } from '@angular/core';
import { ExplorerService } from '../services/explorer.service';

@Directive({
  selector: '[myDropTarget]'
})
export class DropTargetDirective {
  private target;
  constructor(private _explorer: ExplorerService) {
  }

  @Input()
  set myDropTarget(target) {
    this.target = target;
  }

  @HostListener('dragenter', ['$event'])
  onDragEnter(){
    this.target['open'] = true;
  }
  @HostListener('dragover', ['$event'])
  onDragOver(event) {
       event.preventDefault();
  }

  @HostListener('drop', ['$event'])
  onDrop(event) {

    const item =  JSON.parse(event.dataTransfer.getData('Text'));
    this._explorer.delete(item, false);
    if(item.children){
      this._explorer.addFolder(this.target, item);
      this._explorer.updateFilesPath(this.target);
      this._explorer.updateFileHash(item, null, 'restore');
      
    }else{
      this._explorer.addFile(this.target, item);
      this._explorer.updateFilesPath(this.target);
      this._explorer.updateFileHash(item, null, 'file_rename');
    }
    
  }
}

