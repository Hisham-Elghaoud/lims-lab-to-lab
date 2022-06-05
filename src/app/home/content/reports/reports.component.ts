import { Component, OnInit } from "@angular/core";
import { ApiService } from "src/app/services/api.service";
import { map, tap, debounceTime } from "rxjs/operators";
import { Router, ActivatedRoute } from "@angular/router";
import { DataService } from "src/app/services/data.service";
import { SnackService } from "src/app/services/snack.service";
import { ProgressService } from "src/app/services/progress.service";
import { debounce } from "lodash";
import { Arabic } from "flatpickr/dist/l10n/ar";

declare var $: any;

@Component({
  selector: "app-reports",
  templateUrl: "./reports.component.html",
  styleUrls: ["./reports.component.scss"],
})
export class ReportsComponent implements OnInit {
  current_test = null;
  isExcel = false;
  selectedTest = null;
  isSeparate = false;
  requestsId = [];
  selectAll = false;
  number_of_requests: Number = 0;
  current_parameter = null;
  payments: {
    discount: number;
    paid: number;
    remaining: number;
    total: number;
  } = {
    discount: 0,
    paid: 0,
    remaining: 0,
    total: 0,
  };
  globals_keys: Array<string> = ["total", "paid", "remaining"];
  key: any = "";
  reception_num: any;
  requests: any;
  pagination: any = {};
  page: number = 1;
  isLoaderHidden = true;
  isHashLoaderHidden = true;
  payment_request_id: number;
  payment_patientId: number;
  summery_request_id: number;
  summery_patientId: number;
  current_role: string = "receptionist";
  base: string = "http://161.35.149.58/";
  urls = {
    admin: "admin",
    receptionist: "res",
    technician: "tec",
  };

  filters = [
    {
      isLoaderHidden: true,
      value: "",
      type: "text",
      key: "patient_name",
      label: "Patient",
      placeholder:
        "Search by patient name or hospital id or phone or birthdate or barcode or national id",
      col: "col-12",
    },
    {
      isLoaderHidden: true,
      value: "",
      type: "text",
      key: "reception_number",
      label: "Request #",
      placeholder: "Request #",
      col: "col-4",
    },
    {
      isLoaderHidden: true,
      value: "",
      type: "text",
      key: "insurance_id",
      label: "Correspondent ID",
      placeholder: "Correspondent ID",
      col: "col-4",
    },

    // {
    //   isLoaderHidden: true,
    //   value: '',
    //   type: 'text',
    //   key: 'result',
    //   label: 'Result',
    //   placeholder: 'Search by result',
    // },

    // {
    //   isLoaderHidden: true,
    //   value: '=',
    //   type: 'select',
    //   key: 'result_expression',
    //   label: 'Result expression',
    //   options: [
    //     { key: '>=', value: '>=' },
    //     { key: '<=', value: '<=' },
    //     { key: '>', value: '>' },
    //     { key: '<', value: '<' },
    //     { key: '=', value: '=' },
    //     { key: '!=', value: '!=' },
    //   ],
    // },
    {
      isLoaderHidden: true,
      value: null,
      type: "select",
      key: "correspondent_id",
      label: "Correspondent",
      col: "col-4",
      options: [
        { key: "All", value: null },
        { key: "None", value: "" },
      ],
    },
    {
      isLoaderHidden: true,
      value: null,
      type: "select",
      key: "is_paid",
      label: "Payment Status",
      col: "col-4",
      options: [
        { key: "all", value: null },
        { key: "paid", value: 1 },
        { key: "unpaid", value: 0 },
      ],
    },

    // {
    //   isLoaderHidden: true,
    //   value: '',
    //   assigned_to:'current_test',
    //   type: 'flex',
    //   name:'tests',
    //   key: 'test_id',
    //   label: 'Test',
    // },

    // {
    //   isLoaderHidden: true,
    //   value: '',
    //   name:'Parameter_select',
    //   type: 'select',
    //   key: 'parameter_id',
    //   label: 'Parameter',
    //   options: [],
    // },

    // {
    //   isLoaderHidden: true,
    //   value: '',
    //   assigned_to: 'current_parameter',
    //   type: 'flex',
    //   name:'parameters',
    //   key: 'parameter_id',
    //   label: 'Parameter',
    // },

    {
      isLoaderHidden: true,
      type: "date",
      value: new Date()
        .toISOString()
        .slice(0, 10)
        .split("-")
        .reverse()
        .join("-"),
      key: "min_date",
      label: "Date From",
      col: "col-4",
    },
    {
      isLoaderHidden: true,
      type: "date",
      value: new Date()
        .toISOString()
        .slice(0, 10)
        .split("-")
        .reverse()
        .join("-"),
      key: "max_date",
      label: "Date To",
      col: "col-4",
    },
    {
      isLoaderHidden: true,
      type: "time",
      value: "00:00",
      key: "min_time",
      label: "Time From",
      col: "col-4",
    },
    {
      isLoaderHidden: true,
      type: "time",
      value: "23:59",
      key: "max_time",
      label: "Time To",
      col: "col-4",
    },
    {
      isLoaderHidden: true,
      value: "",
      type: "select",
      col: "col-4",
      key: "category_id",
      label: "Category",
      options: [{ key: "All", value: "" }],
    },
    {
      isLoaderHidden: true,
      value: null,
      type: "select",
      key: "doctor",
      label: "Doctor",
      col: "col-4",
      options: [
        { key: "All", value: null },
        { key: "None", value: "" },
      ],
    },
  ];
  isTax = false;

