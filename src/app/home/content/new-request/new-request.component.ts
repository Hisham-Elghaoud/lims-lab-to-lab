import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "src/app/services/api.service";
import { filter, map, tap } from "rxjs/operators";
import { SnackService } from "src/app/services/snack.service";
import { ProgressService } from "src/app/services/progress.service";
import { TheDatePipe } from "src/app/pipes/the-date.pipe";
import { DataService } from "src/app/services/data.service";
import { Timestamp } from "rxjs/internal/operators/timestamp";
import { AgoPipe } from "src/app/pipes/ago.pipe";
import { NgForm } from "@angular/forms";
import { Arabic } from "flatpickr/dist/l10n/ar";

import { Observable, fromEvent, of } from "rxjs";

import { debounce } from "lodash";
import { LocalePipe } from "src/app/pipes/locale.pipe";

declare var $: any;

@Component({
  selector: "app-new-request",
  templateUrl: "./new-request.component.html",
  styleUrls: ["./new-request.component.scss"],
})
export class NewRequestComponent implements OnInit {
  request_being_made: boolean = false;
  doctor = null;
  download_upload_modal_data = {
    title: "",
  };

  buttons: Array<{ label: string; data: any }> = [
    {
      label: "Download",
      data: { title: "Download" },
    },
  ];
  x(reception_number, test_name) {
    this.reception_number = reception_number;
    this.test_name = test_name;
  }
  reception_number: string = "";
  test_name: string = "";

  discount: any = {};
  clinic: {
    id: Number;
    name: String;
    address: String;
    contact: String;
    isActive: Boolean;
    created_at: string;
    updated_at: string;
  } = null;
  request: any = {
    correspondent_id: 0,
    // hospital_id: "",
    doctor: "",
    clinical_information: "",
    laboratory_information: "",
    pricing_id: 0,
    urgent_flag: false,
    is_repeat: false,
  };
  patient_insurance_id: "";
  profile_tests = [];
  profiles = [];
  profile = {};
  isProfileSelected = false;
  isTestSelected = false;
  patientId: any;
  request_id: any;
  requestNum: any;
  action: "New" | "Edit" = null;
  v;
  goToHome = false;
  // isDisable = false

  //-----------------------------------------------------------------------------------------
  correspondents: Observable<any> = of([]);
  doctors: any = [];
  pricings: Observable<any> = of([]);
  searchType: any = "t";
  total: any = 0;
  remaining: any = 0;
  selectedProfiles: any = [];
  selectedTests: any = [];
  originalTestsRemaining = 0;
  patient: any = {};
  ts_form = {};
  requests: any;
  historyData: any;
  pagination: any = {};
  page: number = 1;
  total_rows: number;
  isTax = false;
  isLabNotesSaveHidden = true;
  defaultPrice: 1;
  reasons: any = [];
  confirmDeleteTest: any;
  testReasonTest: any;
  testReasonAmount: any;
  reason: any;

  showWSaveLabNotes() {
    this.isLabNotesSaveHidden = false;
  }

  saveLabNotes(lab_input) {
    this.api.Requests.lab_info(this.request_id, {
      laboratory_information: lab_input.value,
    }).subscribe((res) => {
      this.isLabNotesSaveHidden = true;
      if (!res["error"]) {
        this.snack.show("The note was successfully updated"
        );
      }
    });
  }

  constructor(
    private theDate: TheDatePipe,
    private route: ActivatedRoute,
    public api: ApiService,
    public snack: SnackService,
    public router: Router,
    public progress: ProgressService,
    public data: DataService,
    private ago: AgoPipe,
    private localePipe: LocalePipe
  ) {
    this.onSubmit = debounce(this.onSubmit, 500);
  }

  setSelectedPatient(patient) {
    let to_be_assigned = JSON.parse(JSON.stringify(patient));
    [to_be_assigned.age, to_be_assigned.age_type, to_be_assigned.birthdate] =
      this.ago.transform(to_be_assigned["birthdate"], { slashes: true });
    this.patient = to_be_assigned;
  }

