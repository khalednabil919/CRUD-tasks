import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private fb:FormBuilder,
    private service:LoginService,
    private toastr: ToastrService,
    private router:Router,
    private spinner: NgxSpinnerService
    ) { }
  loginForm!:FormGroup;
  ngOnInit(): void {
    this.createForm();
  }

  createForm(){
    console.log(2);
    this.loginForm = this.fb.group({
      email:['',[Validators.email, Validators.required]],
      password:['',[Validators.required, Validators.minLength(3),Validators.maxLength(20)]],
      role:['admin']
    });
    
  }
  login(){
    this.service.Login(this.loginForm.value).subscribe((res:any)=>{
      localStorage.setItem("token", res.token);
      this.toastr.success("success","Login Success");
      this.router.navigate(['/tasks']);
    }, err=>{
      this.toastr.error(err.error.massage)
    })
  }

}
