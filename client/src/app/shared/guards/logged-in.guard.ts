import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthenticationService} from "../services/authentication.service";
import {catchError, map, of} from "rxjs";

export const loggedInGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authenticationService = inject(AuthenticationService);

  return authenticationService.isLoggedIn().pipe(map(isLoggedIn => {
    if (!isLoggedIn) {
      return true;
    } else {
      router.navigateByUrl('/user');
      return false;
    }
  }), catchError(err => {
    console.log(err);
    router.navigateByUrl('/user');
    return of(true);
  }));
};
