import { ResultStatusPipe } from './pipes/result.pipe';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {NgxPaginationModule} from 'ngx-pagination';
import {RecaptchaModule} from 'ng-recaptcha';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {ContentComponent} from './home/content/content.component';
import {SidebarComponent} from './home/sidebar/sidebar.component';
import {NavComponent} from './home/nav/nav.component';
import {TitleComponent} from './home/content/title/title.component';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LoginComponent} from './login/login.component';
import {ApiService} from './services/api.service';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {TimeLeftPipe} from './pipes/time_left.pipe';
import {DatePipe} from './pipes/date.pipe';
import {TimePipe} from './pipes/time.pipe';
import {MainComponent} from './home/content/main/main-component';
import { RequestsListComponent } from './home/content/requests-list/requests-list.component';
import { PatientSelectComponent } from './home/content/patient-select/patient-select.component';
import { NewRequestComponent } from './home/content/new-request/new-request.component';
import { NewPatientComponent } from './home/content/new-patient/new-patient.component';
import { ProfileSelectComponent } from './home/content/profile-select/profile-select.component';
import { UrgentPipe } from './pipes/urgent.pipe';
import { RepeatPipe } from './pipes/repeat.pipe';
import { AuthGuard, NotAuthGuard } from './guards/AuthGuard';
import { PaymentComponent } from './home/content/payment/payment.component';
import { PatientsListComponent } from './home/content/patients-list/patients-list.component';
import { StatComponent } from './home/content/stat/stat.component';
import { TestSelectComponent } from './home/content/test-select/test-select.component';
import { CorrespondentsListComponent } from './home/content/correspondents-list/correspondents-list.component';
import { ProfilesListComponent } from './home/content/profiles-list/profiles-list.component';
import { NewCorrespondentComponent } from './home/content/new-correspondent/new-correspondent.component';
import { RequestSummaryComponent } from './home/content/request-summary/request-summary.component';
import { LoadingComponent } from './home/content/loading/loading.component';
import { ResultComponent } from './home/content/result/result.component';
import { CorrespondentComponent } from './home/content/correspondent/correspondent.component';
import { TheDatePipe } from './pipes/the-date.pipe';
import { AgoPipe } from './pipes/ago.pipe';
import { SearchComponent } from './src/app/home/content/search/search.component';
import { ItemSelectComponent } from './src/app/src/app/home/content/item-select/item-select.component';
import { ActivityComponent } from './home/content/activity/activity.component';
import { TestsComponent } from './home/content/tests/tests.component';
import { ReportsComponent } from './home/content/reports/reports.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LocalePipe } from './pipes/locale.pipe';
import { DoctorComponent } from './home/content/doctor/doctor.component';
import { FindPipe } from './pipes/find.pipe';
import { DrawSampleComponent } from './home/content/draw-sample/draw-sample.component';
import { ReceptionistComponent } from './home/content/receptionist/receptionist.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@NgModule({
  declarations: [
    AppComponent, DatePipe, TimePipe, ResultStatusPipe,
    ReportsComponent,
    HomeComponent,
    ContentComponent,
    SidebarComponent,
    NavComponent,
    TitleComponent, LoginComponent,

    TimeLeftPipe,
    UrgentPipe,
    RepeatPipe,
    MainComponent,TestSelectComponent,

    RequestsListComponent, ProfileSelectComponent,

    PatientSelectComponent,

    NewRequestComponent,

    NewPatientComponent,

    PaymentComponent,

    PatientsListComponent,

    StatComponent,

    CorrespondentsListComponent,

    ProfilesListComponent,

    NewCorrespondentComponent,

    RequestSummaryComponent,

    LoadingComponent,

    ResultComponent,

    CorrespondentComponent,

    TheDatePipe,

    AgoPipe,

    ActivityComponent,

    SearchComponent,

    ItemSelectComponent,

    TestsComponent,

    LocalePipe,
    DoctorComponent,
    FindPipe,
    DrawSampleComponent,
    ReceptionistComponent,

  ],
  imports: [
    BrowserModule, HttpClientModule, RecaptchaModule, NgMultiSelectDropDownModule.forRoot(),
    AppRoutingModule, NgxChartsModule, BrowserAnimationsModule, FormsModule, NgxPaginationModule, NgbModule
  ],
  providers: [ApiService, AuthGuard,NotAuthGuard, TheDatePipe, AgoPipe, LocalePipe, FindPipe],
  bootstrap: [AppComponent]
})
export class AppModule {
}

;
