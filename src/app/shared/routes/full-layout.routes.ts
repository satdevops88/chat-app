import { Routes, RouterModule } from '@angular/router';

//Route for content layout with sidebar, navbar and footer.

export const Full_ROUTES: Routes = [
  {
    path: 'chat',
    loadChildren: './chat/chat.module#ChatModule'
  }
];