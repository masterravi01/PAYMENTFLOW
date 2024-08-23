import { Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation, AfterViewInit, OnDestroy } from '@angular/core';

declare var videojs: any;

@Component({
  selector: 'app-vjs-player',
  templateUrl: './vjs-player.component.html',
  styleUrls: ['./vjs-player.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class VjsPlayerComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('target', { static: true }) target!: ElementRef;
  @Input() videoLink!: string;

  options = {
    controls: true,
    responsive: true,
    fluid: true,
    notSupportedMessage: 'Invalid Video URL',
  }

  player!: any;

  constructor() { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.readyVideojsPlayer();
  }

  readyVideojsPlayer() {
    this.player = videojs(this.target.nativeElement, this.options);
    this.player.src({
      src: this.videoLink,
      type: 'application/x-mpegURL'
    });
  }

  ngOnDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  }
}
