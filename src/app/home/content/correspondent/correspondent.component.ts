import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, tap } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { ProgressService } from 'src/app/services/progress.service';

@Component({
  selector: 'app-correspondent',
  templateUrl: './correspondent.component.html',
  styleUrls: ['./correspondent.component.scss']
})
export class CorrespondentComponent implements OnInit {

  correspondent:any;

  constructor(public api : ApiService,public progress : ProgressService, private activatedRoute:ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(param => {
      this.progress.on();
      console.log('reached')
      this.api.Correspondents.getCorrespondent(param.id).subscribe(res => {
        this.progress.off();
        this.correspondent = res['data']
        console.log(res)
      })

    })
  }

}