  download(form: NgForm) {
    let data = JSON.parse(JSON.stringify(form.value));
    let number = data["correspondent"]["lab_id"] + data["reception_number"];
    this.api
      .get("api/ltl/requests/download", "?number=" + number, { baseURL: true })
      .subscribe((res) => {
        if (!res["error"]) {
          let patient = res["data"]["patient"];
          patient["civility_id"] = patient["civility"]["id"];
          patient["civility"] = patient["civility"]["name"];
          patient["first_name"] = patient["name"].split(" ")[0];
          // patient['middle_name'] = ''
          patient["last_name"] = patient["name"]
            .split(" ")
            .filter((one, i) => i)
            .join(" ");

          delete patient["id"];

          this.setSelectedPatient(patient);
          delete res["data"]["patient"];
          this.selectedTests = res["data"]["tests"];
          delete res["data"]["tests"];
          // res['data']['correspondent_id'] = data['to_lab_id']
          this.request = res["data"];
          this.request["urgent_flag"] = false;
          this.request["type"] = "downloaded";
          this.request["correspondent_id"] = data["correspondent"]["id"];
          this.correspondents.toPromise().then((corres) => {
            this.change_pricing(data["correspondent"]);
            document.getElementById("download_closer").click();
          });
        }
      });
  }

  change_pricing(correspondent, correspondents = []) {
    if (correspondent == 0) {
      return (this.request.pricing_id = this.defaultPrice);
    }
    let cor = correspondent["pricing_id"]
      ? correspondent
      : correspondents.find((one) => one.id == correspondent);
    cor.pricing_id ? (this.request.pricing_id = cor.pricing_id) : null;
    this.changeTestsPricing();
  }

  ngOnInit() {
    this.getclinic(true);
    this.getDoctors();
    this.checkTax();
    this.getDefaultPrice();
    // this.api.Doctors.getDoctors().subscribe(
    //   (res) => {
    //     this.doctors = res["data"];
    //   },
    //   (error) => console.log("oops(getDoctors)=========>", error)
    // );

    this.data.discountMade.subscribe((discount) => {
      this.discount = discount || this.discount;
      this.changeTestsPricing();
      this.data.isDiscount ? $("#payment_modal").modal("toggle") : null;
    });

    this.api.common.getInfo().subscribe((res) => {
      console.log("info", res);
      this.confirmDeleteTest = res["data"]["settings"]["confirmDeleteTest"];
    });

    $("#picker").flatpickr({
      dateFormat: "d-m-Y",
      locale: this.data.language == "arabic" ? Arabic : null,
      position: "auto center",
    });

    this.route.params.subscribe((params) => {
      this.patientId = params["id"];
      this.request_id = params["request_id"];
      this.requestNum = params["requestNum"];
      // this.getSelectedProfiles();

      switch (params["action"]) {
        case "add": {
          this.action = "New";
          this.getPricing();
          break;
        }

        case "edit": {
          this.progress.on();
          this.getPatient(this.patientId);
          // this.getSelectedTests();
          this.getTotal();
          this.getclinic(true);
          this.action = "Edit";
          this.getRequest();
          setTimeout(() => this.getPricing(), 800);
          break;
        }

        default: {
          this.router.navigateByUrl("/");
        }
      }

      this.getCorrespondents();
    });
  }

  getPatient(id) {
    this.api.Patients.getPatient(id).subscribe(
      (res: any) => {
        this.progress.off();
        [res.age, res.age_type, res.birthdate] = this.ago.transform(
          res["birthdate"],
          { slashes: true }
        );
        this.patient = res;
        // this.patient['birthdate'] = res['birth_year'] + "-" + res['birth_month'] + "-" + res['birth_day']
      },
      (error) => {}
    );
  }
  getclinic(status) {
    this.api.Clinics.getclinic(status).subscribe((res) => {
      this.clinic = res["data"][0];
      this.request.isClinic = this.clinic ? 1 : 0;
      // console.log("isClinic ----------------->", this.request.isClinic);
    });
  }

  getCorrespondents() {
    this.correspondents = this.api.Correspondents.getCorrespondents().pipe(
      map((res) => res["data"]),
      tap((res) => {
        this.action === "New"
          ? (this.request.correspondent_id =
              (res.filter((one) => one["is_default"])[0] || {}).id || "0")
          : null;
      })
    );
  }
  getDoctors() {
    this.api.Doctors.getDoctors().subscribe((res) => {
      this.doctors = res["data"];
      if (this.request && Number(this.request["doctor"])) {
        this.doctor = this.doctors.find(
          (doc) => doc.id == this.request["doctor"]
        );
      }
    });
  }

