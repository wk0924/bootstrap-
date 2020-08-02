
//判断浏览器是否支持localStorage
if(! window.localStorage){
    alert("请升级浏览版本，或更换成最新版谷歌浏览器");
}else{

//拖动按钮被拖动时
function initContainer(){
	//布局栅栏外层拖动
	$(".layout-box").sortable({
		connectWith: ".column",
		cursor: "move",
		items :".ui-draggable",		//只是.ui-draggable可以拖动
		revert: '200',		//释放时，增加动画，200毫秒
		opacity: .5,	//拖动时，透明度为0.5
		//handle: ".drag",	//限制拖动排序的元素
		start: function() {},
		stop: function() {
			//重新存储页面数据
			createLayout();
		}
	});
	//布局组件内层拖动
	$(".layout-box .column").sortable({
		connectWith: ".column",
		items :".ui-draggable",		//只是.ui-draggable可以拖动
		revert: "200",		//释放时，增加动画，200毫秒
		opacity: .5,	//拖动时，透明度为0.5
		//handle: ".drag",	//限制拖动排序的元素（取消可拖动的元素，使整体变得可拖动）
		start: function() {},
		stop: function() {
			createLayout();
		}
	});
}

//重新编译轮播图ID
function handleCarouselIds() {
	function randomNumber() {
		return randomFromInterval(1, 1e6)
	}
	function randomFromInterval(e, t) {
		return Math.floor(Math.random() * (t - e + 1) + e)
	}
	var e = $(".layout-box #carousel-example-generic");
	var t = randomNumber();
	var n = "carousel-" + t;
	e.attr("id", n);
	e.find(".carousel-indicators li").each(function(e, t) {
		$(t).attr("data-target", "#" + n)
	});
	e.find(".left").attr("href", "#" + n);
	e.find(".right").attr("href", "#" + n)
}

//重新编译切换卡ID
function handleTabsIds() {
	var e = $(".rightLayout #tabs");
	var t = randomNumber();
	var n = "tabs-" + t;
	e.attr("id", n);
	e.find(".tab-pane").each(function() {
		var n = $(this).attr("id");
		var r = "panel-" + randomNumber();
		$(this).attr("id", r);
		$(this).parent().parent().find("a[href='#" + n + "']").attr("href", "#" + r)
	});
}

function handleAccordionIds() {
	var e = $(".rightLayout #accordion");
	var t = randomNumber();
	var n = "accordion" + t;
	e.attr("id", n);
	e.find(".panel").each(function() {
		var r = "accordion" + randomNumber();
		$(this).find(".panel-heading a").attr("href", "#" + r);
		$(this).find(".panel-collapse").attr("id", r);
		$(this).find('.panel-title a').click(function () {
			var _this = $(this);
			$(_this).parent().parent().siblings('.panel-collapse').slideToggle();
		});
	});
}

function randomNumber() {
	return randomFromInterval(1, 1e6)
}

function randomFromInterval(e, t) {
	return Math.floor(Math.random() * (t - e + 1) + e)
}

//创造布局数据
function createLayout() {
	var data = {};
	data.pages = [];
	//如何缓存数据已经存在，就重新覆盖新的布局数据（修改）
	$(".layout-body .layout-box-ul .layout-box-li").each(function () {
		var a = $(this).data("title");
		var b = $(this).html();
		var c = $(this).data("id");
		var d = $(this).data("file");
		data.pages.push({title:a,content:b,id:c,file:d});
	});
	localStorage.setItem("layoutData",JSON.stringify(data));
	return false;
}

//读取缓存布局数据
function readLayout() {
	var layoutHistory = JSON.parse(localStorage.getItem("layoutData"));
	if(layoutHistory){
		$(layoutHistory.pages).each(function () {
			var _this = this;
			$(".layout-body .layout-box-ul .layout-box-li").each(function () {
				if($(_this)[0].id === $(this).data("id")){
					$(this).html($(_this)[0].content);
				}
			});
		});
	}
}

//操作栏函数
function removeLayout() {
	//删除布局数据
	$(".edit .layout-box-li .operation .remove").click(function () {
		var _this = $(this);
		layer.confirm('', {
			title: '系统提示',
			area: ['280px', 'auto'],
			btn: ['确定','取消'], //按钮
			content: '<p><i class="iconfont icon-prompt"></i></p><p>确定删除当前部分吗？</p>'
		}, function(){
			_this.parent().parent().remove();
			createLayout();
			layer.close(layer.index);	//关闭当前层
		});
	});
	
	//更换背景色
	$(".edit .layout-box-li .operation .color").click(function () {
		var old_background = $(this).parent().parent().find(".new-background");
		//页面层
		layer.open({
		    type: 1,
		    title: '更换颜色',
		    area: ['280px', '190px'],
		    shadeClose: true, //开启遮罩关闭
		    content: '<link href="/website/js/background/spectrum.css" rel="stylesheet"><script src="/website/js/background/spectrum.js" type="text/javascript"></script><script src="/website/js/background/docs.js" type="text/javascript"></script><br/><p class="text-center"><input type="text" id="full" /></p><p class="text-center text-muted">点击上方按钮选择颜色</p>',
			btn: ['确定更换'],
			yes: function(){
				var getBackground = localStorage.getItem("changeBackground");
				getBackground = getBackground.replace("\"","").replace("\"","");
				layer.close(layer.index);	//关闭当前层
				$(old_background).css("background",getBackground);
				createLayout();
			},
		});
		
	});
	//列表+1
	$(".edit .layout-box-li .operation .add-list").click(function () {
		var htmls = $(this).parent().parent().find(".view-components").children().html();
		htmls = $(htmls)[0];
		$(this).parent().parent().find(".view-components").children().append(htmls);
		createLayout();
	});
	//自定义间距高
	$(".edit .layout-box-li .operation .empty-line-value").click(function () {
		var _this = $(this);
		layer.prompt({
			title: '请输入间距数值', 
			formType: 0,
		}, function(text, index){
			//正则表达式，如果输入的不是正整数
			if(!(/(^[1-9]\d*$)/.test(text))){
			    layer.msg("请输入正整数",{icon:2});
			    return
			}else{
				_this.parent().parent().find(".empty-line").css("height",text);
				createLayout();
				layer.close(index);
			}
		});
	});
	//表格行+1
	$(".edit .layout-box .operation .add-table-colspan").click(function () {
		var htmls = $(this).parent().parent().find(".view-components table tbody tr");
		var num = $(htmls).length - 1;
		htmls = $(htmls)[num].outerHTML;
		$(this).parent().parent().find(".view-components table").append(htmls);
		createLayout();
	});
	//表格行-1
	$(".edit .layout-box .operation .delete-table-colspan").click(function () {
		$(this).parent().parent().find(".view-components table tbody tr:last").remove();
		createLayout();
	});
	//表格列+1
	$(".edit .layout-box .operation .add-table-rowspan").click(function () {
		var htmls = $(this).parent().parent().find(".view-components table tbody tr");
		$(htmls).each(function(){
			var td_1 = $(this).children("td:last");
			td_1 = $(td_1)[0].outerHTML;
			$(this).append(td_1);
		});
		createLayout();
	});
	//表格列-1
	$(".edit .layout-box .operation .delete-table-rowspan").click(function () {
		var htmls = $(this).parent().parent().find(".view-components table tbody tr");
		$(htmls).each(function(){
			$(this).children("td:last").remove();
		});
		createLayout();
	});
}

//页面选项卡滚动
var swiper = new Swiper('.my-swiper-1', {
	slidesPerView: 'auto',
	centeredSlides: false,
	spaceBetween: 0,
	freeMode: true,
	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},
});

