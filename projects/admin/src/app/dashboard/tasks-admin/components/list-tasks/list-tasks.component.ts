import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddTaskComponent } from '../add-task/add-task.component';
import { TasksService } from '../../services/tasks.service';
import { map, tap } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
export interface PeriodicElement {
  title: string;
  user: string;
  deadLineDate: string;
  status: string;
}

const ELEMENT_DATA: PeriodicElement[] = [];
@Component({
  selector: 'app-list-tasks',
  templateUrl: './list-tasks.component.html',
  styleUrls: ['./list-tasks.component.scss']
})
export class ListTasksComponent implements OnInit {
  displayedColumns: string[] = ['position', 'title', 'user' ,'deadLine','status', 'actions'];
  dataSource = ELEMENT_DATA;
  tasksFilter!:FormGroup
  users:any = [
    {name:"user1" , id:'66cceaad081322c5cb8dd54d'},
    {name:"user2" , id:'66cceace081322c5cb8dd550'}
  ]
  status:any = [
    {name:"Complete"},
    {name:"In-Progress"},
  ]
  page:any = 1;
  filteration:any={
  
  }
  timeOutId:any;
  total:any;
  noOfPages:any;
  limit:any=5
  obj:any;
  currentPage=1;
  activeElement: number | null = 1;
  constructor(private service:TasksService, private dialog:MatDialog, private spinner: NgxSpinnerService,
              private toastr:ToastrService
  ) { }

  ngOnInit(): void {
    this.filteration["limit"] = 5;
    this.getAllTasks()
  }


  search(event:any){
    this.filteration['keyword']=event.value;
    clearTimeout(this.timeOutId);
    this.timeOutId = setTimeout(()=>{
      this.getAllTasks();
    },2000)
  }


  selectUser(event:any){
    this.filteration['userId']= event.value;
    this.getAllTasks();
    }
    selectDate(event:any,type:any){
      
      this.filteration[type]=moment(event.value).format('DD-MM-YYYY')
      if(type === 'toDate' && this.filteration['toDate'] !=='Invalid date')
      { 
        console.log(this.filteration['fromDate'],this.filteration['toDate'])
        console.log(type)
        this.getAllTasks();
      }
    }
    selectStatus(event:any){
      console.log(event.value)
      this.filteration['status']= event.value.trim();
      this.getAllTasks();
    }

  getAllTasks() {
    this.service.getAllTasks(this.filteration).pipe(tap((res:any)=>{
      this.total = res.totalItems
    })

      ,map((res:any)=>{
        return res.tasks.map((task:any)=>{
          return {
            ...task, 
            user: task.userId.username
          }
        })
    })).subscribe(res=>{
    console.log('subscribe')
    this.dataSource = res;
    this.noOfPages = Math.floor(((this.total/this.limit))) + (this.total%this.limit);
    this.obj = Array(this.noOfPages).fill(0).map((x,i)=>i);
    console.log(this.noOfPages,this.total,this.limit);
    })
  
  }

  mappingTasks(data:any[]){
    return data.map(item=>{
      return {
        ...item,
        username:item.userId.username
      }
    })
  }
  
  update(element:any)
  {
    const dialogRef =this.dialog.open(AddTaskComponent, {
      height: '600px',
      width: '600px',
      data: element,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(res=>{
      if(res === true)
      {
        this.getAllTasks();
      }
    })

  }

   addTask(){

     const dialogRef =this.dialog.open(AddTaskComponent, {
      height: '600px',
      width: '600px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(res=>{
      if(res===true)
      {
        this.getAllTasks();
      }
    })

    }

    delete(id:any)
    {
      this.service.deleteTask(id).subscribe(res=>{
        this.getAllTasks();
        console.log(res)
        this.toastr.success("success");
      },error=>{
        this.toastr.error(error.error.massage);
      })
    }

    paginate(number:any)
    {
      this.filteration["page"] = number;
      this.currentPage = number
      this.activeElement=this.currentPage;
      this.getAllTasks();
    }
    next(){
      this.currentPage +=1;
      this.paginate(this.currentPage+1);
    }
    previous(){
      this.currentPage -=1;
      this.paginate(this.currentPage+1);
    }
}
