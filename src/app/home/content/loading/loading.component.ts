import { Component, OnInit, Input } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { ProgressService } from 'src/app/services/progress.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {

  @Input() type :any;


  constructor(public progress : ProgressService, public data:DataService) { }

  ngOnInit() {


  }

}
