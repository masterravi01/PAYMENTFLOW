import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  public username: string = "";
  public password: string = "";
  LoginForm: FormGroup | any;

  constructor(private _PS: ProductService) { }

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
    this._PS.userLogin(this.LoginForm.value).subscribe(
      (data: any) => {
        console.log(data);

      },
      (error: any) => {
        console.log(error);
      }
    );
  }
}
