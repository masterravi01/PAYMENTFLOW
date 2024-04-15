import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { UserData } from '../UserData/userdata';
declare var handleSignout: any; // Declare the global function to avoid TypeScript errors

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  constructor(private router: Router) { }
  userProfile: any;
  UserData: any;

  ngOnInit() {
    this.UserData = new UserData().getData('userdata');
    if (sessionStorage.getItem("loggedInUser")) {

      this.userProfile = JSON.parse(sessionStorage.getItem("loggedInUser") || "");
    }

  }
  handleSignOut() {
    handleSignout();
    sessionStorage.removeItem("loggedInUser");
    this.router.navigate(["/login"]).then(() => {
      window.location.reload();
    });
  }
}