  getPricing() {
    this.pricings = this.api.Pricing.getPricing().pipe(
      map((res) => res["data"]),
      tap((res) => {
        if (this.action === "New") {
          // this.request.pricing_id = res[0].id;
          this.request.pricing_id = this.defaultPrice;
        } else {
          this.setPricing();
        }
      })
    );

    // console.log(this.pricings);
  }

  toggle(value) {
    this.searchType = value;
  }
  async history() {
    await this.getData(this.page);
    $("#history").modal("toggle");
  }
  async getData(page = this.page) {
    this.page = page;

    // console.log("hospital_id ====>", this.request.patient_details.hospital_id);
    let queries = "&hospital_id=" + this.request.patient_details.hospital_id;
    this.api.Search.get(page || 1, queries).subscribe((res) => {
      this.historyData = res["data"];
      this.total_rows = res["total"];
      this.pagination = res["meta"]
        ? res["meta"]
        : {
            per_page: res["per_page"] || 10000,
            current_page: res["current_page"] || 1,
            totalItems: res["last_page"] * res["per_page"] || 100,
          };
    });
  }

  profile_tests_select_all(unselect) {
    const ids = [];
    for (let index = 0; index < this.selectedTests.length; index++) {
      ids[index] = this.selectedTests[index].id;
    }
    this.profile_tests.forEach((test) => {
      if (!ids.includes(test.id)) {
        let element = document.getElementById("profile_tests|" + test.id);
        if (element["checked"] == unselect) element.click();
      }
    });
  }

  openPayment(discount = false) {
    this.data.payment_request_id = this.request_id;
    this.data.payment_patientId = null;
    this.data.isDiscount = discount;
    this.data.payment_patientId = this.patientId;
    // this.isDisable = false;
    $("#payment_modal").modal("toggle");
  }

  open_profile_tests_modal(test) {
    // console.log(this.selectedTests, test )
    this.profile_tests = test["nested_tests"].map((nested) => {
      let t = nested["test"];
      t["disabled"] = !!this.selectedTests.filter(
        (one) =>
          one.id == t.id && (!one.profile || test["id"] != one.profile.id)
      ).length;
      return t;
    });
    this.profile = test;
    $("#profile_tests_modal").modal("toggle");
  }

  check_if_exisit(id, test_id) {
    const checkbox_input = document.getElementById(id);
    const ids = [];
    for (let index = 0; index < this.selectedTests.length; index++) {
      ids[index] = this.selectedTests[index].id;
    }
    if (ids.includes(test_id)) {
      checkbox_input.addEventListener("click", (event) => {
        event.preventDefault();
      });
    }
  }

  async setProfileTests(form: NgForm) {
    let tests = Object.keys(form.value).filter((key) => form.value[key]);
    let profile = this.profiles.find((pro) => pro.id == this.profile["id"]);
    if (profile) {
      profile["tests"] = tests;
    } else {
      this.profile["tests"] = this.profile["tests"] || [];
      this.profile["tests"].push(...tests);
      this.profiles.push(this.profile);
    }
    this.selectedTests = this.selectedTests.filter(
      (test) => form.value[test.id] !== false
    );
    let body = await this.get_body();

    body["tests"].push(...tests);

    if (body["tests"].length) {
      this.api.Tests.getPricedTests(body).subscribe((one) => {
        this.selectedTests = one["data"]["tests"].map((test) => {
          let te = this.selectedTests.find((t) => t.id == test.id);
          te = Object.assign(te || {}, test);
          return te;
        });
        this.selectedTests = this.selectedTests.map((one) => {
          if (tests.includes(`${one.id}`)) one["profile"] = this.profile;
          return one;
        });
        this.total = one["data"]["total"];
        $("#profile_tests_modal").modal("toggle");
      });
    } else $("#profile_tests_modal").modal("toggle");
  }

  ngAfterViewInit() {
    this.action == "New"
      ? (this.patient = {
          age_type: "years",
        })
      : null;
    this.action == "New" ? this.getDefaultPrice() : null;
  }

  openReasonModal(test, amount) {
    this.testReasonTest = test;
    this.testReasonAmount = amount;
    $("#reasonModal").modal("show");
  }
  addReasons(reason) {
    this.reasons.push({
      test_id: this.testReasonTest["id"],
      reason: reason.value,
    });
    this.removeTest(this.testReasonTest, this.testReasonAmount);
    this.reason = "";
    this.testReasonTest = {};
    this.testReasonAmount = 0;
    $("#reasonModal").modal("hide");
  }

