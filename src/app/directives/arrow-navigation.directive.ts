import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: 'button[arrow-nav]',
  host: {
    "(keydown.arrowdown)": "moveDown($event)",
    "(keydown.arrowup)": "moveUp($event)",
  }
})
export class ArrowNavigationDirective {
  @Input('arrow-nav') item;
  constructor(private _el: ElementRef) { }

  moveUp(evt) {
    evt.preventDefault();
    let parent = this._el.nativeElement.parentElement;
    let prevSibling = parent.previousElementSibling;
    let target;

    if (prevSibling) {
      target = this.getPreviousTarget(prevSibling);
    } else {
      target = this.nearestPrevSibling(parent)['previousElementSibling']
    }

    target && target.focus();
  }

  moveDown(evt) {
    evt.preventDefault();
    let nextSibling = this._el.nativeElement.nextElementSibling;
    let target;
    if (nextSibling && !nextSibling.hidden && this.item.children.length) {
      target = nextSibling;
    } else {
      target = this.ancestorWithSiblings(this._el.nativeElement.parentElement)['nextElementSibling'];
    }
    target && target.getElementsByTagName('button')[0].focus();
  }

  getPreviousTarget(node){
    if (node.childElementCount === 1 || node.lastElementChild.hidden || !node.lastElementChild.getElementsByTagName('button').length)
        return node.firstElementChild;
      else {
        return this.getPreviousTarget(node.lastElementChild.getElementsByTagName('ul')[0].lastElementChild);
      }
  }

  nearestPrevSibling(node) {
    if (node.previousElementSibling || node.className === 'tabs') {
      return node
    } else {
      return this.nearestPrevSibling(node.parentElement)
    }
  }

  ancestorWithSiblings(node) {
    if (node.nextElementSibling || node.className === 'tabs') {
      return node;
    }
    return this.ancestorWithSiblings(node.parentElement)
  }
}
