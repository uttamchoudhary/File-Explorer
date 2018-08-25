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
  public folders : Array<any> = [];
  public trash : Array<any> = [];
  public recents : Array<any> = [];
  

  private currentHash = '';
  private currentFilePath = '';

  constructor(private _http: HttpClient) {}

  getStructure() {
    return new Observable(observer => {
      let data = localStorage.getItem("FILE_STRUCTURE");
      let fileRefs = localStorage.getItem("FILE_REF");
      if (data && fileRefs) {
        this.fileHash = JSON.parse(fileRefs);
        this.folders = JSON.parse(data);
        observer.next(this.folders);  
        observer.complete();
      } else {
        this._http.get(this.LONG_JSON).subscribe(
          (res: any) => {
            //let data = res.json();
            let data = res;
            this.folders = data.map((elem, index) => this.formatData(elem, 0, index));
            localStorage.setItem("FILE_STRUCTURE", JSON.stringify(this.folders));

            localStorage.setItem("FILE_REF", JSON.stringify(this.fileHash));
            observer.next(this.folders);
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
          result['ref'] =  `${this.currentHash}${results.length}`;
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
    let result = this.folders;
    refs.forEach(element => {
        result = result[element]
    });
    return result;
  }

  delete(item, isExisting){
    let refs = item.ref.split('|');
    let len = refs.length;
    let parent = this.folders;
    for(let i=0; i < len-1; i++){
      parent = parent[refs[i]];
    }
    let deleted = parent.splice(+refs[len-1], 1);
    isExisting ? this.trash.push(deleted) : null;
  }

  rename(item, name){
    if(!item.children){
      item['file_name'] = name;
      item['type'] = name.split('.').slice(-1) 
    }else{
      item['title'] = name;
      item['file_path'].split('/').slice(0,item['file_path'].length-1).join('/') + `/${name}`;
    }
  }

  addFile(parent){
    let file = {
      file_name : '',
      type: '',
      file_path: parent.file_path,
      ref: `${parent.ref}|children|${parent.children.length}`,
      renaming: true
    }
    parent.children.push(file);
  }

  addFolder(parent){
    let folder = {
      title : '',
      children: [],
      file_path: parent.file_path,
      ref: `${parent.ref}|children|0`,
      renaming: true
    }
    parent['open'] = true;
    parent.children.unshift(folder);
  }

  restore(item){

  }

  updateStorage(){

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
