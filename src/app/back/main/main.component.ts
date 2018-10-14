import {Component, OnInit} from '@angular/core';
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
    private toolService: ToolService,
  ) {

  }

  ngOnInit(): void {

  }



}
