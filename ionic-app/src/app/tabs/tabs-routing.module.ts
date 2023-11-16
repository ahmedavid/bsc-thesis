import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { DoctorsTabComponent } from './doctors-tab/doctors-tab.component';
import { BookingsTabComponent } from './bookings-tab/bookings-tab.component';
import { ConsultationTabComponent } from './consultation-tab/consultation-tab.component';
import { DoctorDetailComponent } from './doctor-detail/doctor-detail.component';
import { DoctorDetailResolver } from '../_resolvers/doctor-detail.resolver';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'doctors',
        children: [
          {
            path: '',
            component: DoctorsTabComponent
          },
          {
            path: ':id',
            component: DoctorDetailComponent,
            resolve: {doctor: DoctorDetailResolver}
          }
        ]
      },
      {
        path: 'mybookings',
        children: [
          {
            path: '',
            component: BookingsTabComponent
          }
        ]
      },
      {
        path: 'consultation',
        children: [
          {
            path: '',
            component: ConsultationTabComponent
          }
        ]
      },
      {
        path: 'consultation/:bookingId/:bookeeId/:bookerId',
        children: [
          {
            path: '',
            component: ConsultationTabComponent
          }
        ]
      },
      {
        path: '',
        redirectTo: 'mybookings',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'mybookings',
    pathMatch: 'full'
  }
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
