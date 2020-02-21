import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { FormProductoComponent } from './components/form-producto/form-producto.component';



const routes: Routes = [
  { path: 'productos', component: MainComponent },
  { path: 'productos/cat/:tipo', component: MainComponent },
  { path: 'productos/form', component: FormProductoComponent },
  { path: 'productos/form/:id', component: FormProductoComponent },
  { path: '', redirectTo: '/productos', pathMatch: 'full' },
  { path: '**', redirectTo: 'productos' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
