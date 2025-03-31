import { NgClass } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';

@Component({
  selector: 'app-header',
  imports: [RouterLinkActive,RouterLink,FontAwesomeModule,NgClass],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  title = signal("My account");
  faBars = faBars;

  showMenu: boolean = false;

  toggleMenu(){
    this.showMenu = !this.showMenu;
  }
}
