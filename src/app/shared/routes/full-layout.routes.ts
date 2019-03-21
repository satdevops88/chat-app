import { Routes, RouterModule } from '@angular/router';

//Route for content layout with sidebar, navbar and footer.

export const Full_ROUTES: Routes = [
  {
    path: 'chat',
    loadChildren: './chat/chat.module#ChatModule'
  },
  {
    path: 'video/:room_name',
    loadChildren: './video/video.module#VideoModule'
  },
  {
    path: 'video-accept/:room_name',
    loadChildren: './video-accept/video-accept.module#VideoAcceptModule'
  },
  {
    path: 'add-customer',
    loadChildren: './add-customer/add-customer.module#AddCustomerModule'
  },
  {
    path: 'customers',
    loadChildren: './customers/customers.module#CustomersModule'
  }
];