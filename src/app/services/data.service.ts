import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ApiService } from './api.service';
import { ProgressService } from './progress.service';
import { Router } from '@angular/router';



@Injectable({
  providedIn: 'root'
})
export class DataService {

  private TitleSubject$ = new BehaviorSubject<any>('');

  //-----------------------------------------------------------------------------------------

  private SerachKeySubject = new BehaviorSubject<String>(null);
  private SerachKey$ = this.SerachKeySubject.asObservable();

  public  sidebarStatus = true

  payment_request_id;
  payment_patientId;
  isDiscount;
  discountMade:Subject<any> = new Subject();



  constructor(public api : ApiService,public progress : ProgressService, private router:Router) { }


  //-----------------------------------------------------------------------------------------
  queriesForSearch={};
  activity_log_request_id_stored:string = "";
  navigate_to = (url,options = {abs: false}) =>{
    let parent = options.abs? '' : location.pathname + '/'
    this.router.navigateByUrl(parent +  url)
  }

  prevent_viewing:boolean = false;
  info = {};

  reload:Subject<any> = new Subject()
  bilingual:boolean = true;

  language:string = !this.bilingual? 'english' : localStorage.getItem('language') || 'english'
  isRTL:boolean = this.bilingual && !!localStorage.getItem('isRTL')

  queries={};
  userName:any = "";
  user:any=[]
  me:any ={}
  logout_intreval;

  setTitle(title : any){
    this.TitleSubject$.next(title)
  }

  getTitle(){
    return this.TitleSubject$.asObservable();
  }


  getSearchKey$(){
    return this.SerachKey$
  }

  setSearchKey(key){
    this.SerachKeySubject.next(key)
  }







}
