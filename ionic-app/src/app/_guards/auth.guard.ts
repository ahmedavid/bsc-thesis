import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
/**
 * Guard responsible for preventing unauthenticated users from accessing protected routes
 */
@Injectable({providedIn:'root'})
export class AuthGuard implements CanActivate {
    /**
     * 
     * @param authService Inject AuthService
     * @param router Inject Angular Router
     */
    constructor(private authService: AuthService,private router: Router){}
    /**
     * Implement canActivate() method in order to detect if user is loggedin
     */
    canActivate() {
        /**Check if user is loggedin */
        const isLoggedIn = this.authService.loggedIn();
        if(!isLoggedIn) {
            /**Redirect user to authetication page */
            this.router.navigate(['auth']);
            return false;
        }
        return true;
    }

}