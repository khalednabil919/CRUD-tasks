import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TasksAdminRoutingModule } from './tasks-admin-routing.module';
import { ListTasksComponent } from './components/list-tasks/list-tasks.component';
import { AddTaskComponent } from './components/add-task/add-task.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from '../../material/material.module';
import { ConfirmationComponent } from './components/confirmation/confirmation.component';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    ListTasksComponent,
    AddTaskComponent,
    ConfirmationComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxPaginationModule,
    CommonModule,
    TasksAdminRoutingModule,
    MaterialModule
  ]
})
export class TasksAdminModule { }
