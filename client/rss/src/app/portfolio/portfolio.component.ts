import { Component, ElementRef, HostBinding, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {
  isDarkMode = false;
  @ViewChild('circle') circleElement!: ElementRef;
  dynamicText: HTMLSpanElement | null | undefined;
  words: string[] = ["Ravi Parmar", "Developer", "Engineer ", "Programmer"];
  wordIndex: number = 0;
  charIndex: number = 0;
  isDeleting: boolean = false;

  @HostBinding('style.--background-color')
  backgroundColor: string = '#000';
  @HostBinding('style.--text-color')
  textColor: string = '#fff';
  @HostBinding('style.--card-color')
  cardColor: string = '#262626';

  constructor(private elementRef: ElementRef, private renderer: Renderer2) { }
  ngOnInit(): void {
    this.dynamicText = document.querySelector<HTMLSpanElement>('h1 span');
    this.typeEffect();
    const scriptURL = 'https://script.google.com/macros/s/AKfycbwFnbOaZui6s-X1d_UhygyKcnnQE6flw9KJTkGk8Mnu_ixopzqNrGDIRaMd4hzCNS_H/exec';
    const form = document.querySelector('form[name="submit-to-google-sheet"]') as HTMLFormElement;
    const msg = document.getElementById('msg');

    if (msg) {
      form.addEventListener('submit', (e: Event) => {
        e.preventDefault();
        fetch(scriptURL, { method: 'POST', body: new FormData(form) })
          .then((response: Response) => {
            msg.innerHTML = "Message Sent Successfully!"
            setTimeout(() => {
              msg.innerHTML = '';
            }, 5000);
            form.reset();
            console.log('Success!', response)
          })
          .catch((error: Error) => console.error('Error!', error.message));
      });
    } else {
      console.error("Element with id 'msg' not found.");
    }
  }
  @HostListener('window:scroll', ['$event'])
  onScroll(event: any) {
    const scrollPos = window.scrollY;
    const rotation = scrollPos / 5; // You can adjust the speed of rotation by changing the divisor
    this.circleElement.nativeElement.style.transform = `rotate(${rotation}deg)`;
  }
  typeEffect(): void {
    const currentWord: string = this.words[this.wordIndex];
    const currentChar: string = currentWord.substring(0, this.charIndex);
    if (this.dynamicText)
      this.dynamicText.textContent = currentChar;

    if (!this.isDeleting && this.charIndex < currentWord.length) {
      this.charIndex++;
      setTimeout(() => this.typeEffect(), 200);
    } else if (this.isDeleting && this.charIndex > 0) {
      this.charIndex--;
      setTimeout(() => this.typeEffect(), 100);
    } else {
      this.isDeleting = !this.isDeleting;
      this.wordIndex = !this.isDeleting ? (this.wordIndex + 1) % this.words.length : this.wordIndex;
      setTimeout(() => this.typeEffect(), 1200);
    }
  }
  changeTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    // const hostElement = this.elementRef.nativeElement;
    if (this.isDarkMode) {
      this.backgroundColor = '#fff';
      this.textColor = '#000';
      this.cardColor = '#D3D3D3'
    } else {
      this.backgroundColor = '#000';
      this.textColor = '#fff';
      this.cardColor = '#262626'
    }
  }

  scrollTo(section: string): void {
    const element = this.elementRef.nativeElement.querySelector(`#${section}`);
    element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
  }
  opentab(tabname: string, event: Event) {
    let tablinks: Element[] = Array.from(document.getElementsByClassName('links'));
    let tabcont: Element[] = Array.from(document.getElementsByClassName('tab-contents'));
    for (let l of tablinks) {
      l.classList.remove('link-active');
    }
    for (let t of tabcont) {
      t.classList.remove('active-tab');
    }
    (event.currentTarget as HTMLElement).classList.add('link-active');
    let c: HTMLElement | null = document.getElementById(tabname);
    if (c) {
      c.classList.add('active-tab');
    }
  }
  closeNav() {
    let c: HTMLElement | null = document.getElementById('sidebar');
    if (c) {
      c.style.right = "-200px"
    }
  }
  openNav() {
    let c: HTMLElement | null = document.getElementById('sidebar');
    if (c) {
      c.style.right = "0"
    }

  }

}
