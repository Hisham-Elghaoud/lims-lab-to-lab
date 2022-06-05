import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {HomeComponent} from './home/home.component';
import {AuthGuard, NotAuthGuard} from './guards/AuthGuard';
import { MainComponent } from './home/content/main/main-component';
import { RequestsListComponent } from './home/content/requests-list/requests-list.component';
import { PatientSelectComponent } from './home/content/patient-select/patient-select.component';
import { NewRequestComponent } from './home/content/new-request/new-request.component';
import { PaymentComponent } from './home/content/payment/payment.component';
import { PatientsListComponent } from './home/content/patients-list/patients-list.component';
import { CorrespondentsListComponent } from './home/content/correspondents-list/correspondents-list.component';
import { ProfilesListComponent } from './home/content/profiles-list/profiles-list.component';
import { RequestSummaryComponent } from './home/content/request-summary/request-summary.component';
import { CorrespondentComponent } from './home/content/correspondent/correspondent.component';
import { SearchComponent } from './src/app/home/content/search/search.component';
import { ActivityComponent } from './home/content/activity/activity.component';
import { TestsComponent } from './home/content/tests/tests.component';
import { ReportsComponent } from './home/content/reports/reports.component';
import { DoctorComponent } from './home/content/doctor/doctor.component';
import { ReceptionistComponent } from './home/content/receptionist/receptionist.component';


const requestListChildren : Routes = [



]

const homeChildren: Routes = [
  // /, children : requestListChildren
  {
    path: '', component: RequestsListComponent
  },
  {
    path: 'search', component: SearchComponent
  },
  // {
  //   path: 'patients/:id/requests/:request_id/summary', component: RequestSummaryComponent

  // },
  // {
  //   path: 'patients/:id/requests/:request_id/payment', component: PaymentComponent

  // },
  {
    path: 'patients/:id/requests/:request_id/:action', component: NewRequestComponent

  },

  {
    path: 'requests/:action', component: NewRequestComponent

  },


  {
    path: 'activity', component: ActivityComponent

  },
  {
    path: 'receptionist', component: ReceptionistComponent

  },
  {
    path: 'reports', component: ReportsComponent

  },
  {
    path: 'tests', component: TestsComponent

  },

  {
    path: 'patients', component: PatientsListComponent

  },
  {
    path: 'correspondents', component: CorrespondentsListComponent

  },
  {
    path: 'doctors', component: DoctorComponent

  },
  // {
  //   path: 'correspondents/:id', component: CorrespondentComponent

  // },
  // {
  //   path: 'profiles', component: ProfilesListComponent

  // }


];


const routes: Routes = [

  {path: '', component: HomeComponent, children: homeChildren,canActivate: [AuthGuard]
  },
  {path: 'login', component: LoginComponent, canActivate: [NotAuthGuard]}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