//编辑数据时
var thisHtml = "";		//点击编辑时获取当前需要修改的布局数据
var changeHtml = "";		//点击编辑时获取当前需要修改的布局父级，以便修改完成时更换内部数据
CKEDITOR.disableAutoInline = true;
var contextHandle = CKEDITOR.replace( 'editorModalText' ,{		//编辑器插件
	language: 'zh-cn',
	contentsCss: ['/website/css/bootstrap.min.css','/website/css/swiper.min.css','/website/css/common.css',],
	height: 360,
	allowedContent: true,
	toolbar: [{
	    name: 'document',
	    items: ['Print']
	  },
	  {
	    name: 'clipboard',
	    items: ['Undo', 'Redo']
	  },
	  {
	    name: 'styles',
	    items: ['Format', 'Font', 'FontSize']
	  },
	  {
	    name: 'colors',
	    items: ['TextColor', 'BGColor']
	  },
	  {
	    name: 'align',
	    items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock']
	  },
	  '/',
	  {
	    name: 'basicstyles',
	    items: ['Bold', 'Italic', 'Underline', 'Strike', 'RemoveFormat', 'CopyFormatting']
	  },
	  {
	    name: 'links',
	    items: ['Link', 'Unlink']
	  },
	  {
	    name: 'paragraph',
	    items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote']
	  },
	  {
	    name: 'insert',
	    items: ['Image', 'Table']
	  },
	  {
	    name: 'tools',
	    items: ['Maximize']
	  },
	  {
	    name: 'editing',
	    items: ['Scayt']
	  }
	],
	
	//extraAllowedContent: 'h3{clear};h2{line-height};h2 h3{margin-left,margin-top}',
	
	// 添加拖放图像上载.
	extraPlugins: 'print,format,font,colorbutton,colordialog,justify,uploadimage',
	//uploadUrl: '/apps/ckfinder/3.4.5/core/connector/php/connector.php?command=QuickUpload&type=Files&responseType=json',
	
	// 配置文件管理器集成。本例使用CKFinder 3 for PHP.
	//filebrowserBrowseUrl: 'https://ckeditor.com/apps/ckfinder/3.4.5/ckfinder.html',		//配置选择服务图片路径
	//filebrowserImageBrowseUrl: 'https://ckeditor.com/apps/ckfinder/3.4.5/ckfinder.html?type=Images',
	//filebrowserUploadUrl: '/apps/ckfinder/3.4.5/core/connector/php/connector.php?command=QuickUpload&type=Files',
	//filebrowserImageUploadUrl: '/apps/ckfinder/3.4.5/core/connector/php/connector.php?command=QuickUpload&type=Images',

	//removeDialogTabs: 'image:advanced;link:advanced'
});

