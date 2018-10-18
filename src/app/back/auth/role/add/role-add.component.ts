import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';


import {RoleService} from '../role.service';

import {EduConfig} from '../../../../config/config';


import {Role} from '../../../../bean/role';

@Component({
  selector: 'app-role-add-page',
  templateUrl: './role-add.component.html',
  styleUrls: ['./role-add.component.scss']
})

export class RoleAddComponent implements OnInit {
  constructor(
    private roleService: RoleService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}


  ngOnInit() {

  }

  private onSubmit() {

  }
}
