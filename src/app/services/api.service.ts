import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {HttpHeaders} from '@angular/common/http';
import { debug } from 'util';
import { DataService } from './data.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
declare var b64toBlob:any;


@Injectable()
export class ApiService {

  Auth:any;

  constructor(private http:HttpClient) {}
  printZebraURL='http://127.0.0.1:3000'
  urls = [
    "http://127.0.0.1:4001/",
    "http://165.22.27.138/ltl/"
  ]

 base = environment.baseURL + '/';
 ng_url = environment.ng_url;
 baseMock = this.urls[0];
  base_print_report = environment.baseURL + '/reports';

 get(route, query = "", options = {baseURL:false}) {
  return this.http.get((options.baseURL? environment.baseURL + '/' : this.base) + route + query, {headers : this.getTokenHeader() });
}
  public image_base = 'http://127.0.0.1:4001/storage/images/';

  getTokenHeader(action=true){
    if(action) localStorage.setItem('last_action' , (new Date()).getTime() + "")
    return new HttpHeaders().set('Authorization',  sessionStorage.getItem('UserToken'));
  }

  settings = {

    checkTax: ()=> this.http.get(this.base + 'check-tax', {
      headers: this.getTokenHeader(),
    }),
  }

  common = {

    get_me: ()=>{
      return this.http.get( this.base + 'user', {headers : this.getTokenHeader() })
    },

    login : (loginBody) => {

      return this.http.post(this.base + 'login',loginBody);

    },

    logout : () => {

      return this.http.post(this.base + 'logout',null);
    },

    getStat : () => {
      return this.http.get(this.base +`statistics`, {headers : this.getTokenHeader() });
    },
    getRev : () => {
      return this.http.get(this.base +`statistics/today-revenue`, {headers : this.getTokenHeader() });
    },
    update_credentials: (json)=>{
      return this.http.put(this.base + 'update-account' , json, {headers : this.getTokenHeader() })
    },
    getInfo : () => {
      return this.http.get(this.base + 'lab', {headers : this.getTokenHeader() });
    },
        
    getPermissions: () => {
      return this.http.get(this.base + `get-permissions`, {
        headers: this.getTokenHeader(),
      });
    },


  };



  Requests = {

    createIntialRequest : (data)=>{

      return this.http.post(this.base +`requests`,data, {headers : this.getTokenHeader() });
      // return this.http.post(this.baseMock +`requests/initial`,{patient_id : id}, {headers : this.getTokenHeader() });

    },
    
    drawSample : (id,query)=>{

      return this.http.put(this.base+`requests/${id}/draw`,query, {headers : this.getTokenHeader() });

    },

    lab_info : (id, data)=>{

      return this.http.put(`${this.base}requests/${id}/laboratory-information`,data, {headers : this.getTokenHeader() });
      // return this.http.post(this.baseMock +`requests/initial`,{patient_id : id}, {headers : this.getTokenHeader() });

    },

    filters:(page, query)=>{
      return this.http.get(this.base +`filters/requests?page=` + page + query, {headers : this.getTokenHeader() });
    },
    // createIntialRequest : (id)=>{

    //   return this.http.post(this.base +`requests/initial`,{patient_id : id}, {headers : this.getTokenHeader() });
    //   // return this.http.post(this.baseMock +`requests/initial`,{patient_id : id}, {headers : this.getTokenHeader() });

    // },



    setRequestInfo : (id,data)=>{

      return this.http.post(this.base +`requests`,data, {headers : this.getTokenHeader() });
      // return this.http.post(this.baseMock +`requests/initial`,{patient_id : id}, {headers : this.getTokenHeader() });

    },

    editRequestInfo : (id,data)=>{

      return this.http.put(this.base +`requests/${id}`,data, {headers : this.getTokenHeader() });
      // return this.http.post(this.baseMock +`requests/initial`,{patient_id : id}, {headers : this.getTokenHeader() });

    },

    // editRequestInfo : (id,data)=>{

    //   return this.http.put(this.base +`requests/${id}`,data, {headers : this.getTokenHeader() });
    //   // return this.http.post(this.baseMock +`requests/initial`,{patient_id : id}, {headers : this.getTokenHeader() });

    // },

    setDeliverd : (id)=>{

      return this.http.put(this.base +`requests/${id}/change-delivery`,null, {headers : this.getTokenHeader() });

    },

    getRequests : (params)=>{
      if(!params['min_date']) delete params['min_date']
      if(!params['max_date']) delete params['max_date']
      // let params = {page, patient_name,reception_number }
      // if(reception_number) params['reception_number'] = reception_number
      return this.http.get(this.base +`requests`, {headers : this.getTokenHeader(false) , params});

    },
    getRequest : (id)=>{

      return this.http.get(this.base +`requests/${id}`, {headers : this.getTokenHeader() });

    },

    getCategories : (id)=>{

      return this.http.get(this.base +`requests/${id}/categories`, {headers : this.getTokenHeader() });

    },

    setRequestPricing : (request_id,pricing_id)=>{

      return this.http.post(this.base + `requests/${request_id}/pricing/${pricing_id}`,null, {headers : this.getTokenHeader() });

    },

    getTotal : (id) => {
      return this.http.get(this.base +`requests/${id}/total`, {headers : this.getTokenHeader() });

    }


  };
  Clinics = {

    getclinic : (isActive)=>{

      return this.http.get(this.base +`clinics?isActive=${isActive}`, {headers : this.getTokenHeader() });

    },


  };

