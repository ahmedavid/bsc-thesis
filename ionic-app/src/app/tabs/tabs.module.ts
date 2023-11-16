import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DoctorsTabComponent } from './doctors-tab/doctors-tab.component';
import { BookingsTabComponent } from './bookings-tab/bookings-tab.component';
import { ConsultationTabComponent } from './consultation-tab/consultation-tab.component';
import { DoctorDetailComponent } from './doctor-detail/doctor-detail.component';
import { BookingFormComponent } from './booking-form/booking-form.component';

import { NgCalendarModule  } from 'ionic2-calendar';
import { CallModalComponent } from './consultation-tab/call-modal/call-modal.component';
import { AnswerModalComponent } from './consultation-tab/answer-modal/answer-modal.component';

@NgModule({
  imports: [
    NgCalendarModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TabsPageRoutingModule,
    FontAwesomeModule
  ],
  entryComponents:[BookingFormComponent,CallModalComponent,AnswerModalComponent],
  declarations: [TabsPage,DoctorsTabComponent,BookingsTabComponent,ConsultationTabComponent,
    DoctorDetailComponent,BookingFormComponent,CallModalComponent,AnswerModalComponent]
})
export class TabsPageModule {}
