import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthenticationService} from "../services/authentication.service";
import {catchError, map, of} from "rxjs";

export const authenticationGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  return inject(AuthenticationService).isLoggedIn().pipe(map(isLoggedIn => {
    if (!isLoggedIn) {
      router.navigateByUrl('/login');
      return false;
    } else {
      return true;
    }
  }), catchError(err => {
    console.log(err);
    router.navigateByUrl('/login');
    return of(false);
  }));
};
