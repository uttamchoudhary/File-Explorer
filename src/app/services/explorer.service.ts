import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class ExplorerService {
  private SHORT_JSON = "";
  private LONG_JSON = "http://192.168.29.41:8887/folder-structure.json";

  public fileHash: Array<any> = [];
  public folderStructure : Array<any> = [];

  private currentHash = '';
  private currentFilePath = '';

  constructor(private _http: HttpClient) {}

  getStructure() {
    return new Observable(observer => {
      let data = localStorage.getItem("FILE_STRUCTURE");
      let fileRefs = localStorage.getItem("FILE_REF");
      if (data && fileRefs) {
        this.fileHash = JSON.parse(fileRefs);
        this.folderStructure = JSON.parse(data);
        observer.next(this.folderStructure);  
        observer.complete();
      } else {
        this._http.get(this.LONG_JSON).subscribe(
          (res: any) => {
            //let data = res.json();
            let data = res;
            this.folderStructure = data.map((elem, index) => this.formatData(elem, 0, index));
            localStorage.setItem("FILE_STRUCTURE", JSON.stringify(this.folderStructure));

            localStorage.setItem("FILE_REF", JSON.stringify(this.fileHash));
            observer.next(this.folderStructure);
          },
          err => {
            alert("unable to load files. Please try again");
          }
        );
      }
    });
  }

  formatData(data, level, index?) {
    this.currentHash += index != undefined ? `${index}|children|` : '';
    this.currentFilePath += data.title ? `${data.title}/` : '';
    let results = [];
    for (let elem in data) {
      if (data.hasOwnProperty(elem)) {
        let result = {};
        if (typeof data[elem] === "object" && data[elem] instanceof Array) {
          result["title"] = elem;
          result['ref'] =  `${this.currentHash}|${results.length}`;
          result['file_path'] = this.currentFilePath + elem;
          result["children"] = data[elem];
          this.storeFileHash(data[elem], results.length, elem);
        } else if (typeof data[elem] === "string") {
          this.currentFilePath += 'Game play resources/';
          result["title"] = data[elem];
          result['ref'] = `${index}`;
          result['file_path'] = data[elem];
          result["children"] = [
            {
              title: "Game play resources",
              ref: `${index}|children|0`,
              file_path: `${data[elem]}/Game play resources`,
              children: this.formatData(data["Game play resources"], 1, 0)
            }
          ];
        }
        if (Object.keys(result).length) results.push(result);
      }
    }
    this.currentHash = '';
    this.currentFilePath = '';
    return level !== 0 ? results : results[0];
  }

  storeFileHash(list, index, folder) {
    let baseRef = this.currentHash + `${index}|children|`
    this.fileHash.push(...list.map((file, index) => {
        file['ref'] = baseRef + index;
        file['file_path'] = this.currentFilePath + folder;
        return {
          name : file.file_name,
          ref: baseRef + index,
          file_path: this.currentFilePath + folder
        };
      })
    );
  }

  searchFile(file){
    let refs = file.ref.split('|');
    let result = this.folderStructure;
    refs.forEach(element => {
        result = result[element]
    });
    return result;
  }

  delete(){

  }

  rename(){

  }

  addFile(){

  }

  addFolder(){

  }

  getSuggestion(text){
    return new Observable(observer => {
      let list = this.fileHash.filter(file => {
        return file.name.toLowerCase().indexOf(text) > -1;
      });
      observer.next(list);
      observer.complete();
    });
  }
}
