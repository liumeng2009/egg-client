import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-no-auth-page',
  templateUrl: './noAuth.component.html',
  styleUrls: ['./noAuth.component.scss']
})

export class NoAuthComponent implements OnInit {

  second = 5;
  constructor(
    private title: Title,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnInit() {
    this.title.setTitle('没有权限访问该页面');
    this.goSecond();
  }

  goSecond() {
    setInterval(() => {
      this.second--;
      if (this.second === 0) {
        this.router.navigate(['../admin/total'], {relativeTo: this.route});
      }
    }, 1000);
  }

  goMain() {
    this.router.navigate(['../admin/total'], {relativeTo: this.route});
  }
}
