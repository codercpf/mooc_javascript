$(window).on('load',function(){
//先进行静态页面布局	
	waterfall();

//向下滚动时加载更多
	var dataInt = {"data":[{"src":'1.jpg'},{"src":'2.jpg'},{"src":'3.jpg'},{"src":'4.jpg'}]};	
	
	window.onscroll = function(){
		if(checkScrollSlide()){			//具备加载更多的条件

			//每遍历一个对象，创建一个box盒子，并填充显示图片
			$.each(dataInt.data, function(key,value){
				var $oBox = $('<div>').addClass('pin').appendTo($('#main'));	  //创建class=box的div,并追加在id=main中,使用了连缀操作
				var $oPic = $('<div>').addClass('box').appendTo($oBox);	  //创建pic的div,追加在box的div中
				var $oImg = $('<img>').attr('src','../images/' + $(value).attr('src'));	  //attr(attributeName,value),设置属性值；只有attributeName时获取属性值
				$oImg.appendTo($oPic);
	
	//Jquery方法只能对Jquery对象进行操作；故任何对象都要先转为Jquery()对象。
	//用$(),即Jquery中的查找方法
				//console.log($(value).attr('src'));
			});
			waterfall();
		};
	}

	// $(window).on('scroll',function(){})
});


/*
	waterfall()函数没问题	
*/
//1、设置图片的静态布局样式
function waterfall(){
	var $boxs = $('#main>div');			//找到id=main下的所有一级div
	var w=$boxs.eq(0).outerWidth();		//瀑布流等宽不等高；取第一个元素div的宽度; autowidth()包含div的padding、margin等；width()不包含
	var cols =Math.floor($(window).width() / w);	//计算出列数，窗体没有Padding/Margin值，故width()取页面窗体宽；除以每列宽，得列数
	
	//JQuery方法有参数时设置属性值，无参数时取值；
	$('#main').width(w*cols).css('margin','0 auto');   //这里用到级联写法

	var hArr=[];	//存放高度的数组

	//each()方法的匿名函数function(index,value)中，index为遍历的索引，value为遍历的值
	$boxs.each(function(index, value){
		var h=$boxs.eq(index).outerHeight();	//获取当前索引列的高度
		if (index < cols) {					    //当索引小于列数时，说明是第一行，存下每列高度值
			hArr[index] = h;
		}else{					//不是第一行的列，把它放在上一行高度最小的列的下面
			var minH = Math.min.apply(null, hArr);		//apply()获取上一行最小高度列的高
			var minHIndex = $.inArray(minH, hArr);	//$.inArray(value, array)查询value在array()数组中的索引

			//此时，遍历过的元素都在value中存放着。
			// console.log(value);
			//它是DOM元素，不能直接设置css样式，需要用$()方法转为Jquery对象
			
			$(value).css({
				'position':'absolute',
				'top':minH + 'px',
				'left':minHIndex * w + 'px',
			});
			//最后设置上一行高度最小的列高为，之前列高+追加的新box的高度
			hArr[minHIndex] += $boxs.eq(index).outerHeight();

/*
			//方法二：源码中
			$(value).css({
				'position':'absolute',
				'top': minH + 15,
				'left': $boxs.eq(minHIndex).position().left
			});
			//数组 最小元素的高 + 添加的boxs[i]块框高
			hArr[minHIndex] += $boxs.eq(index).height() + 15;
*/
		}
	});
	// console.log(hArr);
}


/*
checkScrollSlide()函数没问题
*/
//监听是否满足加载更多的条件
function checkScrollSlide(){
	var $lastBox=$('#main>div').last();		//获取id=main下最后一个box元素
/*
	// 获取最后一个元素滚动的距离，即偏离页面内容顶部的距离 + 自身高度的一半	
	var lastBoxDis = $lastBox.offset().top + Math.floor($lastBox.outerHeight()/2);		//调用offset()函数获取相应属性的值，top/left等
	// console.log("1、"+lastBoxDis);
*/
	
	//方法二：源码中
	//新解：创建【触发添加块框函数waterfall()】的高度：
	//最后一个块框网页顶部的距离+自身高度的一半（实现未滚到底就开始加载）
	var lastBoxDis = $lastBox.get(0).offsetTop + Math.floor($lastBox.outerHeight()/2);


	var scrollTop = $(window).scrollTop();	// 获取页面滚走的距离，直接用scrollTop()属性获取
	// console.log("2、"+scrollTop);
	
/*
	var documentH = $(document).height();		//页面高度——————此处错误
	// console.log("3、"+documentH);
*/
	
	// 这里必须为width()，不解为什么。如果是height()则页面滚动时，不能到底部就会加载
	var documentH = $(document).width();	

	return (lastBoxDis < scrollTop + documentH) ? true : false;
}