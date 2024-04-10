import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ModalContentComponent } from '../modal-content/modal-content.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor(
    private _http: HttpClient,
    private _ModalService: NgbModal,
  ) { }
  BaseURL: string = environment.backendurl;
  httpOptions = {
    withCredentials: true,
  };
  openErrorMsg(str: any) {
    let cfm = this._ModalService.open(ModalContentComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false,
    });
    cfm.componentInstance.name = str;
    return cfm;
  }
}
