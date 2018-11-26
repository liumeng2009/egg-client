import {Component, OnInit} from '@angular/core';
import {NavigationEnd, NavigationStart, Router} from '@angular/router';
import {NgProgress, NgProgressRef} from '@ngx-progressbar/core';

@Component({
  selector: 'app-front-main-page',
  templateUrl: './main.component.html'
})

export class FrontMainComponent implements OnInit {
  progressRef: NgProgressRef;
  constructor(
    private router: Router,
    private progressService: NgProgress,
  ) {
    this.progressRef = this.progressService.ref();
  }
  ngOnInit() {
    this.addRouteListener();
  }
  addRouteListener() {
    this.router.events
      .subscribe((event) => {
        if (event instanceof  NavigationStart) {
          this.progressRef.start();
        }
        if (event instanceof NavigationEnd) { // 当导航成功结束时执行
          this.progressRef.complete();
        }
      });
  }
}
