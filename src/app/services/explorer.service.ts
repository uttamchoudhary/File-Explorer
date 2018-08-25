import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class ExplorerService {
  private SHORT_JSON = "";
  private LONG_JSON = "";

  constructor(private _http: HttpClient) {}
  
  getStructure() {
    return new Observable(observer => {
      //let data = localStorage.getItem('file-structure');
      if (this.data) {
        observer.next(this.data);
        observer.complete();
      } else {
        this._http.get(this.LONG_JSON).subscribe(
          res => {
            this.formatData(res);
          },
          err => {
            alert("unable to load files. Please try again");
          }
        );
      }
    });
  }

  formatData(data) {
    data.map(file => {});
  }

  data = [
    {
      title: "Avengers Initiative",
      children: [
        {
          title: "Game play resources",
          children: [
            {
              title: "Installation",
              children: [
                { file_name: "install.iso", type: "iso image" },
                { file_name: "archive_unbox.dat", type: "dat file" }
              ]
            }
          ]
        },
        { file_name: "install.iso", type: "iso image" },
        { file_name: "install.iso", type: "iso image" }
      ]
    },
    {
      title: "Marvel Super Hero Edition",
      children: [
        {
          title: "Game play resources",
          children: [
            {
              title: "Installation",
              children: [
                { file_name: "install.iso", type: "iso image" },
                { file_name: "archive_unbox.dat", type: "dat file" }
              ]
            }
          ]
        }
      ]
    },
    { file_name: "install.iso", type: "iso image" },
    { file_name: "install.iso", type: "iso image" }
  ];
}
