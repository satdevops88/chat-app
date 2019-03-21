import { Routes, RouterModule } from '@angular/router';

//Route for content layout without sidebar, navbar and footer for pages like Login, Registration etc...

export const CONTENT_ROUTES: Routes = [
    {
        path: 'login',
        loadChildren: './login/login.module#LoginModule'
    },
    {
      path: 'video-accept/:room_name',
      loadChildren: './video-accept/video-accept.module#VideoAcceptModule'
    },
    {
      path: 'not-found',
      loadChildren: './notfound/notfound.module#NotFoundModule'
    },
    {
        path: '**',
        redirectTo: '/not-found'
    }
];