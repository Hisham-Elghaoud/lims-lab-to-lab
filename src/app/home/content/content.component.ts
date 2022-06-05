import { Component, OnInit } from "@angular/core";
import { ApiService } from "src/app/services/api.service";
import { DataService } from "src/app/services/data.service";
import { Router } from "@angular/router";
import { ProgressService } from "src/app/services/progress.service";
declare var $: any;

@Component({
  selector: "app-content",
  templateUrl: "./content.component.html",
  styleUrls: ["./content.component.scss"],
})
export class ContentComponent implements OnInit {



  user_roles: any = [];
  current_role: string = "receptionist";
  roles: Array<any> = [];

  urls = {
    admin: "admin",
    receptionist: "res",
    technician: "tec",
    accountant: "fms",
  };
  base: string = this.api.ng_url;


  constructor(
    public api: ApiService,
    public data: DataService,
    public router: Router,
    public progress: ProgressService
  ) {}


  navigate(role) {
    window.open(this.base + this.urls[role], "_blank");
  }

  ngOnInit() {
    this.api.common.get_me().subscribe((res) => {
      this.roles = res["data"].roles;
      let roles = res["data"].roles;
      if (!roles.length) {
        sessionStorage.removeItem("UserToken");
        this.router.navigateByUrl("login");
      } else {
        if (!roles.filter((role) => role.name == "receptionist")[0]) {
          location.href = this.base + this.urls[roles[0].name];
        }else{
          this.data.me = res['data']
        }
      }
    });

    this.api.common.getPermissions().subscribe((res) => {
      var len = Object.keys(res).length;
      for (let index = 1; index <= len; index++) {
        this.user_roles.push(res[index]);
      }
    });


  }
}
