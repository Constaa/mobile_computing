import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';

import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Observable, tap } from 'rxjs';

/**
 * Function for intercepting HTTP requests and displaying an error message in case of error states.
 * @param req The incoming request that is being intercepted.
 * @param next The function that defines how the request is altered / passed-through.
 * @returns HttpEvent containing the altered request / response.
 */
export function ErrorInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    let _snackBar = inject(MatSnackBar);

    return next(req).pipe(
        tap({
            error: (error) => {
                //Configure notification message.
                var snackBarConfig: MatSnackBarConfig = {
                    horizontalPosition: "end",
                    duration: 7000,
                    panelClass: "errorSnackbar"
                }

                //Display notification message.
                _snackBar.open(error.message, "", snackBarConfig);
            }
        })
    );
}