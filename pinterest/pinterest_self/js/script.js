window.onload = function(){

// 第一步：页面加载时，对所有图片进行静态布局	
	waterfall('main','box');	//对main中的所有图片所在的div(class为box)做操作


// 第二部：监听滚动条，加载更多图片
	var dataInt = {"data":[{"src":'0.jpg'},{"src":'1.jpg'},{"src":'2.jpg'},{"src":'3.jpg'},{"src":'4.jpg'}]};
	window.onscroll=function(){
		if (checkScrollSlide()) {
			var oParent = document.getElementById('main');

			// 加载后台的更多数据, 数据块渲染到页面尾部
			for(var i=0; i<dataInt.data.length; i++){
				var oBoxNew = document.createElement('div');
				oBoxNew.className = 'box';

				//将新产生的div添加到父元素main的后面
				oParent.appendChild(oBoxNew);			//放数据块的div class=box创建好了

				var oPicNew = document.createElement('div');	//创建放图片的div class=pic，并追加到box尾部
				oPicNew.className = 'pic';
				oBoxNew.appendChild(oPicNew);

				var oImgNew = document.createElement('img');	//创建新图片img，设置src路径，并追加到pic的div尾部
				oImgNew.src = "../images/" + dataInt.data[i].src;	
				oPicNew.appendChild(oImgNew);
			}

			// 追加内容后，重新调用waterfall函数，对所有图片进行静态布局	
			waterfall('main','box');
		}
	}
}

function waterfall(parent, box){
	//将main下的所有class为box的元素取出来
	var oParent = document.getElementById(parent);
	//获取id=oParent下所有class为box的元素
	var oBoxs = getByClass(oParent, 'box');
	//计算页面显示的列数（页面宽/box的宽）
	var oBoxW = oBoxs[0].offsetWidth;					//瀑布流等宽不等高；故获取第一个元素宽度即可。offsetWidth获取自身宽度。
	var cols = Math.floor(document.documentElement.clientWidth / oBoxW)		//页面列数取整。用到获取列面宽。
	//设置main的宽度；并使内容居中
	oParent.style.cssText = 'width:' + oBoxW*cols + 'px; margin: 0 auto';

	//存放每一列高度的数组
	var hArr = [];
	for (var i = 0; i < oBoxs.length; i++) {
		if (i<cols) {							//如果是第一列，则保存第一列的所有box的高度
			hArr.push(oBoxs[i].offsetHeight);
		}else{									//不是第一列，则要高度顺序，放置每个box
			var minH = Math.min.apply(null, hArr);	
			//apply(thisScope, args)，设置apply(null,Arr),即改变this指向，获取hArr[]中的最小值
			var index = getMinhIndex(hArr, minH);	//获取最小高度的索引值
			
			oBoxs[i].style.position = 'absolute';
			oBoxs[i].style.top = minH + 'px';				//下一张图片高度为上一排最低图片高

			//获取下一张图片距左边的距离，有两种方法
			//oBoxs[i].style.left = index * oBoxW + 'px';			//第一种方法：距离左边index个宽度的距离
			oBoxs[i].style.left = oBoxs[index].offsetLeft + 'px';	//第二种方法：即为高度最小的box距离左边的宽度

			hArr[index] += oBoxs[i].offsetHeight;
			//这里要修改之前高度最小的box的高度，当下面放有下一张图片后，原来的最小高度变为原高度+放置的图片的高度。
		}
	}
}

//根据class获取元素
function getByClass(parent, clsName){
	var boxArr = new Array(),  			//存取所有class=box的元素
		oElements = parent.getElementsByTagName('*');	//指定名称是，获取特定名称的元素；不指定名称获取所有元素

	//遍历所有元素，当类名与传入的类名相同时，将元素压入boxArr；并返回。
	for (var i = 0; i < oElements.length; i++) {
		if (oElements[i].className == clsName) {
			boxArr.push(oElements[i]);
		}
	}
	return boxArr;
}

//获取最小值在整个数组中的索引值
function getMinhIndex(arr, val){
	for(var i in arr){
		if (arr[i]==val){
			return i;
		}
	}
}

// 检测是否具备了滚动条加载数据库的条件
function checkScrollSlide(){
	var oParent = document.getElementById('main');
	var oBoxs   = getByClass(oParent, 'box');
	//获取最后一个box距离内容区顶部的高度，这里设置最后一个box显示一半时，加载更多
	//故变化时的高度为两者相加，加上最后一个box一半的高度
	var lastBoxH = oBoxs[oBoxs.length - 1].offsetTop + Math.floor(oBoxs[oBoxs.length-1].offsetHeight / 2);

	// 参考距离为，页面浏览器的高度+向上滚动过的距离
	//混杂模式下，通过body获取滚走的距离；标准模式下，通过documentElement获取滚走的距离
	var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;		//滚走高度
	var height = document.body.clientHeight || document.documentElement.clientHeight;	//浏览器高度

	// 当显示最后一个box时的高度小于滚走距离+浏览器高度时，加载鞥多
	return (lastBoxH < scrollTop+height) ? true : false;
}