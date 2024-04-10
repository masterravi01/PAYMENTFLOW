import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent {
  hideNavbar: boolean = false;
  prevScrollPos: number = window.pageYOffset;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const currentScrollPos = window.pageYOffset;
    if (this.prevScrollPos > currentScrollPos || currentScrollPos === 0) {
      this.hideNavbar = false;
    } else {
      this.hideNavbar = true;
    }
    this.prevScrollPos = currentScrollPos;
  }
}