  onSubmit(form, { isPay = false, isDiscount = false }) {
    // this.isDisable = true;
    if (this.request_being_made) return;
    form.value.isClinic = form.value.isClinic == 1 ? true : false;
    form.value["type"] = this.request["type"];
    form.value["doctor"] = this.doctor ? this.doctor.id : null;
    form.value["number"] = this.request.number;
    form.value["reasons"] = this.reasons;
    form.value.in_patient = form.value.in_patient == 1 ? true : false;
    form.value["correspondent_id"] =
      Number(form.value["correspondent_id"]) || null;
    let error = "";

    if (this.patient.birthdate) {
      let birthdate = this.patient.birthdate.split("-");
      this.patient.birth_year = birthdate[2] ? birthdate[2] : undefined;
      this.patient.birth_month = birthdate[1] ? birthdate[1] : undefined;
      this.patient.birth_day = birthdate[0] ? birthdate[0] : undefined;
    } else {
      this.patient.birth_year = undefined;
      this.patient.birth_month = undefined;
      this.patient.birth_day = undefined;
      // this.isDisable = false;
    }

    if (!this.selectedTests.length) {
      error = "Please pick at least one test | profile";
      // this.isDisable = false;
    }

    if (error) return this.snack.showerror(error);

    form.value.patient = this.patient;

    form.value["tests"] = this.selectedTests
      .map((one) => one.id)
      .filter((one) => {
        let bool = true;
        this.profiles.forEach((profile) => {
          profile["tests"].includes("" + one) ? (bool = false) : null;
        });
        return bool;
      });

    form.value["profiles"] = this.profiles.map(({ id, tests }) => ({
      id,
      tests,
    }));

    if ($("#picker")[0].value != "")
      form.value.hospitalization_date = $("#picker")[0]
        .value.split("-")
        .reverse()
        .join("-");

    if (this.request_id) {
      // this.isDisable = true;
      this.request_being_made = true;

      form.value.request_id = this.request_id;
      // console.log('form.value', form.value)
      // return
      this.api.Requests.editRequestInfo(this.request_id, form.value).subscribe(
        (res) => {
          this.request_being_made = false;

          if (isPay || isDiscount) this.openPayment(isDiscount);
          else {
            this.snack.show(
              `The request was successfully ${
                this.action == "New" ? "created" : "updated"
              }`
            );
            if (this.action == "New") {
              this.print();
              this.printBarcode();
            }
            setTimeout(() => this.router.navigateByUrl(""), 800);
          }

          // this.setPricing();
          // this.router.navigateByUrl(`/patients/${this.patientId}/requests/${this.request_id}/payment`);
        },
        (error) => {
          this.request_being_made = false;
          this.snack.showerror(error["error"]["message"]);
        }
      );
    } else {
      if (!this.patient.first_name)
        error = "Please pick a firstname for the patient";
      else if (!this.patient.last_name)
        error = "Please pick a lastname for the patient";
      else if (!this.patient.birthdate && !this.patient.age)
        error = "Please pick birthdate or age for the patient";

      if (error) {
        // this.isDisable = false;
        return this.snack.showerror(error);
      }
      this.request_being_made = true;

      this.api.Requests.createIntialRequest(form.value).subscribe(
        (done) => {
          // this.isDisable = true;
          this.request_being_made = false;
          // document.getElementById("onSubmitButton").disabled = true;

          this.request = done["data"];
          this.request_id = done["data"]["id"];
          this.requestNum = done["data"]["reception_number"];

          this.patientId = done["data"]["patient_id"];

          if (isPay || isDiscount) this.openPayment(isDiscount);
          else {
            // $('#onSubmitButton').prop('disabled', true);

            this.snack.show("the request was successfully created");
            this.print();
            this.printBarcode();
            setTimeout(() => this.router.navigateByUrl(""), 800);
          }
        },
        (error) => {
          this.request_being_made = false;
          this.snack.showerror(error["error"]["message"]);
        }
      );
    }

    // switch(this.action){

    //   case 'New' : {

    //     this.createRequest(form)
    //     break;
    //   }

    //   case 'Edit' : {
    //     this.editRequest(form)
    //     break;
    //   }

    // }
  }

