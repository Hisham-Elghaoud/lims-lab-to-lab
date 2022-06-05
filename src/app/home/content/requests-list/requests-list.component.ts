import {
  Component,
  OnInit,
  AfterViewChecked,
  AfterViewInit,
} from "@angular/core";
import { ApiService } from "src/app/services/api.service";
import { map, tap, debounceTime } from "rxjs/operators";
import { Router, ActivatedRoute } from "@angular/router";
import { DataService } from "src/app/services/data.service";
import { SnackService } from "src/app/services/snack.service";
import { ProgressService } from "src/app/services/progress.service";
import { Arabic } from "flatpickr/dist/l10n/ar";

import { Observable, fromEvent } from "rxjs";
import { debounce } from "lodash";
declare var $: any;
declare let moment;

@Component({
  selector: "app-requests-list",
  templateUrl: "./requests-list.component.html",
  styleUrls: ["./requests-list.component.scss"],
})
export class RequestsListComponent implements OnInit, AfterViewInit {
  username: any = sessionStorage.getItem("userName");

  patient_search: any = "";
  reception_num: any = "";

  page = 1;
  from = "";
  to = "";
  type: string = "name";
  correspondents: any;
  correspondent: any = "";
  requests: any;
  pagination: any = {};
  payment_statuses = ["paid", "unpaid"];
  payment_status: any = "";

  isLoaderHidden = true;
  isHashLoaderHidden = true;
  payment_request_id: number;
  payment_patientId: number;
  summery_request_id: number;
  summery_patientId: number;
  current_role: string = "receptionist";
  base: string = this.api.ng_url;
  roles: Array<any> = [];
  urls = {
    admin: "admin",
    receptionist: "res",
    technician: "tec",
    accountant: "fms",
  };
  req_id = null;
  inactive_tests: any = []
  col = 12

  navigate(role) {
    window.open(this.base + "/" + this.urls[role], "_blank");
  }

  constructor(
    public api: ApiService,
    public router: Router,
    public data: DataService,
    public snack: SnackService,
    public progress: ProgressService,
    public route: ActivatedRoute
  ) {
    this.getRequests = debounce(this.getRequests, 300);
  }

  getInactiveTestsWithNotes(){
    let status = "inactive"
    let category = ''
    let withNotes = '&hasNote=1'
    
    this.api.Tests.getTests3('',null,category,status,withNotes).subscribe(res => {
      this.inactive_tests = res['data']
      console.log('inactive_tests', this.inactive_tests)
      this.inactive_tests.length > 0 ? this.col = 8 : this.col = 12
    });
  }

  ngOnInit() {
    this.data.payment_request_id = null;
    this.getInactiveTestsWithNotes()
    let queries = this.data.queries;
    for (let key in queries) {
      switch (key) {
        case "reception_num":
          this.reception_num = queries[key];
          break;

        case "payment_status":
          this.payment_status = queries[key];
          break;

        case "reception_number":
          this.reception_num = queries[key];
          break;

        case "patient_search":
          let patient_search = queries[key].match(/[0-9]+-[0-9]+-[0-9]+/)
            ? queries[key].split("-").reverse().join("-")
            : queries[key];
          this.patient_search = patient_search;
          break;

        case "patient_search_by":
          this.type = queries[key];
          break;

        case "min_date":
          this.from = queries[key].split("-").reverse().join("-");
          break;

        case "max_date":
          this.to = queries[key].split("-").reverse().join("-");

          break;
        case "page":
          this.page = queries[key];

          break;

        case "correspondent_id":
          this.correspondent = queries[key];
          break;

        default:
          break;
      }
    }
    this.data.isDiscount = false;
    this.api.common.get_me().subscribe((res) => {
      this.roles = res["data"].roles;
    });
    this.api.Correspondents.getCorrespondents().subscribe((res) => {
      this.progress.off();
      this.correspondents = res["data"];
    });
    this.progress.on();
    this.getRequests(this.page);

    setInterval(() => {
      if (this.pagination.current_page == 1) {
        this.getRequests(1);
      }
    }, 30000);
    // var input$ : Observable<any> = fromEvent($('#request_autocomplete'), 'input');
    // input$.pipe(map(res => res['target'].value)).subscribe(res => {
    //   this.key = res
    //   this.isLoaderHidden = false
    //   // this.isHashLoaderHidden = false
    //   this.getRequests(1);
    // })

    // var input1$ : Observable<any> = fromEvent($('#request_num_autocomplete'), 'input');
    // input1$.pipe(map(res => res['target'].value)).subscribe(res => {
    //   this.reception_num = res
    //   this.isHashLoaderHidden = false
    //   this.getRequests(1);
    // })
  }

