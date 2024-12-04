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
  @ViewChild("menuDialog") menuDialog!: TemplateRef<any>
  readonly dialog = inject(MatDialog);
  darkMode: boolean = false;
  navbar: any = null;
  currentLanguage: string = "de";
  isScreenSizeSmall$!: Observable<boolean>;
  isScreenSizeSmall: boolean = false;

  constructor(private app: AppComponent, private store: Store, private translate: TranslateService) { }

  ngOnInit() {
    const checkScreenSize = () => document.body.offsetWidth < 1281;
    const screenSizeChanged$ = fromEvent(window, 'resize').pipe(debounceTime(500), map(checkScreenSize));
    this.isScreenSizeSmall$ = screenSizeChanged$.pipe(startWith(checkScreenSize()));
    this.isScreenSizeSmall$.subscribe(x => {
      this.isScreenSizeSmall = x;
    });
  }

  ngAfterContentInit() {
    this.navbar = document.getElementById("navbar") as HTMLElement;

    if ((window.localStorage.getItem("Angular_Dark_Mode_Calendar") === "1" || window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
      && window.localStorage.getItem("Angular_Dark_Mode_Calendar") !== "0") {
      this.darkMode = true;
      this.checkDarkMode();
      if (window.localStorage.getItem("Angular_Dark_Mode_Calendar") !== "1") {
        try {
          window.localStorage.setItem("Angular_Dark_Mode_Calendar", "1");
        } catch (ex) {
          console.error("Unable to save dark mode flag to localStorage.");
        }
      }
    } else {
      this.darkMode = false;
      this.checkDarkMode();
      window.localStorage.setItem("Angular_Dark_Mode_Calendar", "0");
    }
  }

  checkDarkMode() {
    if (this.darkMode) {
      this.app.darkMode = true;
      this.app.checkDarkMode();
      // if (!this.navbar.classList.contains("mat-accent")) {
      //   this.navbar.classList.remove("mat-primary");
      //   this.navbar.classList.add("mat-accent");
      // }
      window.localStorage.setItem("Angular_Dark_Mode_Calendar", "1");
    } else {
      this.app.darkMode = false;
      this.app.checkDarkMode();
      // if (this.navbar.classList.contains("mat-accent")) {
      //   this.navbar.classList.remove("mat-accent");
      //   this.navbar.classList.add("mat-primary");
      // }
      window.localStorage.setItem("Angular_Dark_Mode_Calendar", "0");
    }
  }

  setCalendarLanguage(event: MatSelectChange) {
    this.store.dispatch(CalendarActions.SetUserLanguage({ language: event.value }));
    this.currentLanguage = event.value
  }

  openTemplateDialog() {
    const dialogRef = this.dialog.open(this.menuDialog, { autoFocus: false, position: { top: '40px', left: '40px' } });
  }

  openHelp() {
    var currentLang = this.translate.currentLang;
    var currentLocation = window.location.origin;
    var url = `${currentLocation}/help_${currentLang}.pdf`;
    window.open(url, '_blank');
  }
}
