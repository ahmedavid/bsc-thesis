import { Component, OnInit } from '@angular/core';
import { faUsersCog, faCalendarAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { Router, RouterEvent } from '@angular/router';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  faSignOutAlt = faSignOutAlt;

  pages = [
    {
      title: 'Booking',
      url: '/menu/tabs',
      icon: faCalendarAlt
    },
    {
      title: 'Settings',
      url: '/menu/settings',
      icon: faUsersCog
    },
  ];
  selectedPath: string;

  constructor(private router: Router, private authService: AuthService) {
    this.router.events.subscribe((event: RouterEvent) => {
      if (event && event.url) {
        this.selectedPath = event.url;
      }
    });
  }

  ngOnInit() {
  }

  logout() {
    this.authService.logout();
  }

}
