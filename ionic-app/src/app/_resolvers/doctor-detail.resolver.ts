import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { UsersService } from '../_services/users.service';
import { catchError } from 'rxjs/operators';
import { User } from '../models/models';

/**
 * Resolve selected doctor details before entering doctor-details page
 */
@Injectable({
    providedIn: 'root'
})
export class DoctorDetailResolver implements Resolve<User> {
    constructor(private usersService: UsersService, private router: Router) {}
    /**
     * Download user details using UsersService
     * @param route Activated Route
     */
    resolve(route: ActivatedRouteSnapshot): Observable<User> {
        return this.usersService.getUser(route.params.id).pipe(
            catchError(error => {
                /**If error with retrieving data , redirect to main page */
                this.router.navigateByUrl('/menu');
                return of(null);
            })
        );
    }
}
