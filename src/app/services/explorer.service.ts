import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class ExplorerService {
  private SHORT_JSON = "";
  private LONG_JSON = "http://192.168.29.41:8887/folder-structure.json";

  public fileHash: Array<any>;

  constructor(private _http: HttpClient) {}

  getStructure() {
    return new Observable(observer => {
      let data = localStorage.getItem("FILE_STRUCTURE");
      if (data) {
        observer.next(JSON.parse(data));
        observer.complete();
      } else {
        this._http.get(this.LONG_JSON).subscribe(
          (res: any) => {
            //let data = res.json();
            let data = res;
            let structedData = data.map(elem => this.formatData(elem, 0));
            localStorage.setItem(
              "FILE_STRUCTURE",
              JSON.stringify(structedData)
            );
            observer.next(structedData);
          },
          err => {
            alert("unable to load files. Please try again");
          }
        );
      }
    });
  }

  formatData(data, level) {
    let results = [];
    for (let elem in data) {
      if (data.hasOwnProperty(elem)) {
        let result = {};
        if (typeof data[elem] === "object" && data[elem] instanceof Array) {
          result["title"] = elem;
          result["children"] = data[elem];
          //this.updateFileHash(data[elem]);
        } else if (typeof data[elem] === "string") {
          result["title"] = data[elem];
          result["children"] = [
            {
              title: "Game play resources",
              children: this.formatData(data["Game play resources"], 1)
            }
          ];
        }
        if (Object.keys(result).length) results.push(result);
      }
    }

    return level !== 0 ? results : results[0];
  }

  updateFileHash(list) {
    this.fileHash.push(
      ...list.map(file => {
        return {};
      })
    );
  }
}
