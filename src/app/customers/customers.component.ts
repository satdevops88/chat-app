import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { ApiService } from '../shared/api/api.service';
import { AuthService } from 'app/shared/auth/auth.service';

@Component({
    selector: 'list-customer',
    templateUrl: './customers.component.html',
    styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {

    //-- ATTRIBUTES
    /**
     * @description List of Customers. Data to display in the table.
     */
    customers: any;
    customer: any;
    myCustomers: any = [];
    agents: any;

    //-- CONSTRUCTORS
    /**
     * @description Default constructor.
     */
    constructor(private apiService: ApiService, private router: Router, private authService: AuthService) {
        this.apiService.setService('customer/');
    }

    ngOnInit() {
        this.loadCustomers();
    }

    private loadCustomers() {
        this.myCustomers = [];
        this.apiService
            .getAll<any[]>()
            .subscribe((data: any[]) => {
                this.customers = data['result'];
                this.apiService.setService('agent/');
                this.apiService.getAll<any[]>().subscribe((data1: any[]) => {
                    this.agents = data1['result'];
                    this.customers.forEach((elementCustomer: any) => {
                        var customerInfo: any = {};
                        customerInfo.id = elementCustomer.customerid;
                        customerInfo.name = elementCustomer.name;
                        customerInfo.phonenum = elementCustomer.phonenum;
                        this.agents.forEach((elementAgent: any) => {
                            if(elementCustomer.agentid == elementAgent.agentid){
                                customerInfo.agentName = elementAgent.name;
                            } else {
                                customerInfo.agentName = '';
                            }
                        });
                        this.myCustomers.push(customerInfo);
                    });
    
                })
                console.log(this.myCustomers);
            },
                error => () => {
                    console.error(error)
                },
                () => {
                    console.log("campaigns loaded.")
                });
    }

    onAddCustomer(){
        this.router.navigate(['add-customer'])
    }

    onRemove(customerid: string) {
        this.apiService.setService('customer/');
        console.log(customerid)
        this.apiService.delete(customerid).subscribe(() => {
            this.apiService.setService('customer/');
            this.loadCustomers();
        });
    }


}
