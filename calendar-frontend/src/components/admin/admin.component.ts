import { Component, inject, NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { AddEventDialogComponent } from '../add-event-dialog/add-event-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-admin',
    imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, MatIconModule, TranslateModule],
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  readonly dialog = inject(MatDialog);
  isLoggedIn = true;
  username = '';
  password = '';

  login() {
    if (this.username === 'admin' && this.password === 'password') {
      this.isLoggedIn = true;
    } else {
      alert('Ungültige Anmeldedaten!');
    }
  }
  
  openDialog(): void {
    const dialogRef = this.dialog.open(AddEventDialogComponent, { autoFocus: false });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        //TODO: use input data to create a new entry in the database by sending the data via the service
      }
    })
  }
}