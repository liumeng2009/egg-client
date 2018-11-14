export class RouteList {
  rl = [
    {path: 'total', data: {name: '网站信息', icon: 'appstore'}},
    {path: 'content', data: {name: '网站内容管理', icon: 'book'}, children: [
        { path: 'article', data: {name: '内容管理'}, children: [
            {path: 'list', data: {name: '列表'}},
            {path: 'add', data: {name: '新增'}},
            {path: ':id', data: {name: '编辑'}},
          ]},
        { path: 'category', data: {name: '栏目管理'}, children: [
            {path: 'list', data: {name: '列表'}},
            {path: 'add', data: {name: '新增'}},
            {path: ':id', data: {name: '编辑'}},
          ]},
      ]
    },
    {path: 'auth', data: {name: '用户权限管理', icon: 'user'}, children: [
        { path: 'user', data: {name: '用户管理'}, children: [
            {path: 'list', data: {name: '列表'}},
            {path: 'add', data: {name: '新增'}},
            {path: ':id', data: {name: '编辑'}},
          ]},
        { path: 'role', data: {name: '角色管理'}, children: [
            {path: 'list', data: {name: '列表'}},
            {path: 'add', data: {name: '新增'}},
            {path: ':id', data: {name: '编辑'}},
          ]}
      ]
    },
  ];
}
