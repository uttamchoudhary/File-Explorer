import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class ExplorerService {
  private SHORT_JSON = "https://s3-ap-southeast-1.amazonaws.com/he-public-data/short_game_treea798b2e.json";
  private LONG_JSON = "https://s3-ap-southeast-1.amazonaws.com/he-public-data/long_game_tree77fa4dd.json";

  public fileHash: Array<any> = [];

  public folders : Array<any> = [];
  public trash : Array<any> = [];
  public recents : Array<any> = [];
  

  private currentHash = '';
  private currentFilePath = '';

  constructor(private _http: HttpClient) { }

  getStructure() {
    return new Observable(observer => {
      let data = localStorage.getItem("FILE_STRUCTURE");
      let fileRefs = localStorage.getItem("FILE_REF");
      let deleted = localStorage.getItem("TRASH");

      if (data && fileRefs) {
        this.fileHash = JSON.parse(fileRefs);
        this.folders = JSON.parse(data);
        this.trash = deleted ? JSON.parse(deleted) : [];

        observer.next({
          folders: this.folders,
          trash: this.trash,
          recent : this.recents
        });  
        observer.complete();
        
      } else {
        this._http.get(this.LONG_JSON).subscribe(
          (res: any) => {
            this.folders = res.map((elem, index) => this.formatData(elem, 0, index));
            localStorage.setItem("FILE_STRUCTURE", JSON.stringify(this.folders));
            localStorage.setItem("FILE_REF", JSON.stringify(this.fileHash));
            observer.next({
              folders: this.folders,
              trash: this.trash,
              recent: this.recents
            });
            observer.complete();
          },
          err => {
            alert("unable to load files. Please try again");
            observer.complete();
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

  getParentFolder(item, base){
    let refs = item.ref.split('|');
    let len = refs.length;
    if(len === 1)
      return {children: this.folders, ref: ''}
    
    let parent = base;
    for(let i=0; i < len-2; i++){
        parent = parent[refs[i]];
    }
    return parent;
  }

  delete(item, isExisting){
    let refs = item.ref.split('|');
    let len = refs.length;
    let siblings = this.folders;
    let parent;
    for(let i=0; i < len-1; i++){
      siblings = siblings[refs[i]];
      if(i === len-3)
        parent = siblings;
    }
    if(!parent)
      parent = {children: this.folders, ref: ''}

    let deleted = siblings.splice(+refs[len-1], 1);
    this.updateDataIndexing(parent);
    this.updateFileHash(deleted, parent, 'delete');
    isExisting ? this.trash.push(...deleted) : null;
  }

  rename(item, name){
    if(!item.children){
      item['file_name'] = name;
      item['type'] = name.split('.').slice(-1);
      this.updateFileHash(item, null, 'file_rename');
    }else{
      item['title'] = name;
      let paths = item['file_path'].split('/');
      item['file_path'] = paths.slice(0,paths.length-1).join('/') + `/${name}`;
      if(item.children.length){
        this.updateFilesPath(item);
      }
      this.updateFileHash(item, this.getParentFolder(item, this.folders), 'folder_rename');
    }
  }

  addFile(parent, file?){
    let newFile = file || {
      file_name : '',
      type: '',
      file_path: parent.file_path,
      ref: `${parent.ref}|children|${parent.children.length}`,
      renaming: true
    }
    parent.children.push(newFile);
    this.updateDataIndexing(parent);
  }

  addFolder(parent, folder?){
    let newFolder = folder || {
      title : '',
      children: [],
      file_path: parent.file_path,
      ref: `${parent.ref}|children|0`,
      renaming: true
    }
    parent['open'] = true;
    parent.children.unshift(newFolder);
    this.updateDataIndexing(parent);
  }

  restore(item, indexInTrash){
    let parentInFolders = this.getParentFolder(item, this.folders);
    let indexInFolders = +item.ref.split('|').slice(-1);
    parentInFolders['children'].splice(indexInFolders, 0, item);
    this.trash.splice(indexInTrash,1);
    this.updateDataIndexing(parentInFolders);

    let node = parentInFolders['children'][indexInFolders];
    this.updateFileHash(node, null, 'restore');
  }

  updateDataIndexing(node){
    node.children.forEach((child, index) => {
      child['ref'] = node.ref ? `${node['ref']}|children|${index}` : `${index}`;
      if(child.children && child.children.length)
        this.updateDataIndexing(child);
    });
  }

  updateRecent(item, noReorder?){
    if(noReorder)
      return
      
    let index = this.recents.map(file => file.ref).indexOf(item.ref);
    index > -1 ? this.recents.splice(index,1) : null;
    this.recents.unshift(item);
  }

  updateFilesPath(node){
    node.children.forEach((child, index) => {
      if(child.children){
        child['file_path'] = `${node['file_path']}/${child['title']}`;
        this.updateFilesPath(child);
      }else {
        child['file_path'] = `${node['file_path']}`;
      }
    });
  }

  updateFileHash(node, parent, type){
    switch(type){
      case 'delete':{
        let filesToRemove = this.extractFiles(node);
        let newFiles = this.extractFiles(parent);
        let refs = this.fileHash.map(item => item.ref);
        filesToRemove.forEach(file => {
          let index = refs.indexOf(file.ref);
          refs.splice(index, 1);
          this.fileHash.splice(index,1);
        });
        newFiles.forEach(file => {
          this.fileHash.push({
            name : file.file_name,
            ref: file.ref,
            file_path: file.file_path
          })
        });
        break;
      }
      case 'file_rename': {
        let file = this.fileHash.filter(item => item.ref === node.ref)[0];
        file ? file.name = node.file_name : this.fileHash.push({
          name : node.file_name,
          ref: node.ref,
          file_path: node.file_path
        });
        break;
      }
      case 'folder_rename':{
        let files = this.extractFiles(node.children.length > 0 ? parent : node);
        let refs = this.fileHash.map(item => item.name);
        files.forEach(file => {
          let index = refs.indexOf(file.file_name);
          this.fileHash[index] = {
            name : file.file_name,
            ref: file.ref,
            file_path: file.file_path
          }
        });
        break;
      }
      case 'restore':{
        let files = this.extractFiles(node);
        files.forEach(file => {
          this.fileHash.push({
            name : file.file_name,
            ref: file.ref,
            file_path: file.file_path
          });
        });
        break;
      }
      default: null
    }
  }

  extractFiles(node){
    if(!node)
      return;

    if(!node.children)
      return [node]

    let list = [];
    node.children.forEach(child => {
      child.children ? list.push(...this.extractFiles(child)) : list.push(child)
    })

    return list;
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

  updateStorage(){
    localStorage.setItem("FILE_STRUCTURE", JSON.stringify(this.folders));
    localStorage.setItem("FILE_REF", JSON.stringify(this.fileHash));
    localStorage.setItem("TRASH", JSON.stringify(this.trash));
  }
}
