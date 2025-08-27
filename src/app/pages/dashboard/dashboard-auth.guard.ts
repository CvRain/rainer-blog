import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from '../../services/user';
import { BaseResponse, TokenVerifyResponse } from '../../services/types';

export const dashboardAuthGuard: CanActivateFn = (_route, state: RouterStateSnapshot): Observable<boolean | UrlTree> => {
  const router = inject(Router);
  const userService = inject(User);

  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
  if (!token) {
    return of(router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } }));
  }

  return userService.verifyToken(token).pipe(
    map((resp: BaseResponse<TokenVerifyResponse>) => {
      // 接口约定 code === 200 为成功
      if (resp && resp.code === 200) {
        return true;
      }
      return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
    }),
    catchError(() => of(router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } })))
  );
};


