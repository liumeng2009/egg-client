export const EduConfig = {
  serverPath : 'http://127.0.0.1:7001',
  unknownError : '服务器内部错误！',
  ajaxError : '网络连接错误,也可能是服务器停止服务，您可以重新尝试刚才的操作！',
  closing : '正在退出登录...',
  pageSize : 15,
  noResult : '还没有记录！',
  noResultBecauseOfAuth : '您没有权限查看这些记录！',
  // 富文本编辑器设置
  tinyMceOptions: {
    branding: false,
    plugins: 'link image code fullscreen textcolor print preview directionality emoticons table',
    language: 'zh_CN',
    toolbar1: 'undo redo | italic bold underline strikethrough | superscript subscript | forecolor backcolor | numlist bullist',
    toolbar2: 'formatselect fontselect fontsizeselect | indent outdent | alignleft aligncenter alignright alignjustify | link unlink image table emoticons',
    toolbar3: 'code | removeformat | fullscreen | print | preview ',
    images_upload_url: 'http://127.0.0.1:7001/api/upload',
    images_upload_base_path: 'http://127.0.0.1:7001',
    font_formats: 'Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Verdana=verdana,geneva;黑体=SimHei;宋体=SimSun;新宋体=NSimSun;仿宋=FangSong;楷体=KaiTi;仿宋_GB2312=FangSong_GB2312;楷体_GB2312=KaiTi_GB2312;微软雅黑体=Microsoft YaHei ',
    images_upload_handler: null,
    relative_urls : true,
  },
  atLeastOneSelected: '请您至少选取一条记录！',
  // 多语切换使用
  hostEn: 'http://localhost:4200',
  hostZh: 'http://localhost:4201',
}
