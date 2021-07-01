import { Component, ElementRef, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SpinnerService } from '../spinner/spinner.service';
import { Router,CanActivate } from '@angular/router';
import { UploadService } from '../upload.service';

@Component({
  selector: 'app-qr-generator',
  templateUrl: './qr-generator.component.html',
  styleUrls: ['./qr-generator.component.scss']
})
export class QrGeneratorComponent implements OnInit {
  fileToUpload: any;
  uploadForm: any;
  selectedfile: any;
  entry_Id: any;
  linkdata: any;
  store: any;
  hash: any;
  sharableLink: any;
  PDFbase64: any;
  blob: any;
  mytext:any = 'No file selected'
  pdfdata:boolean = false;
  showmessage:boolean = false;
 
  constructor(private http: HttpClient,private elementRef: ElementRef,private spinnerService:SpinnerService, private router:Router,private service : UploadService) { }

  
  ngAfterViewInit() {
    this.elementRef.nativeElement.ownerDocument
      .body.style.backgroundImage = "url('../assets/img/10.jpg')";
    this.elementRef.nativeElement.ownerDocument
      .body.style.backgroundSize = 'cover';
  }

  ngOnInit(): void {

  }


  handleFileInput(files: any) {
    this.selectedfile = files.target.files[0];
    console.log(this.selectedfile);
    if(this.selectedfile != null){
      this.pdfdata=true;
      this.showmessage = false;
    }else{
      this.showmessage = true;
    }
    this.mytext = this.selectedfile['name']
    this.readBase64(this.selectedfile)
      .then((data) => {
        this.PDFbase64 = data;
        console.log(this.PDFbase64.replace("data:application/pdf;base64,",""));
        this.PDFbase64 = this.PDFbase64.replace("data:application/pdf;base64,","");
      });
  }
  uploadFileToActivity() {
    if(this.pdfdata){
    this.spinnerService.requestStarted();
    const formData = new FormData();
    formData.append('file', this.selectedfile, this.selectedfile.name);
    console.log(formData);
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('Token')
    });
    let options = { headers: headers };
    this.http.post<any>('http://43.231.254.242:89/api/v1/uploads', formData, options).subscribe(
      (res) => {
        console.log(res)
        if (res.status == 'success') {
          this.entry_Id = res.fileEntry.id;
          this.linkdata = {
            "allow_download": true
          }
          this.http.post(`http://43.231.254.242:89/api/v1/entries/${this.entry_Id}/shareable-link`, this.linkdata, options).subscribe((res) => {
            console.log(res)
            this.store = res
            if (this.store.status == 'success') {
              this.spinnerService.requestEnded();
              this.sharableLink = `http://43.231.254.242:89/drive/s/${this.store.link.hash}`;
              console.log(this.sharableLink);
              let headers = new HttpHeaders({
                 'responseType': 'text'
              });
              this.http.post(`http://qrcode.esehat.in`,{'link' : this.sharableLink , 'file' : this.PDFbase64}, {responseType: 'blob'}
              ).subscribe((res : any)=>{
                this.blob = res
                console.log(res);
                var file = new Blob([this.blob], {type: 'application/pdf'});
                var fileURL = URL.createObjectURL(file);
                window.open(fileURL);
              })
            }
          }, (err) => {
           this.spinnerService.resetSpinner();
            console.log(err)
          })
        }
      },
      (err) => { 
        this.spinnerService.resetSpinner();
        console.log(err) }
    );
      }else{
        this.showmessage = true;
      }
  }

  readBase64(file: any): Promise<any> {
    const reader = new FileReader();
    const future = new Promise((resolve, reject) => {
      reader.addEventListener('load', function () {
        resolve(reader.result);
      }, false);
      reader.addEventListener('error', function (event) {
        reject(event);
      }, false);

      reader.readAsDataURL(file);
    });
    return future;
  }

  logout(){
    this.router.navigateByUrl('/home' , {
      replaceUrl : true
     })
  }

}