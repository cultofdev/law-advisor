import { NgModule } from '@angular/core';
import { LayoutComponent } from './layout.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'todo', pathMatch: 'prefix' },
      { path: 'todo', loadChildren: () => import('./todo/todo.module').then(m => m.TodoModule) },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
