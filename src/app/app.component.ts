import { Component, OnInit } from '@angular/core';
import { ExplorerService } from './services/explorer.service';
import { LoaderService } from './services/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public files;
  public level = 0;

  constructor(private _explorer: ExplorerService, private loader: LoaderService){}

  ngOnInit(){
    this.loader.start();
    this._explorer.getStructure().subscribe(res => {
      this.files = res;
      this.loader.stop();
    });
  }
}
