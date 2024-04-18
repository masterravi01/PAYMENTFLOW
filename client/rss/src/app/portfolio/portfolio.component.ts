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

  hideNavbar: boolean = false;
  prevScrollPos: number = window.pageYOffset;

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
  onScroll() {
    const scrollPos = window.scrollY;
    const rotation = scrollPos / 5;
    this.circleElement.nativeElement.style.transform = `rotate(${rotation}deg)`;
    const box = document.querySelector('.tab-titles');
    const abouttab = document.getElementById('about');
    if (abouttab) {
      const aboutPosition = abouttab.getBoundingClientRect().top;
      const screenHeight = window.innerHeight;
      if (aboutPosition + 280 < screenHeight) {

        const targetTab1 = document.querySelector('.about-col-1');
        if (targetTab1) {
          targetTab1.classList.add('about-animation-1');
        }
        const targetTab2 = document.querySelector('.about-col-2');
        if (targetTab2) {
          targetTab2.classList.add('about-animation-2');
        }
      }
    }
    if (box) {
      const boxPosition = box.getBoundingClientRect().top;
      const screenHeight = window.innerHeight;
      if (boxPosition + 50 < screenHeight) {
        const activeLink = document.querySelector('.link-active') as HTMLElement;
        if (activeLink) {
          const targetTab = document.getElementById(activeLink.innerText.toLowerCase());
          if (targetTab) {
            targetTab.classList.add('active-tab');
          }
        }
      }
    }

    const currentScrollPos = window.pageYOffset;
    if (this.prevScrollPos > currentScrollPos || currentScrollPos === 0) {
      this.hideNavbar = false;
    } else {
      this.hideNavbar = true;
    }
    this.prevScrollPos = currentScrollPos;
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
    const tablinks = document.querySelectorAll('.links');
    tablinks.forEach(link => link.classList.remove('link-active'));
    const tabcont = document.querySelectorAll('.tab-contents');
    tabcont.forEach(tab => tab.classList.remove('active-tab'));
    (event.target as HTMLElement).classList.add('link-active');
    const targetTab = document.getElementById(tabname);
    if (targetTab) {
      targetTab.classList.add('active-tab');
    }
  }

  closeNav() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      sidebar.style.right = "-200px"
    }
  }
  openNav() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      sidebar.style.right = "0"
    }
  }

}
