import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {GeneratorComponent} from './components/generator/generator.component';
import {PaymentsComponent} from './components/payments/payments.component';


const routes: Routes = [{
  path: 'generator',
  component: GeneratorComponent
}, {
  path: 'payments',
  component: PaymentsComponent
}, {
  path: '',
  pathMatch: 'full',
  redirectTo: 'generator'
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
