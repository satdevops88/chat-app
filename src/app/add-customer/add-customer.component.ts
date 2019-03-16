import { Component, OnInit } from '@angular/core';

import { AuthService } from 'app/shared/auth/auth.service';
import { ApiService } from 'app/shared/api/api.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.scss']
})
export class AddCustomerComponent {

  oname: string = '';
  PhoneNumber: string = '';

  customerInfo: any = {
    name: '',
    number: ''
  }

  constructor(private authenticationService: AuthService,
    private apiService: ApiService,
    private router: Router,
    private toastr: ToastrService) {
  }


  onCancel() {
    this.router.navigate(['customers']);
  }

  onRegister() {
    this.customerInfo.name = this.oname;
    this.customerInfo.number = this.PhoneNumber;
    this.customerInfo.agentid = localStorage.getItem('agentId');
    this.apiService.setService('customer');
    this.apiService.add(this.customerInfo).subscribe(data => {
      console.log(data);
      this.toastr.success('Successfully Added')
      this.router.navigate(['customers'])
    }, (error) => {
      console.log(error);
      this.toastr.error(error['error'].message)

    })
    console.log(this.customerInfo);

  }
}
