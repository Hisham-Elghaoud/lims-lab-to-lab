import { Component, OnInit, Input, AfterViewInit } from "@angular/core";
import { ApiService } from "src/app/services/api.service";
import { map, tap, debounceTime } from "rxjs/operators";
import { Router, ActivatedRoute } from "@angular/router";
import { DataService } from "src/app/services/data.service";
import { SnackService } from "src/app/services/snack.service";
import { ProgressService } from "src/app/services/progress.service";
import { Arabic } from "flatpickr/dist/l10n/ar";

declare let $;

@Component({
  selector: "app-draw-sample",
  templateUrl: "./draw-sample.component.html",
  styleUrls: ["./draw-sample.component.scss"],
})
export class DrawSampleComponent implements OnInit {
  constructor(
    public api: ApiService,
    public router: Router,
    public data: DataService,
    public snack: SnackService,
    public progress: ProgressService,
    public route: ActivatedRoute
  ) {}

  @Input() req_id: number;
  @Input() setSelectedItem: any;
  doctors: any = [];
  dateTime: any;
  doctor: any;

  ngOnInit() {
    this.getDoctors();
  }

  getDoctors() {
    this.api.Doctors.getDoctors().subscribe((res) => {
      this.doctors = res["data"];
    });
  }

  onSubmit(form) {
    let query;
    if (form.valid && form.value.doctor_id) {
      let splitted = form.value.draw_time.split(" ");
      let draw_time =
        splitted[0].split("-").reverse().join("-") + "T" + splitted[1];
      query = {
        drawed_by: form.value.doctor_id,
        draw_time,
      };

      this.api.Requests.drawSample(this.req_id, query).subscribe((res) => {
        if (!res["error"]) {
          this.snack.show(res["message"]);
          $("#DrawSample").modal("hide");
          this.data.reload.next();
        } else {
          this.snack.showerror("Please try again");
        }
      });
    } else {
      this.snack.showerror("Please Enter All Data");
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      $("#draw_time").flatpickr({
        dateFormat: "d-m-Y h:i",
        allowInput: true,
        enableTime: true,
        locale: this.data.language == "arabic" ? Arabic : null,
        position: "auto center",
      });
    }, 0);
  }
}
