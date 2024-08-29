import { Dialog } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddTaskComponent } from '../add-task/add-task.component';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {

  constructor(private dialog: MatDialogRef<ConfirmationComponent> ,private matDialog:MatDialog) 
  {

  }
  ngOnInit(): void {
  }

  confirm()
  {
    this.matDialog.closeAll();
  }

  close()
  {
    this.dialog.close();
  }

}
