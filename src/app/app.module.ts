import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { FolderComponent } from './components/folder/folder.component';
import { FileViewComponent } from './components/file-view/file-view.component';
import { LoaderComponent } from './components/loader/loader.component';
import { ContextMenuComponent } from './components/context-menu/context-menu.component';


@NgModule({
  declarations: [
    AppComponent,
    FolderComponent,
    FileViewComponent,
    LoaderComponent,
    ContextMenuComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [ContextMenuComponent]
})
export class AppModule { }