  activity = {
    get: (code)=> this.http.get(this.base + 'activity_report?code=' + code, { headers: this.getTokenHeader() }),
    print: (query) => {
      return this.http.get(this.base + `reports/activity-log` + query, {headers : this.getTokenHeader(),  responseType: 'blob' });

    }
  };


  Patients = {


    getAllPatients: () => {
      return this.http.get(this.base +`all-patients`, {headers : this.getTokenHeader() });
    },

    getPatients : (key,paginate?,page?)=>{


      let query =  Number(key)? '?reception_number=' + key : '?name=' + key

      if(paginate){

        return this.http.get(this.base +`patients` + query, {headers : this.getTokenHeader() ,params :{
          page : page , paginated : paginate
        }});

      }

      else {

        return this.http.get(this.base +`patients` + query, {headers : this.getTokenHeader() });

      }


    },

    getPatient : (id)=>{

      return this.http.get(this.base +`patients/${id}`, {headers : this.getTokenHeader() });

    },

    createPatient : (patient)=>{

      return this.http.post(this.base + 'patients',patient, {headers : this.getTokenHeader() });

    },

    editPatient : (id , patient)=>{

      return this.http.put(this.base + `patients/${id}`,patient, {headers : this.getTokenHeader() });

    },

    print_card : (id )=>{

      return this.http.get(this.base + `patients/${id}/printables/patient-card`, {headers : this.getTokenHeader(),  responseType: 'blob' });

    },



    getTest : (key)=>{

      return this.http.get(`https://restcountries.eu/rest/v2/name/${key}`);

    }

  };

  Correspondents = {

    getCorrespondents : ()=>{

      return this.http.get(this.base +`correspondent`, {headers : this.getTokenHeader() });

    },

    createCorrespondent : (correspondent)=>{

      return this.http.post(this.base + 'correspondent',correspondent, {headers : this.getTokenHeader() });

    },

    editCorrespondent : (id,correspondent,)=>{

      return this.http.put(this.base + `correspondent/${id}`,correspondent, {headers : this.getTokenHeader() });

    },

    getCorrespondent : (id)=>{

      return this.http.get(this.base +`correspondent/${id}`, {headers : this.getTokenHeader() });

    },



  };

  Pricing = {

    getPricing : ()=>{

      return this.http.get(this.base +`pricing`, {headers : this.getTokenHeader() });

    },


  };



  Profiles = {

    getProfiles : (key,requestId?)=>{


      var params

      requestId ?
      params = {"request_id" : requestId} :
      params = {}
      params.code = key

      return this.http.get(this.base +`profiles`, {headers : this.getTokenHeader(), params });



    },

    getProfile : (id)=>{

      return this.http.get(this.base +`profiles/${id}`, {headers : this.getTokenHeader() });

    },

    addProfileToRequest : (request_id,profile_id)=>{

      return this.http.put(this.base + `requests/${request_id}/profiles/add`,profile_id, {headers : this.getTokenHeader() });

    },

    removeProfileFromRequest : (request_id,profile_id)=>{

      return this.http.put(this.base + `requests/${request_id}/profiles/${profile_id}/remove`,null, {headers : this.getTokenHeader() });

    },

    getRequestProfiles : (request_id)=>{

      return this.http.get(this.base + `requests/${request_id}/profiles`, {headers : this.getTokenHeader() });

    }




  };

  genders = {

    getGenders : ()=> {

      return this.http.get(this.base + `genders`, {headers : this.getTokenHeader()});

    }

  }

