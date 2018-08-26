import {
    Directive,
    Input,
    ElementRef,
    OnInit,
    AfterViewInit
} from "@angular/core";
import { ExplorerService } from "../services/explorer.service";

@Directive({
    selector: "input[update-item]",
    host: {
        "(click)": "$event.stopPropagation()",
        "(contextmenu)": "$event.stopPropagation()",
        "(keyup.enter)": "rename()",
        "(blur)": "rename()"
    }
})
export class UpdateItemDirective implements AfterViewInit {
    @Input("update-item")
    itemRef;

    constructor(private _el: ElementRef, private _explorer: ExplorerService) {}

    ngAfterViewInit() {
        this._el.nativeElement.focus();
    }

    rename() {
        let name = this._el.nativeElement.value;
        this.itemRef["renaming"] = false;

        if (!name && this.itemRef.children && this.itemRef.children.length)
            return;
        else if (!name) this._explorer.delete(this.itemRef, false);
        else {
            this.itemRef.children
                ? null
                : this._explorer.updateRecent(this.itemRef, false);
            this._explorer.rename(this.itemRef, name);
        }
    }
}
