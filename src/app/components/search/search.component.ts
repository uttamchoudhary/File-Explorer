import { Component, OnInit, ElementRef } from '@angular/core';
import { FormControl } from "@angular/forms";
import { of } from 'rxjs';
import { sample, distinctUntilChanged, switchMap, debounceTime, map, filter } from "rxjs/operators";

import { ExplorerService } from "./../../services/explorer.service";
import { BroadcastService } from "./../../services/broadcast.service";

@Component({
  selector: 'Search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  host: {
    '(document:click)': 'closeDropdown($event)',
  },
})
export class SearchComponent implements OnInit {

  public searchTerm: FormControl = new FormControl('');
  public suggestions = [];

  constructor(
    private _broadcast: BroadcastService, 
    private _explorer: ExplorerService,
    private _eref: ElementRef
  ) { }

  ngOnInit() {
      this.searchTerm.valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          switchMap(term => {
            return term.length ? this._explorer.getSuggestion(term) : of([])
          })
        )
        .subscribe((results :Array<any>) => this.suggestions = results );
  }

  closeDropdown(event) {
    if(!this._eref.nativeElement.contains(event.target)) {
      this.searchTerm.setValue('');
    }
  }

  openFile(file){
    this._broadcast.publish({
      type: "OPEN_FILE",
      file: this._explorer.searchFile(file)
    });
    this.searchTerm.setValue('');
  }

}
