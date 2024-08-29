import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TasksService } from '../../services/tasks.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationComponent } from '../confirmation/confirmation.component';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent implements OnInit {

  constructor(
      @Inject(MAT_DIALOG_DATA) public data:any,
      private fb:FormBuilder 
    , public dialog: MatDialogRef<AddTaskComponent> 
    , public matDialog:MatDialog
    , private taskService:TasksService
    , private toastrService: ToastrService
    , private spinner:NgxSpinnerService ) { }
 fileName =""
  users:any = [
    {name:"user1" , id:'66cceaad081322c5cb8dd54d'},
    {name:"user2" , id:'66cceace081322c5cb8dd550'}
  ]
  newTaskForm!:FormGroup;
  newDeadLine:any;
  copiedObject:any;
  dialogRef:any;
  ngOnInit(): void {
    console.log(this.data);
    this.CreateForm();
  }
  CreateForm(){
    this.newTaskForm = this.fb.group({
      title:[this.data?.title || '',[Validators.required,Validators.minLength(5)]],
      userId:[this.data?.userId._id || '',Validators.required],
      image:[this.data?.image || '',Validators.required],
      description:[this.data?.description || '',Validators.required],
      deadline:[ this.data? new Date(this.data?.deadline.split('-').reverse().join('-')).toISOString() : '',Validators.required],
      
    })

    //this.copiedObject= this.newTaskForm.value;
    this.copiedObject={title:this.data?.title || '',
                        userId:this.data?.userId._id || '', image:this.data?.image || '',
                        description: this.data?.description || '', deadline: this.data?
                        new Date(this.data?.deadline.split('-').reverse().join('-')).toISOString() : ''};

    console.log(this.newTaskForm);
    console.log(new Date(this.data?.deadline.split('-').reverse().join('-')))
    console.log(this.data?.deadline.split('-').reverse().join('-'))
    this.fileName = this.newTaskForm.get('image')?.value;
  }

 

  selectImage(event:any){
    this.newTaskForm.get('image')?.setValue(event.target.files[0]);
    this.fileName = event.target.value;
  }


  createTask(){
    console.log(this.newTaskForm)
    let data = this.prepareFormData();
    this.taskService.addTask(data).subscribe((res:any)=>{
            console.log(res.massage);
            this.toastrService.success(res.massage)
            this.dialog.close(true)
    },error=>{
      this.toastrService.error(error.error.message);
    });
  }


  updateTask(){
    console.log(this.newTaskForm)
    let data = this.prepareFormData();
    this.taskService.updateTask(data,this.data._id).subscribe((res:any)=>{
            console.log(res.massage);
            this.toastrService.success(res.massage)
            this.dialog.close(true)
    },error=>{
      this.toastrService.error(error.error.message);
    });
  }

  close()
  {
    let hasChanged = false;
    Object.keys(this.copiedObject).forEach(item=>{
      if(this.copiedObject[item] !== this.newTaskForm.value[item])
      {
        hasChanged = true;
        console.log(this.copiedObject[item] , this.newTaskForm.value[item])
      }
    })

    if(hasChanged)
    {
      const dialogRef =this.matDialog.open(ConfirmationComponent, {
        width: '750px',
      });

      dialogRef.afterClosed().subscribe(res=>{
       
      })
    }
    else{
      this.dialog.close();
    }
   

  }

  prepareFormData(){
    this.newDeadLine = moment(this.newTaskForm.value['deadline']).format('DD-MM-YYYY');
    let formData = new FormData();
    Object.entries(this.newTaskForm.value).forEach(([key, value]:any)=>{
      if(key=='deadline')
      {
        formData.append(key,this.newDeadLine);
      }
      else
      {
        formData.append(key, value);
      }
    })
    return formData;
  }

}
