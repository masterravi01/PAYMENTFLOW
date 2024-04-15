import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { ModalContentComponent } from '../modal-content/modal-content.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalService } from '../services/global.service';
import { UserData } from '../UserData/userdata';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  public username: string = "";
  public password: string = "";
  LoginForm: FormGroup | any;
  UserData: UserData | undefined;

  constructor(
    private _PS: ProductService,
    private _ModalService: NgbModal,
    private _GS: GlobalService,
    private router: Router
  ) { }

  ngOnInit() {
    this.LoginForm = new FormGroup({
      Email: new FormControl('', [Validators.required, Validators.email]),
      Password: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ])
    });
    // this._PS.readUsers({}).subscribe(
    //   (data: any) => {
    //     console.log(data);

    //   },
    //   (error: any) => {
    //     console.log(error);
    //   }
    // );
  }

  onSubmit() {
    console.log(this.LoginForm.value);

    console.log(`Username: ${this.username}, Password: ${this.password}`);
    let obj = JSON.parse(JSON.stringify(this.LoginForm.value));
    this._PS.userLogin(obj).subscribe(
      {
        next: (data: any) => {
          console.log(data.data.User);
          this.UserData = new UserData();
          this.UserData.setData(data.data.User, 'userdata');
          this.router.navigateByUrl('/dashboard');
          this._GS
            .openErrorMsg(
              data.statusMessage
            );
        },
        error: (error: any) => {
          console.log(error);
          this._GS
            .openErrorMsg(
              error.statusMessage
            );
        }
      }
    );
  }
}
