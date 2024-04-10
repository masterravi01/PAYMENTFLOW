import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginOperationService } from '../login-operation.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(private router: Router, private _LOS: LoginOperationService) { }

  userProfile: any;
  SignupForm: FormGroup | any;

  ngOnInit(): void {
    this.SignupForm = new FormGroup({
      FirstName: new FormControl('', [
        Validators.required
      ]),
      LastName: new FormControl('', [
        Validators.required
      ]),
      Phone: new FormControl('', [Validators.required]),
      Email: new FormControl('', [Validators.required, Validators.email]),
      Password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      ConfirmPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      GoogleSubId: new FormControl(''),
      ProfilePic: new FormControl('')
    });
    if (sessionStorage.getItem("loggedInUser")) {
      this.userProfile = JSON.parse(sessionStorage.getItem("loggedInUser") || "");

      this._LOS.checkUserExist(this.userProfile).subscribe((data: any) => {
        console.log(data);
        if (data.data.Users.length > 0) {
          this.router.navigateByUrl(`/dashboard`);
        } else {
          this.SignupForm['controls']['FirstName'].setValue(this.userProfile?.given_name)
          this.SignupForm['controls']['LastName'].setValue(this.userProfile?.family_name)
          this.SignupForm['controls']['Email'].setValue(this.userProfile?.email)
          this.SignupForm['controls']['ProfilePic'].setValue(this.userProfile?.picture)
          this.SignupForm['controls']['GoogleSubId'].setValue(this.userProfile?.sub)
        }
      }, (error: any) => {
        console.log(error);
      });
    }


  }

  checkUser() {

  }
  signup() {
    this._LOS.userSignup({ User: this.SignupForm?.value }).subscribe((data: any) => {
      console.log(data);
    }, (error: any) => {
      console.log(error);
    });
  }
}