  editRequest(form) {
    if (form.valid) {
      if (this.isTestSelected || this.isProfileSelected) {
        if ($("#picker")[0].value != "")
          form.value.hospitalization_date = $("#picker")[0]
            .value.split("-")
            .reverse()
            .join("-");

        if (this.request_id != null) {
          form.value.request_id = this.request_id;
          this.api.Requests.editRequestInfo(
            this.request_id,
            form.value
          ).subscribe(
            (res) => {
              this.setPricing();
              // this.router.navigateByUrl(`/patients/${this.patientId}/requests/${this.request_id}/payment`);
              this.snack.show("the request was successfully updated");
              setTimeout(() => this.router.navigateByUrl(""), 800);
            },
            (error) => {}
          );
        }
      } else {
        this.snack.showerror("Please select a test or profile");
      }
    } else {
      this.snack.showerror("Please enter all data correctly and try again");
    }
  }

  createRequest(form) {
    if (form.valid) {
      if (this.isTestSelected) {
        if ($("#picker")[0].value != "")
          form.value.hospitalization_date = $("#picker")[0]
            .value.split("-")
            .reverse()
            .join("-");
        // else {
        //   this.snack.showerror('Please enter the hospiatalization date');
        //   return null
        // };

        if (this.request_id != null) {
          form.value.request_id = this.request_id;
          this.api.Requests.setRequestInfo(
            this.request_id,
            form.value
          ).subscribe((res) => {
            this.setPricing();
            this.snack.show("the request was successfully created");
            this.print();
            this.printBarcode();
            setTimeout(() => this.router.navigateByUrl(""), 800);
          });
          // this.printBarcode();
        }
      } else {
        this.snack.showerror("Please select a test/profile");
      }
    } else {
      this.snack.showerror("Please enter all data correctly and try again");
    }
  }

  setPricing() {
    this.api.Requests.setRequestPricing(
      this.request_id,
      this.request.pricing_id
    ).subscribe((res) => {
      // this.total = res['total'];
      this.getTotal();
      this.getSelectedTests();
    });
  }

