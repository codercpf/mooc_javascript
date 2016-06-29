window.onload = function(){
	var obtn = document.getElementById('btn');
	var timer = null;
	var isTop = true;

	// 获取页面可是区域的高度
	var clientHeight = document.documentElement.clientHeight;

	window.onscroll = function(){
		var osTop = document.documentElement.scrollTop || document.body.scrollTop;
		if (osTop >= clientHeight) {
			obtn.style.display = 'block';
		}else{
			obtn.style.display = 'none';
		}

		//判断如果是顶部，清除定时器，暂停滚动
		if (!isTop) {
			clearInterval(timer);
		}
		isTop = false;
	}

	obtn.onclick = function(){
		timer = setInterval(function(){
			//获取滚动条距离顶部的高度
			var osTop = document.documentElement.scrollTop || document.body.scrollTop;
			var iSpeed = Math.floor(-osTop / 6);
			document.documentElement.scrollTop = document.body.scrollTop = osTop + iSpeed;

			isTop = true;
			//当滚动到顶部时，清除定时器
			if (osTop == 0) {
				clearInterval(timer);
			}
		},30);
	}
}