import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  pageTitle = "Orders Data"
  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  logout() {
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }

}
