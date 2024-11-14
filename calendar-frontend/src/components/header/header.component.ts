import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { AppComponent } from '../../app/app.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatSelectModule, MatIconModule, MatCardModule, MatSlideToggleModule, MatButtonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  darkMode: boolean = false;
  navbar: any = null;

  constructor(private app: AppComponent) { }

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
  }
}
