import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime, fromEvent, map, Observable, startWith } from 'rxjs';
import { CalendarComponent } from '../components/calendar/calendar.component';
import { HeaderComponent } from '../components/header/header.component';
import * as CalendarSelectors from '../shared/store/calendar/calendar.selectors';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, MatButtonModule, MatIconModule],
  providers: [CalendarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'calendar-frontend';
  darkMode: boolean = false;
  rootElement: any = null;
  currentLanguage$!: Observable<string>;
  currentLanguage: string = "de";
  isScreenSizeSmall$!: Observable<boolean>;
  isScreenSizeSmall: boolean = false;

  constructor(public overlayContainer: OverlayContainer, private translate: TranslateService, private store: Store) {
    //Setup the initial config of the translation.
    this.translate.addLangs(['de', 'en-gb']);
    this.translate.setDefaultLang('de');
    this.translate.use('de');
  }

  /**
   * Internal Angular function that is called once when the component is being accessed.
   */
  ngOnInit() {
    this.currentLanguage$ = this.store.select(CalendarSelectors.selectCurrentUserLanguage);
    this.currentLanguage$.subscribe(x => {
      this.translate.use(x);
    });

    //Setup event listener for detecting changes in screen size
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
    //Handle dark mode after first component initialization
    this.rootElement = document.getElementById("root-element") as HTMLBodyElement;

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
   * Function for handling the CSS classes depending on the set dark mode preference.
   */
  checkDarkMode() {
    if (this.darkMode) {
      if (!this.rootElement.classList.contains("dark-theme")) {
        this.rootElement.classList.add("dark-theme");
      }
      this.overlayContainer.getContainerElement().classList.add("dark-theme");
      window.localStorage.setItem("Angular_Dark_Mode_Calendar", "1");
    } else {
      if (this.rootElement.classList.contains("dark-theme")) {
        this.rootElement.classList.remove("dark-theme");
      }
      this.overlayContainer.getContainerElement().classList.remove("dark-theme");
      window.localStorage.setItem("Angular_Dark_Mode_Calendar", "0");
    }
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
