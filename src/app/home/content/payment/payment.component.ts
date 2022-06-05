import { Component, Input, OnInit } from "@angular/core";
import { ApiService } from "src/app/services/api.service";
import { catchError, map, tap } from "rxjs/operators";
import { ActivatedRoute, Router } from "@angular/router";
import { SnackService } from "src/app/services/snack.service";
import { DataService } from "src/app/services/data.service";
import { Observable, of } from "rxjs";
import { Arabic } from "flatpickr/dist/l10n/ar";

declare var $: any;

@Component({
  selector: "app-payment",
  templateUrl: "./payment.component.html",
  styleUrls: ["./payment.component.scss"],
})
export class PaymentComponent implements OnInit {
  discountType: any = "p";
  template: Boolean = false;
  payment_method_id: any;
  cashier_id: any;
  value: any;
  percent: any;
  Amount: any;
  payer: any;
  paymentMethods: Observable<any> = of([]);
  cashiers: any;
  payments: any = [];
  @Input() patientId: any;
  @Input() request_id: any;
  isTax: boolean;
  keys: Array<{ label: string; value: string; direct?: boolean }> = [
    { label: "Total", value: "total", direct: true },
    { label: "Discount", value: "discount", direct: true },
    { label: "Total charged", value: "total_summery", direct: true },
    { label: "Paid", value: "paid" },
    { label: "Remaining", value: "remaining" },
  ];

  keys2: Array<{ label: string; value: string; direct?: boolean }> = [
    { label: "Total", value: "total", direct: true },
    { label: "Discount", value: "discount", direct: true },
    { label: "Tax Avg", value: "tax_avg", direct: true },
    { label: "Total charged", value: "total_summery", direct: true },
    { label: "Paid", value: "paid" },
    { label: "Remaining", value: "remaining" },
  ];

  // user:any=[];
  user_role: any;
  user_id: any;
  price: any = {};
  request: any = {};
  transaction = "patient";

  constructor(
    public api: ApiService,
    private route: ActivatedRoute,
    public snack: SnackService,
    public router: Router,
    public data: DataService
  ) {}

  checkTax() {
    this.api.settings.checkTax().subscribe((res) => {
      console.log("checkTax", res);
      this.isTax = res["isTax"];
    });
  }

  ngOnChanges(changes) {
    this.price = {};
    this.request = null;
    this.payments = null;

    this.checkTax();
    if (this.request_id) {
      this.getCashiers();

      this.getTotal();
      this.getRequest();
      this.getRequestPayments();
      this.getPaymentMethods();
    }
  }

  ngOnInit() {
    // console.log('(ngOnInit)=========>ngOnInit')
    this.user_role = sessionStorage.getItem("userRole");
    this.user_id = sessionStorage.getItem("userId");
    this.checkTax();
    if (this.request_id) {
      this.getCashiers();

      this.getTotal();
      this.getRequest();
      this.getRequestPayments();
      this.getPaymentMethods();
    }
  }

  checkUser(user) {
    console.log(this.user_id, user.id, this.user_role);

    return this.user_id == user.id || this.user_role == 2;
  }

  getToday() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();

    return dd + "-" + mm + "-" + yyyy;
  }

  getPaymentMethods() {
    this.paymentMethods = this.api.payments.getPaymentMethods().pipe(
      map((res) => res["data"]),
      tap((res) => {
        this.payment_method_id = res[0].id;
      })
    );
    this.paymentMethods.subscribe((one) => console.log(one));
  }

  getCashiers() {
    this.cashiers = this.api.Cashiers.getCashiers().pipe(
      map((res) => res["data"]),
      tap((res) => {
        this.cashier_id = res[0].id;
      })
    );
    this.cashiers.subscribe((one) => console.log(one));
  }

  getRequest() {
    // console.log("invoked")
    this.api.Requests.getRequest(this.request_id).subscribe((res) => {
      if (res["isClinic"]) this.router.navigateByUrl("");
      else {
        this.request = res;
        this.template = true;

        let date = $("#payment_picker")[0];
        // console.log(date)
        if (date) {
          date.flatpickr({
            dateFormat: "d-m-Y",
            allowInput: true,
            locale: this.data.language == "arabic" ? Arabic : null,
            position: "auto center",
            defaultDate: this.getToday(),
          });
        }
      }
    });
  }

  ngAfterViewInit() {
    let date = $("#payment_picker")[0];
    if (date) {
      date.flatpickr({
        dateFormat: "d-m-Y",
        allowInput: true,
        locale: this.data.language == "arabic" ? Arabic : null,
        position: "auto center",
        defaultDate: this.getToday(),
      });
    }
  }

  onSubmit(form) {
    if (form.valid) {
      let remaining =
        this.transaction == "patient"
          ? this.price.patient_remaining
          : this.price.correspondent_remaining;
      if (form.value.amount > remaining) {
        this.snack.showerror("Please enter amount less than " + remaining);
        return null;
      }
      if (this.request_id != null) {
        if ($("#payment_picker")[0].value != "")
          form.value.payment_date = $("#payment_picker")[0]
            .value.split("-")
            .reverse()
            .join("-");
        else {
          this.snack.showerror("Please enter the payment date");
          return null;
        }

        // form.value.request_id = this.request_id;
        this.api.payments
          .makePayment(this.request_id, form.value)
          .subscribe((res) => {
            // console.log(res);
            if (res["error"] == false) {
              this.snack.show("The payment was successfully made");
              this.getRequestPayments();
              this.getTotal();
              this.Amount = "";
              this.payer = "";
              form.submitted = false;
            } else {
              this.snack.showerror("Something went wrong ");
            }
          });
      }
    } else {
      this.snack.showerror('Please enter all data correctly and try again');
    }
  }

  // getRequest(){
  //   this.api.Requests.getRequest(this.request_id).subscribe(res =>{

  //   })
  // }

  getTotal() {
    this.api.Requests.getTotal(this.request_id).subscribe((res) => {
      // console.log(res);
      this.price = res;
    });
  }

  removeTransaction(payment) {
    this.api.payments
      .removePayment(this.request_id, payment)
      .pipe(
        catchError((err) => {
          this.snack.showerror(err["error"]["message"]);
          return err;
        })
      )
      .subscribe((res) => {
        this.getRequestPayments();
        this.getTotal();
      });
  }

  getRequestPayments() {
    this.api.payments.getPayments(this.request_id).subscribe((res) => {
      // console.log(res);
      this.payments = res["data"];
    });
  }

  setDiscount(form) {
    // console.log(form.value);
    if (form.valid) {
      switch (form.value["options"]) {
        case "p": {
          form.value["type"] = "percentage";
          form.value["amount"] = form.value["percent"];
          break;
        }
        case "v": {
          form.value["type"] = "fixed";
          form.value["amount"] = form.value["value"];
          break;
        }
      }

      this.api.payments
        .setDiscount(this.request_id, form.value)
        .subscribe((res) => {
          if (res["error"] == false) {
            this.snack.show("The discount was successfully added");
            this.data.discountMade.next(form.value);
            this.getTotal();
            this.getRequest();
          }
        });
    } else {
      this.snack.showerror("Please enter all data correctly and try again");
    }
  }

  toggle(value) {
    this.discountType = value;
    // console.log(this.discountType);
  }

  showSummary() {
    this.router.navigateByUrl(
      `/patients/${this.patientId}/requests/${this.request_id}/summary`
    );
  }
}
