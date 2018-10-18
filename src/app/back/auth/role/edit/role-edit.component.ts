import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';



import {RoleService} from '../role.service';

import {EduConfig} from '../../../../config/config';

import {Role} from '../../../../bean/role';

@Component({
  selector: 'app-role-edit-page',
  templateUrl: './role-edit.component.html',
  styleUrls: ['./role-edit.component.scss']
})

export class RoleEditComponent implements OnInit{



  constructor(
    private roleService: RoleService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}


  ngOnInit() {

  }

  private getData(id: string) {

  }
}
