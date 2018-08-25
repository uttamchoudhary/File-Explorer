import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
	
	constructor() {
	}

	private loadEvt : EventEmitter<any> = new EventEmitter();

	getLoadState() {
		return this.loadEvt;
	}

	start() {
		
		this.loadEvt.emit(true);
	}

	stop() {
		this.loadEvt.emit(false);
	}
}
