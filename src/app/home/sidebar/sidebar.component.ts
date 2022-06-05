import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { ApiService } from "src/app/services/api.service";
import { DataService } from "src/app/services/data.service";
import { SnackService } from "src/app/services/snack.service";
declare var $: any;

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit {
  constructor(
    private router: Router,
    public data: DataService,
    private api: ApiService,
    private snack: SnackService
  ) {}

  // $rev:Observable<any>;
  routes: Array<{
    link: string;
    label: string;
    icon: string;
    authorized: string;
  }>;
  username: any = sessionStorage.getItem("userName");
  show_pass: boolean = false;
  show_pass2: boolean = false;
  show_pass3: boolean = false;

  langs: Array<{ name: string; isRTL: boolean }> = ((_) => {
    let langs = [{ name: "english", isRTL: false }];
    langs[this.data.language == "arabic" ? "unshift" : "push"]({
      name: "arabic",
      isRTL: true,
    });
    return langs;
  })();
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
  rolesNavHide = true;

  l = (() =>
    this.langs.find((one) => one.name == this.data.language) ||
    this.langs[0])();

  barRolesShow() {
    this.rolesNavHide = false;
  }

  barRolesHide() {
    this.rolesNavHide = true;
  }

  navigate(role) {
    window.open(this.base + this.urls[role], "_blank");
  }
  ngOnInit() {
    this.api.common.get_me().subscribe((res) => {
      this.roles = res["data"].roles;
    });

    this.api.common.getPermissions().subscribe((res) => {
      var len = Object.keys(res).length;
      for (let index = 1; index <= len; index++) {
        this.user_roles.push(res[index]);
      }
    });

    this.data.sidebarStatus = true;
    this.routes = [
      { link: "", label: "Home", icon: "fas fa-home", authorized: "home" },
      {
        link: "search",
        label: "Search",
        icon: "fas fa-search",
        authorized: "search",
      },
      {
        link: "patients",
        label: "Patients",
        icon: "fas fa-users",
        authorized: "patients",
      },
      {
        link: "doctors",
        label: "Doctors",
        icon: "fas fa-stethoscope",
        authorized: "doctors",
      },
      {
        link: "activity",
        label: "Activity log",
        icon: "fas fa-clipboard-list",
        authorized: "activityLog",
      },
      {
        link: "tests",
        label: "Tests | Profiles",
        icon: "fas fa-vial",
        authorized: "tests",
      },
      {
        link: "correspondents",
        label: "correspondents",
        icon: "fas fa-city",
        authorized: "correspondents",
      },
      {
        link: "/receptionist",
        label: "Receptionist",
        icon: "fas fa-user",
        authorized: "receptionist",
      },
      {
        link: "/reports",
        label: "Reports",
        icon: "fas fa-scroll",
        authorized: "reports",
      },
    ];
  }

  paymentMethodIndex = "";

  logout() {
    sessionStorage.removeItem("UserToken");
    sessionStorage.removeItem("userName");
    sessionStorage.removeItem("userRole");
    sessionStorage.removeItem("userId");
    location.href = location.origin + "/home";
  }

  change_language({ language }) {
    localStorage.setItem("language", language["name"]);
    language.isRTL
      ? localStorage.setItem("isRTL", "true")
      : localStorage.removeItem("isRTL");
    this.data.language = language["name"];
    this.data.isRTL = language["isRTL"];
    this.data.reload.next();
    $("#language").modal("hide");
  }

  goto(url) {
    if ($(window).width() < 768) $("#sidebar, #content").toggleClass("active");

    // this.router.navigateByUrl(url);
  }

  openModal(str) {
    // if(str == 'rev'){
    //   this.$rev = this.api.common.getRev().pipe(map(one => one['data']), tap(one =>{
    //     console.log(one)
    //   }
    //   ))
    // }

    $(`#${str}-modal`).modal("show");
  }

  change_cre(form: NgForm) {
    this.api.common.update_credentials(form.value).subscribe((data) => {
      if (!data["error"]) {
        $("#cre-modal").modal("hide");
        this.snack.show(data["message"]);
      } else {
        if (data["errors"]) {
          this.snack.showerror(data["errors"]["password"][0]);
        } else {
          this.snack.showerror(data["message"]);
        }
      }
    });
  }

  isLoggedIn() {
    if (sessionStorage.getItem("UserToken") != null) {
      return true;
    } else {
      return false;
    }
  }
}
