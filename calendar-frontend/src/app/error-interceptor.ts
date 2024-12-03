import { inject, Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHandlerFn } from '@angular/common/http';

import { Observable, tap } from 'rxjs';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

export function ErrorInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    let _snackBar = inject(MatSnackBar);

    return next(req).pipe(
        tap({
            error: (error) => {
                console.log(error)
                var snackBarConfig: MatSnackBarConfig = {
                    horizontalPosition: "end",
                    duration: 7000,
                    panelClass: "errorSnackbar"
                }

                _snackBar.open(error.message, "", snackBarConfig);
            }
        })
    );
}