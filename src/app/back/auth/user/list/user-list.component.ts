import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';


import {EduConfig} from '../../../../config/config';


@Component({
  selector: 'app-user-list-page',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})

export class UserListComponent implements OnInit {

  private height = 0;
  private pageSize: number = new EduConfig().pageSize;
  private skip = 0;
  private total = 0;
  private firstRecord = 0;
  private lastRecord = 0;
  private result;
  private isLoading = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {

  }

  private add() {
    this.router.navigate(['add'], {relativeTo: this.route.parent});
  }

  private editRow(id) {
    this.router.navigate([id], {relativeTo: this.route.parent});
  }
}
