import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserData } from '../UserData/userdata';

@Injectable({
  providedIn: 'root'
})

class LoginAuth {
  constructor(private _Router: Router) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    return this.getUser();
  }
  getUser(): boolean {
    try {
      let u = new UserData();
      let data = u.getData('userdata');
      if (data) {
        return true;
      } else {
        this._Router.navigateByUrl('/login');
        return false;
      }
    } catch (e) {
      this._Router.navigateByUrl('/login');
      return false;
    }
  }
}

export const LoginauthGuard: CanActivateFn = (route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot): boolean => {
  return inject(LoginAuth).canActivate(route, state)
}