  payments = {

    makePayment : (id,payment)=>{

      return this.http.post(this.base + `requests/${id}/payments`,payment,{headers : this.getTokenHeader()});

    },

    removePayment : (id,payment)=>{

      return this.http.delete(this.base + `payments/${payment.id}`,{headers : this.getTokenHeader()});

    },


    getPayments : (id)=>{

      return this.http.get(this.base + `requests/${id}/payments`,{headers : this.getTokenHeader()});

    },

    getPaymentMethods : ()=>{

      return this.http.get(this.base + `payment/methods`, {headers : this.getTokenHeader()});

    },

    setDiscount : (request_id,data)=>{

      return this.http.post(this.base + `requests/${request_id}/discount`,data,{headers : this.getTokenHeader()});

    },



  }

  civilities = {

    getCivilities : ()=> {

      return this.http.get(this.base + `civilities`, {headers : this.getTokenHeader()});

    }

  }


  Results = {

    getRequestResults : (request_id)=> {

      return this.http.get(this.base + `requests/${request_id}/results`, {headers : this.getTokenHeader()});

    }

  }

  Cats = {
    getCats: () => {
      return this.http.get(this.base + `categories`, {
        headers: this.getTokenHeader(),
      });
    },
  }

  Tests = {

    // getTests : (key,requestId?)=>{


    //     var params

    //     requestId ?
    //     params = {"request_id" : requestId} :
    //     params = {}
    //     params.code = key


    //   return this.http.get(this.base +`tests`, {headers : this.getTokenHeader() , params});
    // },

    getTests: (key,pricing_id:number=1) => {
      return this.http.get(this.base + `tests?code=${key}&pricing_id=${pricing_id}`, {
        headers: this.getTokenHeader(),
      });
    },

    
    getTests2: (key,pricing_id:number=1,category,tests_status) => {
      return this.http.get(this.base + `tests?code=${key}&pricing_id=${pricing_id}&status=${tests_status}`+category, {
        headers: this.getTokenHeader(),
      });
    },

    getTests3: (key,pricing_id:number=1,category,tests_status,withNotes) => {
      return this.http.get(this.base + `tests?code=${key}&pricing_id=${pricing_id}&status=${tests_status}`+category+withNotes, {
        headers: this.getTokenHeader(),
      });
    },

    checkDevices: (testId,isPackage,isProfile) => {
      return this.http.get(this.base + `test/check_devices/${testId}/${isPackage}/${isProfile}`, {
        headers: this.getTokenHeader(),
      });
    },

    checkParameters: (id, data) => {
      return this.http.post(this.base + `test/check_parameters/${id}` , data , {
        headers: this.getTokenHeader(),
      });
    },

    getPricedTests: (body)=>{
      return this.http.post(this.base + `tests/prices`, body, {
        headers: this.getTokenHeader(),
      });
    },

    addTestToRequest : (request_id,test_id)=>{

      return this.http.put(this.base + `requests/${request_id}/tests/add`,test_id, {headers : this.getTokenHeader() });

    },

    removeTestFromRequest : (request_id,Test_id)=>{

      return this.http.put(this.base + `requests/${request_id}/tests/${Test_id}/remove`,null, {headers : this.getTokenHeader() });

    },

    getRequestTests : (request_id)=>{

      return this.http.get(this.base + `requests/${request_id}/tests`, {headers : this.getTokenHeader() });

    }




    // getProfile : (id)=>{

    //   return this.http.get(this.base +`profiles/${id}`, {headers : this.getTokenHeader() });

    // },

  };

  Receptionists = {
    get: (query = "") => {
      return this.http.get(this.base + `receptionists` + query, {
        headers: this.getTokenHeader(),
      });
    },
    getOne: (id, query= "") => {
      return this.http.get(this.base + `receptionists/` + id + query, {
        headers: this.getTokenHeader(),
      });
    },
    get_requests: (id, query= "") => {
      return this.http.get(this.base + `receptionists/` + id + '/requests'+ query, {
        headers: this.getTokenHeader(),
      });
    },
    print_requests: (id, query= "") => {
      return this.http.get(this.base + `reports/receptionists/` + id + '/requests'+ query, {
        headers: this.getTokenHeader(), responseType: 'blob'
      });
    },
    get_transaction: (id, query= "") => {
      return this.http.get(this.base + `receptionists/` + id + '/transactions'+ query, {
        headers: this.getTokenHeader(),
      });
    },
    print_transaction: (id, query= "") => {
      return this.http.get(this.base + `reports/receptionists/` + id + '/transactions'+ query, {
        headers: this.getTokenHeader(), responseType: 'blob'
      });
    },
    print_parameters: (excel) => {
      return this.http.get(this.base + `docs/parameters?excel=`+ excel, {
        headers: this.getTokenHeader(), responseType: 'blob'
      });
    },

  };


