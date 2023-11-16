import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/_services/users.service';
import { LoadingController } from '@ionic/angular';
import { Router,Event, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';

@Component({
  selector: 'app-doctors-tab',
  templateUrl: './doctors-tab.component.html',
  styleUrls: ['./doctors-tab.component.scss'],
})
export class DoctorsTabComponent implements OnInit {

  doctors = [];
  filteredDoctors = [];
  specs = [];
  selectedSpeciality = '-- Select Speciality --';
  loading: HTMLIonLoadingElement;

  constructor(
    private usersService: UsersService,
    private loadingCtrl: LoadingController,
    private router: Router,
    ) {}
  ngOnInit(): void {
    this.createLoader();
    this.getDoctors();
    this.getSpecialities();
    // setTimeout(()=>{
    //   this.router.navigate(['/menu/tabs/consultation/68/1/5'],{state:{test:123}})
    // },2000)
  }

  /**Show a loader if data is being retrieved from server */
  async createLoader() {
    this.loading =  await this.loadingCtrl.create({
      message: 'Loading...'
    });
    this.router.events.subscribe((routerEvent: Event) => {
      if (routerEvent instanceof NavigationStart) {
        this.loading.present();
      }
      if (routerEvent instanceof NavigationEnd ||
        routerEvent instanceof NavigationCancel ||
        routerEvent instanceof NavigationError) {
          this.loading.dismiss();
      }
    });
  }

  /**Download doctors list from api */
  getDoctors() {
    this.usersService.getUsers(true).subscribe(
      (users: any[]) => {
        this.doctors = users;
        this.filteredDoctors = this.doctors;
      }
    );
  }

  /**Filters list of doctors according to given parameters */
  getFilteredDoctors() {
    if (this.selectedSpeciality === '-- Select Speciality --') {
      return this.filteredDoctors;
    } else {
      return this.filteredDoctors.filter(d => d.speciality.name === this.selectedSpeciality);
    }
  }
  /**Download list of specialities from api */
  getSpecialities() {
    this.usersService.getSpecialities().subscribe(
      (specs: any[]) => {
        this.specs = specs;
      }
    );
  }

  /**Filters doctors list according to text typed in search bar */
  onChange(ev) {
    const searchText = ev.detail.value;
    if (searchText) {
      this.filteredDoctors = this.doctors.filter(d => d.fullname.includes(searchText) || d.speciality.name.includes(searchText));
    } else {
      this.filteredDoctors = this.doctors;
    }
  }

  /**If filtering parameters are cleared return all doctors */
  onClear(ev) {
    this.filteredDoctors = this.doctors;
  }

}