function editLayout() {
	$('.edit .layout-box .operation .edit-model').on("click",function() {
		thisHtml = $(this).parent().siblings(".view-components").html();
		changeHtml = $(this).parent().siblings(".view-components");
		contextHandle.setData(thisHtml);
	});
	//编辑后保存布局数据
	$("#saveEditorModalText").click(function() {
		var content = CKEDITOR.instances.editorModalText.getData();		//获取编辑后的内容
		changeHtml.html(content);
		createLayout();
	});
}

//编辑
function edit() {
	localStorage.setItem("pageStatus","edit");
	$(".rightLayout .layout-body .layout-box-ul").removeClass("widths");
	$(".myNavbar .navbar-right .item").eq(0).addClass("active");
	$(".myNavbar .navbar-right .item").eq(1).removeClass("active");
	$("body").addClass("edit");
	$("body").removeClass("preview");
	return false
}
	
//预览
function preview() {
	localStorage.setItem("pageStatus","preview");
	$(".rightLayout .layout-body .layout-box-ul").addClass("widths");
	$(".myNavbar .navbar-right .item").eq(0).removeClass("active");
	$(".myNavbar .navbar-right .item").eq(1).addClass("active");
	$("body").removeClass("edit");
	$("body").addClass("preview");
	return false
}

