import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';


import {EduConfig} from '../../../../config/config';


@Component({
  selector: 'app-user-add-page',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss']
})

export class UserAddComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}


  ngOnInit() {

  }
}
