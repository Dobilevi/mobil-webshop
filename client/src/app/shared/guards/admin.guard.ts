import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthenticationService} from "../services/authentication.service";
import {catchError, map, of} from "rxjs";

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authenticationService = inject(AuthenticationService);

  return authenticationService.isLoggedIn().pipe(map(isLoggedIn => {
    if (!isLoggedIn) {
      router.navigateByUrl('/login');
      return false;
    } else {
      if (authenticationService.isAdmin()) {
        return true;
      } else {
        router.navigateByUrl('/');
        return false;
      }
    }
  }), catchError(err => {
    console.log(err);
    router.navigateByUrl('/login');
    return of(false);
  }));
};
