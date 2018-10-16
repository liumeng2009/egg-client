import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';


import {EduConfig} from '../../../../config/config';

@Component({
  selector: 'app-user-edit-page',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})

export class UserEditComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {}


  ngOnInit() {

  }
}
