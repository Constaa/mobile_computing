import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { AddEventDialogComponent } from '../add-event-dialog/add-event-dialog.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  readonly dialog = inject(MatDialog);

  /**
   * Function for opening the dialog window containing the form for adding new events.
   */
  openDialog(): void {
    const dialogRef = this.dialog.open(AddEventDialogComponent, { autoFocus: false });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        //TODO: use input data to create a new entry in the database by sending the data via the service
      }
    })
  }
}
