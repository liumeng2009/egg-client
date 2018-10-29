import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-role-page',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})

export class RoleComponent implements OnInit {

  constructor(
    private router: Router,
  ) {}
  ngOnInit() {
    this.router.navigateByUrl('/admin/auth/role/list');
  }
}