/////////////////////////////////////////// 执行自定义js开始 ///////////////////////////////////////////////////
$(document).ready(function() {

	//左侧导航点击展开
	$(".main .leftLayout .ul01 .li01").each(function(){
		//$(".main .leftLayout .ul01 .li01").eq(0).addClass("open");	//左侧菜单导航默认将第一个展开
		$(this).children('.li01-a').click(function () {
			$(this).parent().siblings().removeClass("open");
			$(this).parent().toggleClass("open");
		});
	});
	$(".main .leftLayout .ul01 .li01 .ul02 .li02").each(function(){
		$(this).children('.a').click(function(){
			$(this).parent().siblings().removeClass("open");
			$(this).parent().toggleClass("open");
		});
	});
	
	//拖动左侧菜单栏的栅栏布局
	$(".main .leftLayout .layoutRow").draggable({
		connectToSortable: ".layout-box",
		helper: "clone",
		handle: ".drag",
		revert: true ,		//释放时，是否回到原来位置（为true时下面动画才生效）
		revertDuration: 100,	//释放时，增加动画，200毫秒
		cursorAt: { left: 0 },
		snap: true,		//当设置为true或元素标签时，元素拖动到其它元素的边缘时，会自动吸附其它元素
		//开始拖动组件时
		start: function() {
		},
		//拖动组件的过程中
		drag: function() {
		},
		//拖动组件移开鼠标后
		stop: function( event, ui ) {
			handleCarouselIds();	//重新编译轮播图ID
			$(".main .rightLayout .layout-body .layout-box-ul .layout-box-li.active #ImporNotes").remove();
			removeLayout();
			//栅格布局在页面上继续拖动并嵌套在其他栅格中
			$(".layout-box .column").sortable({
				opacity: .35,
				connectWith: ".column",
				start: function() {},
				stop: function() {
					//console.log(ui.helper.context.outerHTML);
				}
			});
		}
	});
	//拖动左侧菜单栏组件部分
	$(".main .leftLayout .box").draggable({
		connectToSortable: ".column",
		helper: "clone",
		handle: ".drag",
		revert: true ,		//释放时，是否回到原来位置（为true时下面动画才生效）
		revertDuration: 100,	//释放时，增加动画，200毫秒
		cursorAt: { left: 0 },
		snap: true,		//当设置为true或元素标签时，元素拖动到其它元素的边缘时，会自动吸附其它元素
		//开始拖动组件时
		start: function() {
			$( ".layout-box" ).droppable({
				accept: ".ul02 .box",
				drop: function() {
					layer.confirm('',{
						title: '系统提示',
						area: ['280px', 'auto'],
						shade: 0.8,
						shadeClose: true,
						btn: false, //按钮
						content: '<p><i class="iconfont icon-prompt"></i></p><p>请将组件拖动到布局中，如果右侧没有布局，请先拖动左侧布局到右侧。</p>'
					});
				}
			});
		},
		//拖动组件的过程中
		drag: function() {
			
		},
		//拖动组件移开鼠标后
		stop: function(event, ui) {
			handleCarouselIds();	//重新编译轮播图ID
			handleTabsIds();	//重新编译切换卡ID
			createLayout();		//将新布局存入缓存
			handleAccordionIds();	//重新编译收缩面板ID
			removeLayout();		//删除布局函数
			editLayout();		//编辑数据函数
		}
	});
	
	//视频教程
	$("#course").click(function(){
		layer.open({
		  type: 1,
		  title: false,
		  shadeClose: true,
		  shade: 0.8,
		  skin: 'layui-layer-rim', //加上边框
		  area: ['95%', '95%'], //宽高
		  content: '<div class="panel-body" style="height:100%;"><iframe style="width:100%;height:100%;" src="/website/study.html"></iframe></div>'
		});
	});
	//修改页面
	$(".main .rightLayout .layout-body .layout-nav-ul li").each(function () {
		$(this).find(".icon-set").click(function () {
			//layer.msg(123);
			var pageId = $(this).parent().data("id");
			var pageTitle = $(this).parent().data("title");
			var pageFile = $(this).parent().data("file");
			layer.open({
				type: 1,
				title: false,
				shadeClose: true,
				shade: 0.8,
				area: ['360px', 'auto'],
				content: '<div class="panel-body">\n' +
					'<h3 class="text-center my-text-primary">修改页面信息</h3>\n' +
					'<br/>\n' +
					'  <div class="form-group">\n' +
					'    <p><strong>页面名称</strong></p>\n' +
					'    <input id="page_name" type="text" class="form-control" value="'+pageTitle+'">\n' +
					'  </div>\n' +
					'  <div class="form-group">\n' +
					'    <p><strong>文件名称</strong><span class="text-muted">（英文或英文数字组合）</span></p>\n' +
					'    <input id="file_name" type="text" onKeyUp="value=value.replace(/[\\W]/g,\'\')" class="form-control" value="'+pageFile+'">\n' +
					'  </div>\n' +
					'  <div class="form-group">\n' +
				'  		 <a href="javascript:;" class="btn btn-primary btn-block my-btn-primary" id="edit_page">提交修改</a>\n' +
					'  </div>\n' +
					'<br/>\n' +
					'</div>'
			});
			$("#edit_page").click(function () {
				var pageName = $("#page_name").val();
				var fileName = $("#file_name").val();
				if(pageName && fileName){
					$.ajax({
						url:"/request/page.php",
						type:"post",
						data:{pageId:pageId, pageName:pageName, fileName:fileName, type:'edit'},
						dataType:"json",
						success:function(res){
							if(res.status === 0){
								layer.msg(res.msg);
							}else{
								layer.msg(res.msg);
								setTimeout(function () {
									window.location.reload();
								},500);
							}
						}
					});
				}else{
					layer.msg('请输提交完整信息');
				}
			});
		});
	});
	//删除页面
	$(".main .rightLayout .layout-body .layout-nav-ul li").each(function () {
		$(this).find(".icon-guanbi").click(function () {
			var pageId = $(this).parent().data("id");
			layer.confirm('当前页面删除后不可恢复，确定删除当前页面吗？', {
				title: '系统提示',
				area: ['280px', 'auto'],
				shade: 0.8,
				btn: ['确定','取消'] //按钮
			}, function(){
				$.ajax({
					type:"post",
					url:"/request/page.php",
					data: {pageId:pageId,type:'delete'},
					dataType:"json",
					success: function (res) {
						if(res.page){
							//遍历页面现在的布局，然后重新存入缓存中
							$(".main .rightLayout .layout-body .layout-box-ul .layout-box-li").each(function () {
								if($(this).data("id") === parseInt(res.page)){
									$(this).remove();
								}
							});
							createLayout();
							layer.msg(res.msg);
							setTimeout(function () {
								window.location.reload();
							},500);
						}else{
							layer.msg('网络错误');
						}
					}
				});
			});
		});
	});
	//下载
	$("#download").click(function () {
		var uid = $(this).data("uid");
		var download_number = $(this).data("money");
		var layoutHistory = JSON.parse(localStorage.getItem("layoutData"));
		var downloads = {};
		downloads.data = [];
		var data = {};
		data.pages = [];
		$.each(layoutHistory,function(index1,value1){
			$.each(value1,function(index2,value2){
				downloads.data.push({titles:value2.title, files:value2.file});
				var contents = value2.content;
				var titles = value2.title;
				var ids = value2.id;
				var files = value2.file;
				$(contents).each(function(){
					$(this).find(".box, .layoutRow").removeAttr("style");
					$(this).find(".operation").remove();
					$(this).find(".title").remove();
					$(this).find(".column").removeClass("column");
					$(this).find(".ui-sortable").removeClass("ui-sortable");
					$(this).find(".ui-draggable").removeClass("ui-draggable");
					$(this).find(".row-fluid").removeClass("row-fluid");
					$(this).find(".title").remove();
					$($(this).find(".view-components")).each(function(){
						$(this).parent().replaceWith($(this).html());
					});
					$($(this).find(".view-layout")).each(function(){
						$(this).parent().replaceWith($(this).html());
					});
					//更改图片路径
					$($(this).find("img")).each(function(){
						var src = $(this).attr("src");
						src = src.replace("/","../");
						$(this).attr("src",src);
					});
					$(this).removeClass("layout-box");
					$(this).removeClass("ui-sortable");
					contents = $(this)[0].outerHTML;
					data.pages.push({title:titles,content:contents,id:ids,file:files});
				});
				
			});
		});
		
		if(uid){
			if(download_number < 1){
				layer.confirm('',{
					title: '系统提示',
					area: ['280px', 'auto'],
					shade: 0.8,
					shadeClose: true,
					btn: ['立即充值'], //按钮
					content: '<p><i class="iconfont icon-prompt"></i></p><p>剩余下载'+download_number+'次，请充值（10元/次）</p>'
				}, function(){
					window.open("https://item.taobao.com/item.htm?id=612069977501");
				});
			}else{
				$.ajax({
					type:"post",
					url:"/request/download_file/created_html.php",
					data: data,
					dataType:"json",
					success: function (res) {
						if(res.filePath){
							layer.confirm('你的文件已经打包好了，是否下载？', {
								btn: ['立即下载','取消'] //按钮
							}, function(){
								layer.close(layer.index);	//关闭提示层
								downloads.file_path = res.filePath;		//获取打包好的文件夹路径
								$.ajax({
									type:"post",
									url:"/request/download_file/downloads.php",
									data: downloads,
									dataType:"json",
									success: function (res) {
										$("#download-number").html(res.money);
									}
								});
								window.location.href=res.filePath;	//下载打包好的压缩包
							});
						}
					}
				});
			}
		}else{
			layer.confirm('',{
				title: '系统提示',
				area: ['280px', 'auto'],
				shade: 0.8,
				shadeClose: true,
				btn: false, //按钮
				content: '<p>请登录后再下载，<a class="login-box" href="javascript:;" style="color:#1890ff;">立即登录</a></p>'
			});
			$(".login-box").on('click', function() {
				layer.close(layer.index);	//关闭当前层
				layer.open({
					type: 2,
					title: false,
					shadeClose: true,
					shade: 0.8,
					area: ['360px', '400px'],
					content: ['?m=login', 'no']
				});
			});
		}
	});
	//清空页面
	$("#clear").click(function () {
		var layoutHistory = JSON.parse(localStorage.getItem("layoutData"));
		var thisID = $(".layout-box-ul .layout-box-li.active").data("id");
		layer.confirm('',{
			title: '系统提示',
			area: ['280px', 'auto'],
			shade: 0.8,
			shadeClose: true,
			btn: ['确定','取消'], //按钮
			content: '<p><i class="iconfont icon-prompt"></i></p><p>当前页面请空后不可恢复，确定清空当前页面吗？</p>'
		}, function(){
			if(layoutHistory){
				var data = {};
				data.pages = layoutHistory.pages;
				$(data.pages).each(function () {
					if($(this)[0].id === thisID){
						$(this)[0].content = '<div class="layout-box ui-sortable container"><div id="ImporNotes">请拖动到此区域内</div></div>';
					}
				});
				localStorage.setItem("layoutData",JSON.stringify(data));
				readLayout();
				initContainer();
				layer.msg('当前页面已清空');
			}else{
				layer.msg('还未开始制作页面，不需要清空');
			}
		});
	});
	//有何建议弹出层
	$("#advise").click(function () {
		layer.open({
			type: 1,
			shade: 0.8,
			title: '系统提示',
			area: ['280px', 'auto'],
			shadeClose: true,
			content: '<div class="panel-body"><p>有任何建议与问题均可与管理员联系</p><p>微信：wk_0924</p><p>QQ：1366576343</p></div>'
		});
	});
	//新增页面
	$("#add").on('click', function() {
		layer.open({
			type: 1,
			title: false,
			shadeClose: true,
			shade: 0.8,
			area: ['360px', 'auto'],
			content: '<div class="panel-body">\n' +
				'<h3 class="text-center my-text-primary">新增页面</h3>\n' +
				'<br/>\n' +
				'  <div class="form-group">\n' +
				'    <p><strong>页面名称</strong></p>\n' +
				'    <input id="page_name" type="text" class="form-control" placeholder="制作时网页的标题">\n' +
				'  </div>\n' +
				'  <div class="form-group">\n' +
				'    <p><strong>文件名称</strong><span class="text-muted">（英文或英文数字组合）</span></p>\n' +
				'    <input id="file_name" type="text" onKeyUp="value=value.replace(/[\\W]/g,\'\')" class="form-control" placeholder="下载时网页文件的名称（如：index 或 index01）">\n' +
				'  </div>\n' +
				'  <div class="form-group">\n' +
			'  		 <a href="javascript:;" class="btn btn-primary btn-block my-btn-primary" id="add_page">确定新增</a>\n' +
				'  </div>\n' +
				'<br/>\n' +
				'</div>'
		});
		$("#add_page").click(function () {
			var pageName = $("#page_name").val();
			var fileName = $("#file_name").val();
			if(pageName && fileName){
				$.ajax({
					url:"/request/page.php",
					type:"post",
					data:{pageName: pageName,fileName: fileName,type:'add'},
					dataType:"json",
					success:function(res){
						if(res.status === 0){
							layer.msg(res.msg);
						}else{
							layer.msg(res.msg);
							setTimeout(function () {
								window.location.reload();
							},500);
						}
					}
				});
			}else{
				layer.msg('请输提交完整信息');
			}
		});
	});
	//登录弹出层
	$(".login-box").on('click', function() {
		layer.open({
			type: 2,
			title: false,
			shadeClose: true,
			shade: 0.8,
			area: ['360px', '400px'],
			content: ['?m=login', 'no']
		});
	});
	//注册弹出层
	$(".register-box").on('click', function() {
		layer.open({
			type: 2,
			title: false,
			shadeClose: true,
			shade: 0.8,
			area: ['360px', '400px'],
			content: ['?m=register', 'no']
		});
	});
	//退出系统
	$(".logout").click(function (){
		$.ajax({
			url:"/request/logout.php",
			type:"post",
			data:{logout: 'yes'},
			dataType:"json",
			success:function(res){
				var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
				if (keys){
					for (var i = keys.length; i--;) {
						//清除当前域名下的,例如：m.abc.com
						document.cookie = keys[i] + '=0;path=/;expires=' + new Date(0).toUTCString();
						//清除当前域名下的，例如 .m.abc.com
						document.cookie = keys[i] + '=0;path=/;domain=' + document.domain + ';expires=' + new Date(0).toUTCString();
						//清除一级域名下的或指定的，例如 .abc.com
						document.cookie = keys[i] + '=0;path=/;domain=kevis.com;expires=' + new Date(0).toUTCString();
					}
				}
				layer.msg(res.msg);
				setTimeout(function (){
					window.location.reload();
				},500);
			}
		});
	});
	
	readLayout();	//读取缓存中的布局数据重新渲染页面
	removeLayout();		//删除布局函数
	editLayout();		//编辑数据函数
	initContainer();	//拖动组件函数
	
	//重新宣传完页面后，再执行收缩面板效果
	$(".rightLayout .panel-group .panel").each(function() {
		$(this).find('.panel-title a').click(function () {
			var _this = $(this);
			$(_this).parent().parent().siblings('.panel-collapse').slideToggle(200);
		})
	});
	
	//获取页面状态（预览还是编辑）执行不同的状态函数
	var pageStatus = localStorage.getItem("pageStatus");
	if(pageStatus && pageStatus == 'preview'){
		preview();
	}else{
		edit();
	}
	
});

}	//判断浏览器支持localStorage的逻辑结束