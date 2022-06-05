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
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"],
})
export class SearchComponent implements OnInit {
  current_test = null;
  current_parameter = null;

  set_Item(event, filter) {
    let parameters_filter = this.filters.find(
      (one) => one["name"] == "Parameter_select"
    );

    if (filter.name == "tests") {
      if (event) {
        let parameters_flex_filter = this.filters.find(
          (one) => one["name"] == "parameters"
        );
        this.current_test = event;
        filter.value = event["id"];
        this.current_parameter = null;
        parameters_filter.value = "";
        parameters_flex_filter.value = "";
        this.getData(1);
        this.api.get(`tests/${event["id"]}`).subscribe((res) => {
          parameters_filter.options = [
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
        parameters_filter.options = [];
        parameters_filter.value = "";
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

  filters = [
    {
      isLoaderHidden: true,
      value: "",
      type: "text",
      key: "reception_number",
      label: "Request #",
      placeholder: "request #",
    },
    {
      isLoaderHidden: true,
      value: "",
      type: "text",
      key: "patient_name",
      label: "Patient name",
      placeholder: "Patient name",
    },

    {
      isLoaderHidden: true,
      value: "",
      type: "text",
      key: "result",
      label: "Result",
      placeholder: "result",
    },

    {
      isLoaderHidden: true,
      value: "=",
      type: "select",
      key: "result_expression",
      label: "Specify",
      options: [
        { key: ">=", value: ">=" },
        { key: "<=", value: "<=" },
        { key: ">", value: ">" },
        { key: "<", value: "<" },
        { key: "=", value: "=" },
        { key: "!=", value: "!=" },
      ],
    },

    {
      isLoaderHidden: true,
      value: "true",
      type: "select",
      key: "check_result",
      label: "Result state",
      options: [
        { key: "With result", value: true },
        { key: "Without result", value: false },
      ],
    },

    {
      isLoaderHidden: true,
      value: "",
      type: "select",
      key: "correspondent_id",
      label: "Correspondent",
      options: [{ key: "All", value: "" }],
    },
    {
      isLoaderHidden: true,
      value: "",
      type: "select",
      key: "doctor",
      label: "Doctors",
      options: [{ key: "All", value: "" }],
    },
    {
      isLoaderHidden: true,
      value: "",
      type: "select",
      key: "category_id",
      label: "Category",
      options: [{ key: "All", value: "" }],
    },

    {
      isLoaderHidden: true,
      value: "",
      assigned_to: "current_test",
      type: "flex",
      name: "tests",
      key: "test_id",
      label: "Test | Profile",
    },

    {
      isLoaderHidden: true,
      value: "",
      name: "Parameter_select",
      type: "select",
      key: "parameter_id",
      label: "Parameter",
      options: [],
    },

    {
      isLoaderHidden: true,
      value: "",
      assigned_to: "current_parameter",
      type: "flex",
      name: "parameters",
      key: "parameter_id",
      label: "Parameter",
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
      key: "min_date",
      label: "Date From",
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
    },
  ];

  async print() {
    let queries = await this.query();
    console.log("print===>", queries);
    this.api.Printables.Search(queries).subscribe((res) => {
      const fileURL = URL.createObjectURL(res);

      window.open(fileURL, "_blank");
    });
  }
  query() {
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve(
            this.filters
              .filter((one) => one.value)
              .map(
                (one) =>
                  `&${one.key}=${
                    one.type == "date"
                      ? one.value.split("-").reverse().join("-")
                      : one.value
                  }`
              )
              .join("")
          ),
        0
      )
    );
  }
  get_queries() {
    // return new  Promise(resolve => setTimeout(() => resolve(this.filters.filter(one => one.value).map(one => `&${one.key}=${one.type == 'date'?one.value.split('-').reverse().join('-'):one.value}`).join('')), 0));
    let data = {};
    this.filters
      .filter((one) => one.value)
      .forEach((one) => (data[one["key"]] = one["value"]));
    let options = this.filters.find((one) => one["name"] == "Parameter_select")[
      "options"
    ];
    data["parameters_options"] = options;
    data["current_test"] = this.current_test;
    data["current_parameter"] = this.current_parameter;
    data["page"] = this.page;
    return new Promise((resolve) => setTimeout(() => resolve(data), 0));
  }

  key: any = "";
  total_rows: number;
  reception_num: any;
  doctor: any;
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

  navigate(role) {
    window.open(this.base + this.urls[role], "_blank");
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
    this.data.queriesForSearch = await this.get_queries();
    let queries = await this.query();
    this.api.Search.get(page || 1, queries).subscribe((res) => {
      this.requests = res["data"];
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

  ngOnInit() {
    let queries = this.data.queriesForSearch;

    this.page = queries["page"];
    this.filters.find((one) => one["name"] == "Parameter_select").options =
      queries["parameters_options"];
    this.current_test = queries["current_test"];
    this.current_parameter = queries["current_parameter"];

    for (let key in queries) {
      this.filters
        .filter((one) => one["key"] == key)
        .forEach((filter) => {
          if (
            filter["key"] != "parameter_id" ||
            (queries["test_id"] && filter["name"] == "Parameter_select") ||
            (!queries["test_id"] && filter["name"] == "parameters")
          ) {
            filter["value"] = queries[key];
          }
        });
    }

    this.api.Correspondents.getCorrespondents().subscribe((res) => {
      this.filters
        .find((one) => one["key"] == "correspondent_id")
        .options.push(
          ...res["data"].map((one) => ({ key: one["name"], value: one["id"] }))
        );
    });
    this.api.Doctors.getDoctors().subscribe((res) => {
      // console.log(res);

      this.filters
        .find((one) => one["key"] == "doctor")
        .options.push(
          ...res["data"].map((one) => ({ key: one["name"], value: one["id"] }))
        );
    });

    this.api.get("categories").subscribe((res) => {
      this.filters
        .find((one) => one["key"] == "category_id")
        .options.push(
          ...res["data"].map((one) => ({ key: one["name"], value: one["id"] }))
        );
    });

    this.data.isDiscount = false;
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
        this.snack.show("The request has been set to delivered");
      }
    });
  }
}
