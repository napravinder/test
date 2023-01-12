import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LogbookPage } from './logbook.page';

const routes: Routes = [
  {
    path: '',
    component: LogbookPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LogbookPageRoutingModule {}
