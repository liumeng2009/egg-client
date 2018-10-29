import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-user-page',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})

export class UserComponent implements OnInit {

  constructor(
    private router: Router,
  ) {}

  ngOnInit() {
    this.router.navigateByUrl('/admin/auth/user/list');
  }
}
