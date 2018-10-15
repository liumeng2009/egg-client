import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {User} from '../../bean/user';
import {ResponseData} from '../../bean/responseData';
import {ToolService} from '../../util/tool.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})

export class MainComponent implements OnInit {


  constructor(
    private title: Title,
    private toolService: ToolService,
  ) {
    this.title.setTitle('首页');
  }

  private collapsed = false;
  private openMenu = false;
  private contentStyle = {
    minHeight : '0px',
    backgroundColor : '#fff',
    marginTop: '0px'
  }
  ngOnInit(): void {
    this.initHeight();
  }
  initHeight() {
    const screenHeight = document.documentElement.clientHeight;
    this.contentStyle.minHeight = screenHeight - (32 + 64 + 69 + 21) + 'px';
    this.contentStyle.marginTop = ( 21 + 32) + 'px';
  }
  toggleCollapse() {
    this.collapsed = !this.collapsed;
    if (this.collapsed) {
      this.openMenu = false;
    }
  }



}
