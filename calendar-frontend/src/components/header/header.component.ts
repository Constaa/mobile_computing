import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { debounceTime, fromEvent, map, Observable, startWith } from 'rxjs';
import { AppComponent } from '../../app/app.component';
import * as CalendarActions from '../../shared/store/calendar/calendar.actions';

@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatSelectModule, MatIconModule, MatCardModule, MatSlideToggleModule, MatButtonModule, FormsModule, TranslateModule, RouterLink, MatDialogModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  //Create a reference to the menu template in the HTML template of the component.
  @ViewChild("menuDialog") menuDialog!: TemplateRef<any>
  readonly dialog = inject(MatDialog);
  darkMode: boolean = false;
  navbar: any = null;
  currentLanguage: string = "de";
  isScreenSizeSmall$!: Observable<boolean>;
  isScreenSizeSmall: boolean = false;

  constructor(private app: AppComponent, private store: Store, private translate: TranslateService) { }

  /**
   * Internal Angular function that is called once when the component is being accessed.
   */
  ngOnInit() {
    const checkScreenSize = () => document.body.offsetWidth < 1281;
    const screenSizeChanged$ = fromEvent(window, 'resize').pipe(debounceTime(500), map(checkScreenSize));
    this.isScreenSizeSmall$ = screenSizeChanged$.pipe(startWith(checkScreenSize()));
    this.isScreenSizeSmall$.subscribe(x => {
      this.isScreenSizeSmall = x;
    });
  }

  /**
  * Internal Angular function that is calles once the site view (HTML DOM) has been constructed.
  */
  ngAfterContentInit() {
    this.navbar = document.getElementById("navbar") as HTMLElement;

    //Check if the dark mode flag exists in localStorage or if the browser preference is set to dark mode
    if ((window.localStorage.getItem("Angular_Dark_Mode_Calendar") === "1" || window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
      && window.localStorage.getItem("Angular_Dark_Mode_Calendar") !== "0") {
      this.darkMode = true;
      this.checkDarkMode();
      if (window.localStorage.getItem("Angular_Dark_Mode_Calendar") !== "1") {
        try {
          //Set an entry in localStorage to store the dark mode preference
          window.localStorage.setItem("Angular_Dark_Mode_Calendar", "1");
        } catch (ex) {
          console.error("Unable to save dark mode flag to localStorage.");
        }
      }
    } else {
      this.darkMode = false;
      this.checkDarkMode();
      //Set an entry in localStorage to store the dark mode preference
      window.localStorage.setItem("Angular_Dark_Mode_Calendar", "0");
    }
  }

  /**
   * Function for connecting to the dark mode settings in the App component and handling these settings accordingly.
   */
  checkDarkMode() {
    if (this.darkMode) {
      this.app.darkMode = true;
      this.app.checkDarkMode();
      window.localStorage.setItem("Angular_Dark_Mode_Calendar", "1");
    } else {
      this.app.darkMode = false;
      this.app.checkDarkMode();
      window.localStorage.setItem("Angular_Dark_Mode_Calendar", "0");
    }
  }

  /**
   * Function for setting the application language.
   * @param event MatSelectChange event that is emitted when the corresponding select control has been changed.
   */
  setCalendarLanguage(event: MatSelectChange) {
    //Dispatch an action to the store for setting the application language in the store.
    this.store.dispatch(CalendarActions.SetUserLanguage({ language: event.value }));
    this.currentLanguage = event.value
  }

  /**
   * Function for opening the menu dialog, where settings can be changed if the app is displayed on a small screen.
   */
  openTemplateDialog() {
    const dialogRef = this.dialog.open(this.menuDialog, { autoFocus: false, position: { top: '40px', left: '40px' } });
  }

  /**
    * Function for opening the help document in a separate tab.
    */
  openHelp() {
    var currentLang = this.translate.currentLang;
    var currentLocation = window.location.origin;
    var url = `${currentLocation}/help_${currentLang}.pdf`;
    window.open(url, '_blank');
  }
}