  get_body() {
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            request_id: this.request.id,
            correspondent_id: Number(this.request["correspondent_id"]) || null,
            pricing_id: this.request["pricing_id"],
            discount: this.discount["amount"],
            isPercentage: this.discount["type"] == "percentage",
            tests: this.selectedTests.map((one) => one.id),
          }),
        0
      )
    );
  }

  checkTax() {
    this.api.settings.checkTax().subscribe((res) => {
      this.isTax = res["isTax"];
    });
  }

  getDefaultPrice() {
    this.api.common.getInfo().subscribe((res) => {
      if (res["data"]["settings"]["defaultPrice"] != null) {
        this.defaultPrice = res["data"]["settings"]["defaultPrice"];
      } else {
        this.pricings = this.api.Pricing.getPricing().pipe(
          map((res) => res["data"]),
          tap((res) => {
            this.defaultPrice = res[0]["id"];
            this.request.pricing_id = this.defaultPrice;
          })
        );
      }
      console.log("defaultPrice", this.defaultPrice);
    });
  }

  async changeTestsPricing(test = { id: null }) {
    let id = test.id;
    let body = await this.get_body();
    if (test["isPackage"]) {
      test["nested_tests"].forEach((te) => {
        if (!body["tests"].includes(te.nested_test_id))
          body["tests"].push(te.nested_test_id);
      });
    } else {
      if (id) {
        if (body["tests"].includes(id))
          return this.snack.showerror("Test/Profile is already selected");
        else body["tests"].push(id);
      }
    }

    if (body["tests"].length) {
      this.api.Tests.getPricedTests(body).subscribe((one) => {
        this.selectedTests = one["data"]["tests"].map((test) => {
          let te = this.selectedTests.find((t) => t.id == test.id);
          te = Object.assign(te || {}, test);
          return te;
        });
        this.total = one["data"]["total"];
        this.remaining = one["data"]["total"] - this.originalTestsRemaining
      });
    }
  }

  // setSelectedTest(test) {
  //   // this.api.Tests.addTestToRequest(this.request_id,{test_id:test.id}).subscribe(res => {
  //   //   if(!res['error']){
  //   //     this.get_payment()
  //   //     // this.total = res['total'];
  //   //     this.getTotal()
  //   //     this.getSelectedTests();
  //   //     this.isTestSelected = true;

  //   //   }
  //   //     else {

  //   //       this.snack.showerror(res['message']);
  //   //     }

  //   // });
  // }

  setSelectedProfile(profile) {
    if (this.request_id != null) {
      this.api.Profiles.addProfileToRequest(this.request_id, {
        profile_id: profile.id,
      }).subscribe((res) => {
        if (!res["error"]) {
          this.isProfileSelected = true;
          // this.total = res['total'];
          this.getSelectedProfiles();
        }
      });
    }
  }

  getSelectedProfiles() {
    if (this.request_id != null) {
      this.api.Profiles.getRequestProfiles(this.request_id).subscribe((res) => {
        this.selectedProfiles = res["data"];
        switch (res["data"].length) {
          case 0:
            this.isProfileSelected = false;
            break;
          default:
            this.isProfileSelected = true;
        }
      });
    }
  }

  getSelectedTests() {
    if (this.request_id != null) {
      this.api.Tests.getRequestTests(this.request_id).subscribe((res) => {
        if (res["data"]) {
          this.selectedTests = res["data"].map((test) => {
            this.profiles.forEach((profile) => {
              profile.tests.includes("" + test.id)
                ? (test["profile"] = profile)
                : null;
            });
            return test;
          });
          
    console.log('this.selectedTests', this.selectedTests)

          switch (res["data"].length) {
            case 0:
              this.isTestSelected = false;
              break;
            default:
              this.isTestSelected = true;
          }
        }
      });
    }
  }

  getRequest() {
    this.api.Requests.getRequest(this.request_id).subscribe((res) => {
      this.request = res;
      this.request.hospitalization_date
        ? (this.request.hospitalization_date = this.request.hospitalization_date
            .split("-")
            .reverse()
            .join("-"))
        : null;
      if (this.request["doctor"]) {
        if (this.doctors.length) {
          this.doctor = this.doctors.find(
            (doc) => doc["id"] == this.request["doctor"]
          );
        }
      }
      this.profiles = res["profiles"].map((profile) => {
        profile["tests"] = profile["tests"].map((one) => "" + one);
        return profile;
      });
      delete this.request["type"];
      this.request.correspondent_id = res["correspondent"]
        ? res["correspondent"]["id"]
        : "0";
      this.request.pricing_id = res["pricing"]["id"];
      this.request.urgent_flag = res["urgent_flag"];
      this.requestNum = res["reception_number"];
      this.discount = res["discount"]["data"][0] || {};
      $("#picker")[0].value = res["hospitalization_date"]
        ? this.theDate.transform(res["hospitalization_date"])
        : "01-01-1990";
      // this.total = res['total']
      this.getSelectedTests();
    });
  }

  removeProfile(profile) {
    this.api.Profiles.removeProfileFromRequest(
      this.request_id,
      profile.id
    ).subscribe((res) => {
      this.getSelectedProfiles();
      this.getTotal();
    });
  }

  removeTest(test, amount) {
    this.selectedTests = this.selectedTests.filter((one) => one.id != test.id);
    if (test.profile) {
      let profile = this.profiles.find((pro) => pro.id == test.profile.id);
      profile["tests"] = profile["tests"].filter((one) => one != test.id);
    }
    this.total -= amount;
    this.remaining -= amount;

    // this.api.Tests.removeTestFromRequest(this.request_id, test.id).subscribe(
    //   (res) => {
    //     console.log(res);

    //     this.getSelectedTests();
    //     this.getTotal();
    //     this.get_payment();
    //   }
    // );
  }

  get_payment() {
    this.data.payment_patientId = null;
    this.data.payment_request_id = null;
  }

  getTotal() {
    this.api.Requests.getTotal(this.request_id).subscribe((res) => {
      this.total = res["total_summery"];
      this.remaining = res["remaining"];
      this.originalTestsRemaining = res["total_summery"] - res["remaining"];
    });
  }

  print() {
    this.api.Printables.PrintRecieptForZebra(this.request_id).subscribe(
      (response) => {
        //Next callback
      },
      (error) => {
        //Error callback
        console.error("error caught in component");
        this.api.Printables.PrintReciept(this.request_id).subscribe((res) => {
          const fileURL = URL.createObjectURL(res);
          window.open(fileURL, "_blank");
        });
      }
    );
  }

  printBarcode() {
    this.api.Printables.PrintBarcodesForZebra(this.request_id, false).subscribe(
      (response) => {
        //Next callback
      },
      (error) => {
        //Error callback
        console.error("error caught in component");
        this.api.Printables.PrintBarcodes(this.request_id, true).subscribe(
          (res) => {
            const fileURL = URL.createObjectURL(res);
            window.open(fileURL, "_blank");
          }
        );
      }
    );
  }
}