 Search = {
   get: (page,query)=>{
    return this.http.get(this.base +  'search/results?' + query, {headers : this.getTokenHeader()})
   }
 }

  Cashiers = {
    getCashiers : (key?)=>{
      let params = key? {"code" : key}: {}
      return this.http.get(this.base +  `fms/cashiers`, {headers : this.getTokenHeader(),params})
    },
    getCashier : (id)=>{
      return this.http.get(this.base +  `fms/cashiers/${id}`, {headers : this.getTokenHeader()})
    }
  }

  Printables = {


    // PrintCasa : (loc)=>{
    //   return this.http.get(this.base.replace('/technician/','/') +`casa/submit?report_name=${loc}`, {headers : this.getTokenHeader() , responseType: 'blob'  });
    // },
    
    PrintReciept : (id)=>{

      // window.open (this.base + `requests/${id}/printables/reciept`);

      return this.http.get(this.base +`requests/${id}/printables/reciept`, {headers : this.getTokenHeader() , responseType: 'blob'  });

    },

    Search : (query)=>{
      return this.http.get(this.base + `reports/results-search?` + query, {headers : this.getTokenHeader(),  responseType: 'blob' });
    },

    PrintResult : (id, devices,areas, tests)=>{
      // window.open (this.base + `requests/${id}/printables/reciept`);

      return this.http.get(this.base +`requests/${id}/printables/results` + tests, {headers : this.getTokenHeader() , params: {
        devices : devices?"1":"0",
        areas : areas?"1":"0"
      },responseType: 'blob'});

    },



    PrintBarcodes : (id, one_per_row, query = "")=>{
      return this.http.get(this.base +`requests/${id}/printables/barcodes?one_per_row=${one_per_row}&${query}`, {headers : this.getTokenHeader() , responseType: 'blob'  });

    },
    PrintdetailedInvoice : (id)=>{
      return this.http.get(this.base +`requests/${id}/detailedInvoice`, {headers : this.getTokenHeader() , responseType: 'blob'  });

    },



    PrintBarcodesForZebra : (id, one_per_row, query = "")=>{
      let url=this.base +`requests/${id}/barcodes?one_per_row=${one_per_row}&${query}`

      return this.http.post(this.printZebraURL+'/zebra',{
        url:url,
        username: sessionStorage.getItem('userName'),

      }, {headers : this.getTokenHeader()  });

    },
    PrintdetailedInvoiceForZebra : (id)=>{
      let query=this.base +`requests/${id}/detailedInvoice`

      return this.http.post(this.printZebraURL+'/invoice',{
        url:query
      });

    },
    PrintRecieptForZebra : (id)=>{

      // window.open (this.base + `requests/${id}/printables/reciept`);
      let query=this.base +`requests/${id}/printables/reciept`
      return this.http.post(this.printZebraURL+'/pdf',{
        url:query,
        username: sessionStorage.getItem('userName'),
      },  {headers : this.getTokenHeader()  });

    },
    PrintResultForZebra : (id, devices, areas, tests)=>{
      // http = new HttpClient
      let query=this.base +`requests/${id}/printables/results` + tests
      return this.http.post(this.printZebraURL+'/pdf',{
        url: query+'&devices='+ (devices?"1":"0") +'&areas='+ (areas?"1":"0"),
        username: sessionStorage.getItem('userName'),
      },  {headers : this.getTokenHeader()});

    },

  };
  Doctors = {
    getDoctors: (key?, paginate?, page?) => {


      let query ='?name=' + key

        return this.http.get(this.base +`doctors`, {headers : this.getTokenHeader() });
    },

    delete: (id)=>{
      return this.http.delete(this.base +`doctors/` + id, {headers : this.getTokenHeader() });

    },

    getDoctor: (id) => {
      return this.http.get(this.base + `doctors/${id}`, {
        headers: this.getTokenHeader(),
      });
    },

    createDoctor: (doctor) => {
      return this.http.post(this.base + "doctors", doctor,
       {headers: this.getTokenHeader(),
      });
    },

    editDoctor: (id, doctor) => {
      return this.http.put(this.base + `doctors/${id}`, doctor, {
        headers: this.getTokenHeader(),
      });
    },

    getTest: (key) => {
      return this.http.get(`https://restcountries.eu/rest/v2/name/${key}`);
    },
  };
  Report={
    PrintRequest: (query)=>{

      return this.http.get(this.base +`reports/requests?${query}`,  {headers : this.getTokenHeader() ,responseType: 'blob'});

    },
    PrintInvoicies: (query)=>{

      return this.http.get(this.base +`reports/invoicies?${query}`,  {headers : this.getTokenHeader() ,responseType: 'blob'});

    }

  };




  }













