import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  OnChanges,
  AfterViewInit,
} from "@angular/core";
import { ApiService } from "src/app/services/api.service";
import { map, tap } from "rxjs/operators";
import { SnackService } from "src/app/services/snack.service";
import { Router } from "@angular/router";
import { ProgressService } from "src/app/services/progress.service";
import { AgoPipe } from "src/app/pipes/ago.pipe";
import { formatCurrency } from "@angular/common";
import { NgForm } from "@angular/forms";
import { DataService } from "src/app/services/data.service";
import { Arabic } from "flatpickr/dist/l10n/ar";
declare var $: any;

@Component({
  selector: "app-new-patient",
  templateUrl: "./new-patient.component.html",
  styleUrls: ["./new-patient.component.scss"],
})
export class NewPatientComponent implements OnInit, OnChanges, AfterViewInit {
  genders$: any;
  civilities$: any;
  @Input() isCreate: boolean = true;
  genders: any = [];
  civilities: any = [];
  civility_id: any = null;
  ageTypes = ["years", "months", "days"];
  promise;
  @Output() patientCreated = new EventEmitter();

  changeAgeType = (type, form: NgForm) => {
    this.patient.age_type = type;
    form.value.age_type = type;
  };

  @Input() patient: any;

  @Input() action: any;

  constructor(
    public api: ApiService,
    public snack: SnackService,
    private router: Router,
    public progress: ProgressService,
    private ago: AgoPipe,
    public data: DataService
  ) {}

  ngOnInit() {
    this.getData();

    // initlize the picker
  }

  genderChanged({ value }) {
    let civ;
    let mr = ["mr", "MR", "Mr", "mR"];
    let ms = ["ms", "MS", "Ms", "mS"];
    let gender = this.genders.filter((one) => one.id == value)[0]["name"];
    if (this.civilities.length) {
      civ = this.civilities.filter(
        (one) =>
          (gender == "male" && mr.includes(one.name)) ||
          (gender == "female" && ms.includes(one.name))
      )[0];
      civ.id ? (this.patient.civility_id = civ.id) : null;
    }
  }

  ngAfterViewInit() {
    $("#patient_picker").flatpickr({
      dateFormat: "d-m-Y",
      allowInput: true,
      locale: this.data.language == "arabic" ? Arabic : null,
      position: "auto center",
    });
  }

  getData() {
    this.getGenders().subscribe((res) => {
      this.getCivilities().subscribe((res) => {});
    });
  }

  getGenders() {
    return this.api.genders.getGenders().pipe(
      map((res) => res["data"]),
      tap((res) => {
        this.genders = res;
        this.patient.gender_id = this.patient.gender_id || res[0].id;
        console.log("=====================>", this.patient.gender_id);
        this.genderChanged({ value: res[0].id });
      })
    );
  }

  getCivilities() {
    return this.api.civilities.getCivilities().pipe(
      map((res) => res["data"]),
      tap((res) => {
        this.civilities = res;
        this.patient.civility_id
          ? null
          : (this.patient.civility_id = res[0].id);
      })
    );
  }

  onSubmit(form) {
    form.value.age_type = this.patient.age_type;

    if (form.valid) {
      // switch between creating and editing
      switch (this.action["type"]) {
        case "New": {
          let vals = form.value;
          var birthdate = $("#patient_picker")[0].value.split("-");
          form.value.birth_year = birthdate[2] ? birthdate[2] : undefined;
          form.value.birth_month = birthdate[1] ? birthdate[1] : undefined;
          form.value.birth_day = birthdate[0] ? birthdate[0] : undefined;
          console.log(form.value);
          if (!vals["birth_year"] && !vals["age"])
            return this.snack.showerror("Please enter either age or birthdate");
          this.api.Patients.createPatient(form.value).subscribe((res) => {
            if (!res["error"]) {
              this.snack.show("The patient was successfully added");

              this.patientCreated.emit(res["patient_id"]);
            } else {
              this.snack.showerror("Something went wrong");
            }
          });

          break;
        }

        case "Edit": {
          var birthdate = $("#patient_picker")[0].value.split("-");
          form.value.birth_year = birthdate[2] ? birthdate[2] : undefined;
          form.value.birth_month = birthdate[1] ? birthdate[1] : undefined;
          form.value.birth_day = birthdate[0] ? birthdate[0] : undefined;
          this.api.Patients.editPatient(this.patient.id, form.value).subscribe(
            (res) => {
              if (res["error"] != true) {
                this.snack.show("The patient was successfully updated");
                this.patientCreated.emit(res);
              }
            }
          );

          break;
        }
      }
    } else {
      this.snack.showerror("Please enter all data correctly and try again");
    }
  }

  ngOnChanges(changes) {
    this.progress.onDP();
    if (!this.patient) {
      this.patient = {
        first_name: "",
        middle_name: "",
        last_name: "",
        birth_year: "",
        birth_month: "",
        insurance_id: "",
        hospital_id: "",
        birth_day: "",
        gender_id: this.genders[0] ? this.genders[0].id : null,
        civility_id: this.civilities[0] ? this.civilities[0].id : null,
        age: "",
        age_type: "years",
      };
    }
    if (
      !changes.action ||
      !changes.action.currentValue ||
      !changes.action.currentValue.type
    ) {
      changes.action = {};
      changes.action["currentValue"] = {};
    }

    if (changes.action.currentValue.type != null) {
      let type = changes.action.currentValue.type;
      this.setPatientIfAvaliable(type);
    }
  }

  setPatientIfAvaliable(type) {
    switch (type) {
      case "New": {
        console.log(this.patient);

        this.patient = {
          age_type: "years",
          gender_id: this.patient.gender_id,
          civility_id: this.patient.civility_id,
        };
        console.log(this.patient);

        this.civility_id = null;
        this.progress.offDP();
        let picker = $("#picker")[0];
        if (picker) picker.value = null;

        break;
      }
      case "Edit": {
        this.api.Patients.getPatient(this.action["id"]).subscribe((res) => {
          this.patient = res;
          [this.patient.age, this.patient.age_type, this.patient.birthdate] =
            this.ago.transform(res["birthdate"], { slashes: true });
          this.civility_id = this.patient.civility_id;
          let picker = $("#picker")[0];
          if (picker)
            picker.value =
              this.patient.birth_day +
              "-" +
              this.patient.birth_month +
              "-" +
              this.patient.birth_year;

          this.progress.offDP();
        });
        break;
      }
    }
  }

  // createRequest(patient_id){

  //   this.api.Requests.createIntialRequest(patient_id).subscribe(res => {

  //     if (res['error'] == false ){

  //       this.router.navigateByUrl(`/patients/${patient_id}/requests/${res['request_id']}/add`);
  //       console.log('here');

  //       $("#modal").toggle("hide");
  //       $('body').removeClass('modal-open');
  //       $('.modal-backdrop').remove();
  //       $('.dropdown-menu').dropdown('hide');

  //     }
  //     else {

  //       this.snack.showerror('something went wrong');

  //     }

  //   })

  // }

  // }
}