  ngAfterViewInit() {
    $("#fromPicker").val(this.from);
    $("#toPicker").val(this.to);
    $("#birthdatePicker").val(this.patient_search);

    setTimeout(() => {
      $("#fromPicker").flatpickr({
        dateFormat: "d-m-Y",
        allowInput: true,
        locale: this.data.language == "arabic" ? Arabic : null,
        position: "auto center",
      });

      $("#toPicker").flatpickr({
        dateFormat: "d-m-Y",
        allowInput: true,
        locale: this.data.language == "arabic" ? Arabic : null,
        position: "auto center",
      });

      $("#birthdatePicker").flatpickr({
        dateFormat: "d-m-Y",
        allowInput: true,
        locale: this.data.language == "arabic" ? Arabic : null,
        position: "auto center",
      });
    }, 0);
  }

  get_queries(page) {
    return new Promise((resolve) =>
      setTimeout(() => {
        let patient_search = this.patient_search.match(/[0-9]+-[0-9]+-[0-9]+/)
          ? this.patient_search.split("-").reverse().join("-")
          : this.patient_search;

        resolve({
          page: page,
          patient_search,
          patient_search_by: this.type,
          reception_number: this.reception_num,
          min_date: this.from.split("-").reverse().join("-"),
          max_date: this.to.split("-").reverse().join("-"),
          payment_status: this.payment_status,
          correspondent_id: this.correspondent,
        });
      }, 0)
    );
  }
  search() {
    this.getRequests(1);
  }

  // requesrDraw(req_id){
  //   this.api.Requests.drawSample(req_id).subscribe(res => {
  //     if(!res['error']){
  //       this.snack.show(res['message'])
  //     }else{
  //       this.snack.showerror('Please try again');
  //     }
  //   })
  // }
  openRequesrDraw(req_id) {
    this.req_id = req_id;
    $("#DrawSample").modal("show");
  }

  async getRequests(page) {
    this.page = page;
    // let queries = await this.get_queries(page)
    let queries = await this.get_queries(page);
    console.log("queries", queries);
    this.data.queries = queries;
    // this.progress.on();
    this.requests = this.api.Requests.getRequests(queries).pipe(
      tap((res) => {
        this.pagination = res["meta"]["pagination"];
        this.progress.off();
        this.isLoaderHidden = true;
        this.isHashLoaderHidden = true;
      }),
      map((res) => res["data"])
    );
  }

  editRequest(event, request) {
    event.stopPropagation();
    this.router.navigateByUrl(
      `patients/${request["patient_id"]}/requests/${request["id"]}/edit`
    );
  }

  onPatientCreated(patient_id) {
    this.createRequest(patient_id);
  }

  createRequest(patient_id) {
    this.api.Requests.createIntialRequest(patient_id).subscribe((res) => {
      if (res["error"] == false) {
        this.router.navigateByUrl(
          `/patients/${patient_id}/requests/${res["request_id"]}/add`
        );

        $("#modal").toggle("hide");
        $("body").removeClass("modal-open");
        $(".modal-backdrop").remove();
        $(".dropdown-menu").dropdown("hide");
      } else {
        this.snack.showerror("something went wrong");
      }
    });
  }

  openPayment(id, patient_id) {
    this.data.payment_request_id = id;
    this.data.payment_patientId = null;
    this.data.payment_patientId = patient_id;
    console.log(
      "request ID (Request List)=======>",
      this.data.payment_request_id
    );

    $("#payment_modal").modal("toggle");
  }

  openSummary(id, patient_id) {
    this.summery_request_id = id;
    this.summery_patientId = null;
    this.summery_patientId = patient_id;
    $("#summery_modal").modal("toggle");
  }

  setDelivered(req) {
    event.stopPropagation();

    this.api.Requests.setDeliverd(req.id).subscribe((res) => {
      if (!res["error"]) {
        console.log(req);
        req["delivery_flag"] = 1;
        this.snack.show("request has been set to delivered");
      }
    });
  }
}
