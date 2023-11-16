import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
/**
 * Auth Page hold Login and Register Components
 */
@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  selectedSegment = 'login';

  constructor() { }

  ngOnInit() {
  }
  /**Keeps track of which tab is selected (Login or Register) */
  segmentChanged(segment) {
    this.selectedSegment = segment.detail.value;
  }

}
