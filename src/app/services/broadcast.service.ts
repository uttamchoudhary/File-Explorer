import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BroadcastService {

  private subject = new Subject<any>();

  publish(message) {
      this.subject.next(message);
  }

  listen(): Observable<any> {
      return this.subject.asObservable();
  }

}
