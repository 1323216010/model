
function p(oldW,oldH) {

	//定义开关变量,用于控制图片是否跟随鼠标移动
	let canMove = false;
	//在开始拖拽时,就保存鼠标距div左上角的相对位置
	
	var eleImg = document.querySelector('#reviewImg');
	var store = {
		scale: 1
	};
	var getScale = 1;
	let offsetX, offsetY,offsetH = $("#reviewImg").offset().top,offsetW = $("#reviewImg").offset().left;
	// 缩放事件的处理
	eleImg.addEventListener('touchstart', function(event) {
		//可以开始拖动
		canMove = true;
		
		var touches = event.touches;
		var events = touches[0];
		var events2 = touches[1];

		event.preventDefault();

		// 第一个触摸点的坐标
		store.pageX = events.pageX;
		store.pageY = events.pageY;
		
		offsetX = events.pageX;
		offsetY = events.pageY;
		offsetW = $("#reviewImg").offset().left ;
		offsetH = $("#reviewImg").offset().top ;
	
        


		store.moveable = true;

		if (events2) {
			store.pageX2 = events2.pageX;
			store.pageY2 = events2.pageY;
		}

		store.originScale = store.scale || 1;
	});
	document.addEventListener('touchmove', function(event) {
		if (!store.moveable) {
			return;
		}

		event.preventDefault();

		var touches = event.touches;
		var events = touches[0];
		var events2 = touches[1];


		// 双指移动
		if (events2) {
			// 第2个指头坐标在touchmove时候获取
			if (!store.pageX2) {
				store.pageX2 = events2.pageX;
			}
			if (!store.pageY2) {
				store.pageY2 = events2.pageY;
			}

			// 获取坐标之间的举例
			var getDistance = function(start, stop) {
				return Math.hypot(stop.x - start.x, stop.y - start.y);
			};
			// 双指缩放比例计算
			var zoom = getDistance({
					x: events.pageX,
					y: events.pageY
				}, {
					x: events2.pageX,
					y: events2.pageY
				}) /
				getDistance({
					x: store.pageX,
					y: store.pageY
				}, {
					x: store.pageX2,
					y: store.pageY2
				});
			// 应用在元素上的缩放比例
			var newScale = store.originScale * zoom;
			// 最大缩放比例限制
			if (newScale > 3) {
				newScale = 3;
			}else if(newScale < 1){
				newScale = 1;
			}
			// 记住使用的缩放值
			store.scale = newScale;
			// 图像应用缩放效果
			eleImg.style.transform = 'scale(' + newScale + ')';
			getScale = newScale;
			
		} else {
			//只有当pop可以移动时
			
			if (canMove == true) {
				//让pop跟随鼠标移动
				//开始拖拽时，立刻获得鼠标距图片左上角的相对位置
				//求pop的top和left
				let left = events.pageX - offsetX + offsetW + oldW*((getScale-1)/2);
				let top =  events.pageY - offsetY + offsetH + oldH*((getScale-1)/2);
				console.log("110 - ",oldW,oldH)
				// console.log(getScale)
				
				// let left = events.pageX - offsetX + offsetW ;
				// let top =  events.pageY - offsetY + offsetH ;
				
				
				
				
				//设置pop的top和left属性
				eleImg.style.left = left + "px";
				eleImg.style.top = top + "px";
			}
		}
	});

	document.addEventListener('touchend', function() {
		store.moveable = false;
		//停止拖拽
		canMove = false
		delete store.pageX2;
		delete store.pageY2;
	});
	document.addEventListener('touchcancel', function() {
		store.moveable = false;
		//停止拖拽
		canMove = false
		delete store.pageX2;
		delete store.pageY2;
	});

}

// 获取地址栏参数
function getQueryVariable(variable) {
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split("=");
		if (pair[0] == variable) {
			return pair[1];
		}
	}
	return (false);
}

function getDate() {
	let date = Date.now();
	return date;
}

//合成两张base64
function drawAndShareImage(bgsrc, src) {
	let canvas = document.createElement('canvas');
	canvas.width = video.offsetWidth;
	canvas.height = video.offsetHeight;
	let context = canvas.getContext('2d');

	context.rect(0, 0, canvas.width, canvas.height);
	let bgImg = new Image();
	bgImg.src = bgsrc; // 背景图的url
	bgImg.crossOrigin = 'Anonymous';
	bgImg.onload = () => {
		context.drawImage(bgImg, 0, 0, video.offsetWidth, video.offsetHeight);
		let img = new Image();
		img.src = src; // 需要合进去的图片url
		img.crossOrigin = 'Anonymous';
		img.onload = () => {
			context.drawImage(img, 0, 0, video.offsetWidth, video.offsetHeight);
			let base64 = canvas.toDataURL('image/png');

			$('#img')[0].setAttribute('src', base64)
			$('#img_dialog').show()
			// console.log(base64); // 这个就是合成后的图片链接，如果需要上传请查看我另外的文章
		}
	}
}

// 手机类型判断
var ua = navigator.userAgent;
var ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
	isIphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
	isAndroid = ua.match(/(Android)\s+([\d.]+)/),
	isMobile = isIphone || isAndroid;

function is_weixn() {

	var ua = navigator.userAgent.toLowerCase();

	if (ua.match(/MicroMessenger/i) == "micromessenger") {

		return true;

	} else {

		return false;

	}

}