  checkTax() {
    this.api.settings.checkTax().subscribe((res) => {
      console.log("checkTax", res);
      this.isTax = res["isTax"];
    });
  }

  set_Item(event, filter) {
    if (filter.name == "tests") {
      if (event) {
        this.current_test = event;
        filter.value = event["id"];
        this.current_parameter = null;
        this.filters[8].value = "";
        this.getData(1);
        this.api.get(`tests/${event["id"]}`).subscribe((res) => {
          this.filters[7].options = [
            { key: "All", value: "" },
            ...res["parameters"]["data"].map((one) => ({
              key: one["name"],
              value: one["id"],
            })),
          ];
        });
      } else {
        this.current_test = null;
        filter.value = "";
        this.filters[7].options = [];
        this.filters[7].value = "";
        this.getData(1);
      }
    } else {
      if (event) {
        this.current_parameter = event;
        filter.value = event["id"];
        this.getData(1);
      } else {
        this.current_parameter = null;
        filter.value = "";
        this.getData(1);
      }
    }
  }

  get_queries() {
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve(
            this.filters
              .filter((one) => one.value || one.value == "")
              .map(
                (one) =>
                  `&${one.key}=${
                    one.type == "date"
                      ? one.value.split("-").reverse().join("-")
                      : one.value
                  }`
              )
              .join("") +
              (this.selectedTest ? "&test_id=" + this.selectedTest.id : "")
          ),
        0
      )
    );
  }

  navigate(role) {
    window.open(this.base + this.urls[role], "_blank");
  }

  setSelectedTest(test) {
    this.selectedTest = test;
    this.getData();
  }

  constructor(
    public api: ApiService,
    public router: Router,
    public data: DataService,
    public snack: SnackService,
    public progress: ProgressService
  ) {
    this.getData = debounce(this.getData, 500);
  }

  async getData(page = this.page) {
    this.page = page;
    let queries = await this.get_queries();
    // $('.dropdown-menu').dropdown('show');
    this.api.Requests.filters(page || 1, queries).subscribe((res) => {
      this.requests = res["data"];
      this.pagination = res["meta"]
        ? res["meta"]
        : {
            per_page: res["per_page"] || 10000,
            current_page: res["current_page"] || 1,
            totalItems: res["last_page"] * res["per_page"] || 100,
          };
      this.payments = res["payments"];
      this.number_of_requests = res["total"];
      console.log(this.pagination);
    });
  }

  ngOnInit() {
    this.checkTax();
    this.api.Correspondents.getCorrespondents().subscribe((res) => {
      let obj = this.filters.find((one) => one.key == "correspondent_id");
      obj.options = [
        ...obj.options,
        ...res["data"].map((one) => ({ key: one["name"], value: one["id"] })),
      ];
    });
    this.api.Doctors.getDoctors().subscribe((res) => {
      let obj = this.filters.find((one) => one.key == "doctor");
      obj.options = [
        ...obj.options,
        ...res["data"].map((one) => ({ key: one["name"], value: one["id"] })),
      ];
    });

    this.api.get("categories").subscribe((res) => {
      let obj = this.filters.find((one) => one.key == "category_id");

      obj.options = [
        ...obj.options,
        ...res["data"].map((one) => ({ key: one["name"], value: one["id"] })),
      ];
    });
    this.getData(1);
  }

  ngAfterViewInit() {
    this.filters.forEach((one) => {
      if (one.type == "date") {
        let date = $("#" + one["key"]);
        if (date) {
          date.flatpickr({
            dateFormat: "d-m-Y",
            locale: this.data.language == "arabic" ? Arabic : null,
            position: "auto center",
          });
        }
      }
    });
  }
  editRequest(event, request) {
    event.stopPropagation();
    this.router.navigateByUrl(
      `patients/${request["patient_id"]}/requests/${request["request_id"]}/edit`
    );
  }
  async print() {
    let queries = await this.get_queries();

    if (this.requestsId.length) {
      for (let id of this.requestsId) {
        queries = queries + "&ids[]=" + id;
      }
    }

    if (this.isExcel) {
      queries = queries + "&isExcel=" + this.isExcel;
    }
    console.log(queries);
    this.api.Report.PrintRequest(queries).subscribe((res) => {
      console.log(res);

      const fileURL = URL.createObjectURL(res);

      window.open(fileURL, "_blank");
    });
  }
  async printInvoice() {
    let queries = "?";

    if (this.requestsId.length == 0) {
      for (let request of this.requests) {
        queries = queries + "&ids[]=" + request.request_id;
      }
    } else {
      for (let id of this.requestsId) {
        queries = queries + "&ids[]=" + id;
      }
    }

    if (this.isSeparate) {
      queries = queries + "&isSeparate=" + this.isSeparate;
    }

    if (queries != "?") {
      this.api.Report.PrintInvoicies(queries).subscribe((res) => {
        const fileURL = URL.createObjectURL(res);
        window.open(fileURL, "_blank");
      });
    } else {
      this.snack.showerror("No requests for print it");
    }
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
  addIdRequestForPrintInvoice(requestId) {
    if (this.checkIdRequestIsFound(requestId)) {
      this.removeIdRequestId(requestId);
    } else {
      this.requestsId.push(requestId);
    }

    console.log(this.requestsId, requestId);
  }
  checkIdRequestIsFound(id) {
    let isfound = false;
    this.requestsId.forEach((value, index) => {
      if (value == id) isfound = true;
    });
    return isfound;
  }
  removeIdRequestId(id) {
    this.requestsId.forEach((value, index) => {
      if (value == id) this.requestsId.splice(index, 1);
    });
  }
}
