import { CanActivate, Router, ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { Injectable } from "@angular/core";
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable()
export class AuthGuard implements CanActivate {




    constructor(private router : Router) { }

    canActivate(route: ActivatedRouteSnapshot){


        if (sessionStorage.getItem('UserToken') === null){

            this.router.navigateByUrl('/login');
            return false;

        }  else return true;





    }

}


@Injectable()
export class NotAuthGuard implements CanActivate {




    constructor(private router : Router) { }

    canActivate(route: ActivatedRouteSnapshot){


        if (sessionStorage.getItem('UserToken') === null) return true;
        else{
          this.router.navigateByUrl('/');
          return false;
        }

    }

}
