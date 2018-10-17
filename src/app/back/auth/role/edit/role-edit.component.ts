import {Component,OnInit,ViewContainerRef,ViewChild} from '@angular/core';
import {Router,ActivatedRoute,Params} from '@angular/router';

import {PageChangeEvent,GridDataResult} from '@progress/kendo-angular-grid';
import {GridComponent} from '@progress/kendo-angular-grid';

import {RoleService} from '../role.service';
import {AlertData} from "../../../../bean/alertData";
import {FunctionService} from '../../fucntion/function.service'

import {OptConfig} from '../../../../config/config';

import {ApiResultService} from '../../../main/apiResult.service';
import {AjaxExceptionService} from '../../../main/ajaxExceptionService';
import {Role} from "../../../../bean/role";
import {MissionService} from "../../../main/mission.service";
import {SwitchService} from "../../../main/switchService";

@Component({
  selector:'role-edit',
  templateUrl:'./role-edit.component.html',
  styleUrls:['./role-edit.component.scss']
})

export class RoleEditComponent implements OnInit{

  role=new Role(null,null,null);

  constructor(
    private roleService:RoleService,
    private functionSerivce:FunctionService,
    private router:Router,
    private route:ActivatedRoute,
    private apiResultService:ApiResultService,
    private ajaxExceptionService:AjaxExceptionService,
    private switchService:SwitchService,
    private missionService:MissionService
  ){

  };


  ngOnInit(){
    this.route.params.subscribe((params: Params) =>{
      this.getData(params.id);
      this.initAllAuth(params.id);
    });
  }

  //从user对象中，找出对应该页面的auths数组
  private subscription;
  private pageAuths=[];
  private showSaveBtn:boolean=false;
  private auth(){
    let user=this.switchService.getUser();
    if(user){
      //main组件早已经加载完毕的情况
      this.pageAuths=this.initAuth('role');
      this.initComponentAuth();
    }
    else{
      //和main组件一同加载的情况
      this.subscription=this.missionService.hasAuth.subscribe(()=>{
        this.pageAuths=this.initAuth('role');
        this.initComponentAuth();
      });
    }
  }
  private initAuth(functioncode){
    let resultArray=[];
    let user=this.switchService.getUser();
    if(user&&user.role&&user.role.auths){
      let auths=user.role.auths;
      console.log(auths);
      for(let auth of auths){
        if(auth.opInFunc
          &&auth.opInFunc.function
          &&auth.opInFunc.function.code
          &&auth.opInFunc.function.code==functioncode
        ){
          resultArray.push(auth);
        }
      }
    }
    return resultArray;
  }
  //根据auth数组，判断页面一些可操作组件的可用/不可用状态
  private initComponentAuth(){
    for(let auth of this.pageAuths){
      if(auth.opInFunc&&auth.opInFunc.operate&&auth.opInFunc.operate.code&&auth.opInFunc.operate.code=='edit'){
        this.showSaveBtn=true;
      }
    }
  }

  private getData(id:string){
    this.roleService.getRole(id).then(
      data=>{
        let result=this.apiResultService.result(data);
        if(result&&result.status==0){
          this.role=result.data;
          console.log(this.role);
        }
      },
      error=>{
        this.ajaxExceptionService.simpleOp(error);
      }
    )
  }

  private gridData:GridDataResult={
    data:[],
    total:0
  };

  @ViewChild('funcGrid') funcGrid: GridComponent;
  private initAllAuth(roleId){
    this.functionSerivce.getList().then(
      data=>{
        let result=this.apiResultService.result(data);
        console.log(result);
        if(result&&result.status==0){
          //this.gridData=result;
          //将数组处理成两层结构的树
          let newFunctions=[];
          for(let f of result.data){
            if(f.class==0){
              f.children=[];
              newFunctions.push(f);
            }
          }

          for(let f of result.data){
            for(let nf of newFunctions){
              if(f.belong==nf.id){
                nf.children.push(f);
              }
            }
          }

          this.gridData.data=newFunctions;

          setTimeout(()=>{
            for(let i=0;i<newFunctions.length;i++)
              this.funcGrid.expandRow(i);
          },0)

          this.initOwnAuth(roleId)
        }
      },
      error=>{
        this.ajaxExceptionService.simpleOp(error);
      }
    )
  }

  private initOwnAuth(roleId){
    let t=this.gridData;
    console.log(t);
    this.roleService.authInRoleList(roleId).then(
      data=>{
        let result=this.apiResultService.result(data);
        if(result&&result.status==0){
          //与所有的权限做比对
          let authOwn=result.data;
          for(let bigKind of t.data){
            //第一层
            let ops=bigKind.ops;
            for(let op of ops){
              op.checked=false;
              for(let ao of authOwn){
                if(ao.authId==op.id){
                  op.checked=true;
                }
              }
            }
            //第二层
            for(let smallKind of bigKind.children){
              let sops=smallKind.ops;
              for(let op of sops){
                op.checked=false;
                for(let ao of authOwn){
                  if(ao.authId==op.id){
                    op.checked=true;
                  }
                }
              }
            }

          }


          console.log(this.gridData);

        }
      },
      error=>{
        this.ajaxExceptionService.simpleOp(error);
      }
    )
  }


  private onSubmit(){
    this.roleService.edit(this.role).then(
      data=>{
        let result=this.apiResultService.result(data);
        if(result&&result.status==0){
          this.router.navigate(['../'],{relativeTo:this.route});
        }
      },
    error=>{
      this.ajaxExceptionService.simpleOp(error);
    }
    )
  }

  private authChange($event,authId){
    let chk=$event.target.checked

    this.route.params.subscribe((params: Params) =>{
      let roleId=params.id;

      if(chk){
        this.roleService.authInRoleCreate({roleId:roleId,authId:authId}).then(
          data=>{
            let result=this.apiResultService.result(data);
            if(result&&result.status==0){

            }
            else{
              $event.target.checked=false;
            }
          },
          error=>{
            this.ajaxExceptionService.simpleOp(error);
          }
        )
      }
      else{
        this.roleService.authInRoleDelete({roleId:roleId,authId:authId}).then(
          data=>{
            let result=this.apiResultService.result(data);
            if(result&&result.status==0){

            }
            else{
              $event.target.checked=true;
            }
          },
          error=>{
            this.ajaxExceptionService.simpleOp(error);
          }
        )
      }



    });
  }
}
