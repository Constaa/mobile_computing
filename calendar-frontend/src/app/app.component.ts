import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../components/header/header.component';
import { OverlayContainer } from '@angular/cdk/overlay';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'calendar-frontend';
  darkMode: boolean = false;
  rootElement: any = null;

  constructor(public overlayContainer: OverlayContainer) { }

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
}
