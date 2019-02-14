export class RouteList {
  zh = [
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
        { path: 'category', data: {name: '文件管理'}, children: [
          {path: 'list', data: {name: '列表'}},
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
    {path: 'system', data: {name: '系统设置', icon: 'setting'}},
  ];
  en = [
    {path: 'total', data: {name: 'Dashboard', icon: 'appstore'}},
    {path: 'content', data: {name: 'Content', icon: 'book'}, children: [
        { path: 'article', data: {name: 'Article'}, children: [
            {path: 'list', data: {name: 'List'}},
            {path: 'add', data: {name: 'Add'}},
            {path: ':id', data: {name: 'Edit'}},
          ]},
        { path: 'category', data: {name: 'Category'}, children: [
            {path: 'list', data: {name: 'List'}},
            {path: 'add', data: {name: 'Add'}},
            {path: ':id', data: {name: 'Edit'}},
          ]},
        { path: 'file', data: {name: 'File'}, children: [
          {path: 'list', data: {name: 'list'}},
        ]},
      ]
    },
    {path: 'auth', data: {name: 'Account', icon: 'user'}, children: [
        { path: 'user', data: {name: 'User'}, children: [
            {path: 'list', data: {name: 'List'}},
            {path: 'add', data: {name: 'Add'}},
            {path: ':id', data: {name: 'Edit'}},
          ]},
        { path: 'role', data: {name: 'Role'}, children: [
            {path: 'list', data: {name: 'List'}},
            {path: 'add', data: {name: 'Add'}},
            {path: ':id', data: {name: 'Edit'}},
          ]}
      ]
    },
    {path: 'system', data: {name: 'System', icon: 'setting'}},
  ];
}
