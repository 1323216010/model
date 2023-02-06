var getPicList, getGoodsList, getColorList, getId, getImg, getGoodsName, getColor = "#ffffff";
var windowWidth = window.innerWidth - 40;
var fav_img;
var yl_img = '',
	ys_img = '';
var maskPic, customColor, customPic, linePic;
var outputImgW, outputImgH;
var runP = false;
var imgMaxNum = 4;//canvas中最大图层数量，包含底层图+可选图


//监听网络
var offline = false;
window.addEventListener('online', () => {
	console.log("联网")
	offline = false;
})
window.addEventListener('offline', () => {
	console.log("断网")
	offline = true;
})

$("#colorValText").val("#ffffff");

const cvs = document.getElementById('Canvas');

var ratio = window.devicePixelRatio

const devicePixelRatio = ratio; //为了保持原图分辨率，canvas必须乘上手机屏幕的自身的像素放大倍数

cvs.width = windowWidth * devicePixelRatio // 设置画布宽度
cvs.height = windowWidth * devicePixelRatio // 设置画布高度  注意:不要加单位


const ctx = cvs.getContext('2d')

ctx.fillStyle = "#FF0000";
ctx.fillRect(10, 10, 80, 80);


var canvas = new fabric.Canvas('Canvas', {
	preserveObjectStacking: true
});
var color = '';

var custom_goods_id = getQueryVariable('3d_goods_id');


function init() {
	//口罩列表
	getGoodsList = [{
		height: 1110,
		id: 11,
		image: "../uploads/images/20220909161904108242312.png",
		image_url: "../uploads/images/202208221620049d3f70943.jpg",
		kz_img: "../uploads/images/20220909161914d56975949.png",
		logo: "../images/common_1_2.png",
		name: "定制医用外科",
		price: "0.35",
		width: 1045
	}];

	getId = getGoodsList[0].id;
	getGoodsName = getGoodsList[0].name;

	maskPic = getGoodsList[0].kz_img;
	outputImgW = getGoodsList[0].width;
	outputImgH = getGoodsList[0].height;
	console.log('outputImgW:', outputImgW, ' / outputImgH:', outputImgH);
	// add_canvas_bg(getGoodsList[0].image);	
	// add_canvas_bg("images/3d.png");	

	// 设置口罩遮罩图,此图示意用，实际不会渲染到canvas
	$(".logoBox").attr("src", getGoodsList[0].logo);
	$(".maskTop").attr("src", getGoodsList[0].image); //正式版图片
	linePic = getGoodsList[0].image;

	// $(".maskTop").attr("src", 'images/3d_11.png'); //测试用图片，正式版直接注释掉



	// $(".maskTop").css({"left":20*devicePixelRatio,"width":"calc(100vw - "+ 40*devicePixelRatio +"px)"}); //测试用图片，正式版直接注释掉

	$(".maskTitle").text(getGoodsName);
	for (var i in getGoodsList) {
		$(".maskBox").append('<div class="maskFlex" id="' + getGoodsList[i].id + '" data-name="' +
			getGoodsList[i]
				.name + '" data-outW="' + getGoodsList[i].width + '" data-outH="' + getGoodsList[i]
				.height + '" data-img="' + getGoodsList[i].image + '" data-kzimg="' + getGoodsList[
					i]
				.kz_img + '"data-logoimg="' + getGoodsList[i].logo + '"><img class="maskImg"  src="' +
			getGoodsList[i]
				.image_url +
			'" /><div  class="maskListTitle">' + getGoodsList[i].name +
			'</div><div class="maskListPrice"> </div></div>')
	}
	//getGoodsList[i].price

	// 图片列表
	getPicList = [
		{
			"id": 6,
			"image_url": "../uploads/images/2022092909441081c8a1174.jpg"
		},
		{
			"id": 58,
			"image_url": "../uploads/images/202211211244380f0ce0036.jpg"
		},
		{
			"id": 56,
			"image_url": "../uploads/images/2022112112380443a788646.jpg"
		},
		{
			"id": 57,
			"image_url": "../uploads/images/2022112112440768b224601.jpg"
		},
		{
			"id": 55,
			"image_url": "../uploads/images/2022112112370837d4a3392.jpg"
		},
		{
			"id": 36,
			"image_url": "../uploads/images/20220929094433178970436.jpg"
		},
		{
			"id": 38,
			"image_url": "../uploads/images/20220929094433637ed4289.jpg"
		},
		{
			"id": 39,
			"image_url": "../uploads/images/2022092909443357b044596.jpg"
		},
		{
			"id": 40,
			"image_url": "../uploads/images/2022092909444836e256980.jpg"
		},
		{
			"id": 41,
			"image_url": "../uploads/images/20220929094433e5f5d0583.jpg"
		},
		{
			"id": 18,
			"image_url": "../uploads/images/202209290944483632c5674.jpg"
		}
	];
	// console.log(getPicList);
	for (var i in getPicList) {
		$(".picListBox ul").append('<li class="noSltPic" id="pic_' + getPicList[i].id +
			'" data-modurl=""><img id="pic_img' + getPicList[i].id + '" src="' + getPicList[i]
				.image_url +
			'" class="" /></li>')
		if (i == getPicList.length - 1) {
			//检测最后一张图片是否加载完成
			document.getElementById("pic_img" + getPicList[i].id).onload = function () {
			}
		}
	}



	//默认显示图片
	customPic = getPicList[0].image_url;

	const canvas1 = document.createElement("canvas")
	const ctx = canvas1.getContext("2d")
	canvas1.width = canvas.width;
	canvas1.height = canvas.height;
	ctx.fillStyle = "#ffffff";
	customColor = "#ffffff";


	ctx.fillRect(0, 0, canvas.width, canvas.height);
	add_img_canvas(canvas1.toDataURL("image/jpg"), "autoColor");//加载底色图

	add_img_canvas(customPic)//加载图片列表的第一张图


	$(".picListBox ul li:first").removeClass("noSltPic");
	$(".picListBox ul li:first").addClass("sltPic");

	//颜色列表
	getColorList = [{ color_val: "#FFFFFF", id: 2, name: "白色" }];
	//更换口罩颜色
	// const canvas1 = document.createElement("canvas")
	// const ctx = canvas1.getContext("2d")
	// canvas1.width = canvas.width;
	// canvas1.height = canvas.height;
	// ctx.fillStyle = getGoodsList[0].color.color_val;
	// customColor = getGoodsList[0].color.color_val;
	// ctx.fillRect(0, 0, canvas.width, canvas.height);
	// add_img_canvas(canvas1.toDataURL())
	for (var i in getColorList) {
		$(".colorSltBox").append('<div  data-color="' + getColorList[i].color_val +
			'" class="colorBox"><div style="flex:2"  data-color="' + getColorList[i].color_val +
			'"><div class="colorValBox" style = "margin: auto;border: #000 1px solid;width: 40px;height: 40px;border-radius: 40px;background:' +
			getColorList[i].color_val + '"></div></div><div  class="maskColorName">' +
			getColorList[i].name + '</div></div>')
	}


	document.getElementById("Canvas").style.width = windowWidth + "px";
	document.getElementById("Canvas").style.height = windowWidth + "px";
}
init()

function maskMash(maskPic) {

	//加载蒙版
	fabric.Image.fromURL(maskPic, (imgg) => {
		imgg.set({

			absolutePositioned: true, //true设置蒙版固定不动
			// scaleX: canvas.width / imgg.width,
			// scaleY: canvas.height / imgg.height,
			scaleX: (canvas.width - 20 * devicePixelRatio) / imgg.width,
			scaleY: ((canvas.width - 20 * devicePixelRatio) / imgg.height) / (imgg.width / imgg.height),
			left: 10 * devicePixelRatio,
			top: 10 * devicePixelRatio,
		});
		imgg.center();

		var clipPath = imgg;

		canvasPath = imgg;
		console.log(canvasPath)

		let el = canvas.getObjects();

		let cg = canvas.getActiveObject();

		el.forEach(item => {
			if (item.cacheKey != '' && item.cacheKey != undefined) {
				console.log(item.clipPath)
				item.clipPath = clipPath;
				// item.clipPath = null;
			}
			if (item.text != '' && item.text != undefined) {

				console.log("有文字", el.length)

				// cg.moveTo(el.length - 1)
				item.bringForward()

				canvas.renderAll()


			} else {
				console.log("没文字")
				canvas.renderAll()
			}
		})

	});

}

//口罩点击切换
$(".maskBox ").click(function (e) {
	// console.log($(e.target).parent()[0]);
	getId = $(e.target).parent()[0].id;
	getGoodsName = $(e.target).parent()[0].dataset.name;
	var img = $(e.target).parent()[0].dataset.img;
	var logoImg = $(e.target).parent()[0].dataset.logoimg;
	var kzimg = $(e.target).parent()[0].dataset.kzimg;
	outputImgW = $(e.target).parent()[0].dataset.outw;
	outputImgH = $(e.target).parent()[0].dataset.outh;
	// console.log(outputImgW, outputImgH)
	// add_canvas_bg(img);	
	maskPic = kzimg;
	// 
	maskMash(maskPic);
	if (customPic) {
		// add_img_canvas(customPic);
	} else {
		// changColor(customColor);
	}
	// 
	$(".logoBox").attr("src", logoImg);
	$(".maskTop").attr("src", img);
	linePic = img;
	$(".maskTitle").text(getGoodsName);
	$("#maskSlt").animate({
		"bottom": "-70%"
	});
	$(".maskBox").scrollTop(0);
	if (detect() != 'android') {
		iNoBounce.disable();
	}

});

// 图片点击切换
$(".picListBox ul ").click(function (e) {

	let el = canvas.getObjects();

	var elen = el.length;


	// console.log(el)

	el.forEach(item => {


		if (item.text != '' && item.text != undefined) {
			hasText = true
		} else {

		}
	})

	console.log(elen, imgMaxNum)
	if (hasText) {
		if (elen > imgMaxNum) {
			// alert("图片已达到3张上限")
			showErrBox("图片已达3张上限，如需继续上传，请点击左上角删除原图后可继续上传")
			return
		}
	} else {
		if (elen > imgMaxNum - 1) {
			// alert("图片已达到3张上限")
			showErrBox("图片已达3张上限，如需继续上传，请点击左上角删除原图后可继续上传")
			return
		}
	}

	if ($(e.target).parent().siblings().prop("tagName") == "LI") {
		$(e.target).parent().siblings().removeClass("sltPic");
		$(e.target).parent().siblings().addClass("noSltPic");
		$(e.target).parent().addClass("sltPic");
		$(e.target).parent().removeClass("noSltPic");

		// var imgElement = document.getElementById();
		// console.log(e)
		customPic = e.target.src;
		add_img_canvas(e.target.src);
	} else {
		//				console.log("没点在按钮上")
	};
});


function changColor(getColor) {
	//更换口罩颜色
	const canvas1 = document.createElement("canvas")
	const ctx = canvas1.getContext("2d")
	canvas1.width = canvas.width;
	canvas1.height = canvas.height;
	ctx.fillStyle = getColor;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	// console.log($('.picList li'))
	$("#colorIco").css({
		"background": getColor
	});

	add_img_canvas(canvas1.toDataURL('image/jpg'))
}


//颜色点击切换

$("#sendColor").click(function (e) {

	getColor = $("#colorValText").val();

	if (getColor) {
		customPic = null;
		customColor = getColor;
		changColor(getColor);

		//取消图案选择
		$(".picListBox ul li").siblings().removeClass("sltPic");
		$(".picListBox ul li").siblings().addClass("noSltPic");

		$("#maskColorSlt").animate({
			"bottom": "-50%"
		});
	}

});

// 上传图片
$("#uploadPic").click(function (e) {
	// $("#upLoadBox").animate({
	// 	"bottom": "0"
	// })
	// console.log($("#upimg"));

	return $("#upimg").click();
});

//小程序中图片上传
$("#upimg").change(function (e) {
	console.log("开始上传")
	var files = e.currentTarget.files;
	// console.log(files);
	if (files.length > 0) {

		// add_img_canvas()
		parseFileToBase64(files[0]);
		//取消图案选择
		$(".picListBox ul li").siblings().removeClass("sltPic");
		$(".picListBox ul li").siblings().addClass("noSltPic");
		// showLoader();
	} else {
		alert("未选择图片")
	}
});


// 关闭上传
$("#closeUplod").click(function (e) {
	$("#upLoadBox").animate({
		"bottom": "-200px"
	});

});


//添加文字
$("#addText").click(function (e) {

	$("#textMask").animate({
		"bottom": "0"
	})
});

// 关闭文字
$("#closeText").click(function (e) {
	$("#textMask").animate({
		"bottom": "-200px"
	});
	$("#picText").val('');
});

// 发送文字
$("#sendText").click(function (e) {
	add_text($("#picText").val(), color)
	$("#textMask").animate({
		"bottom": "-200px"
	});
	$("#picText").val('');
	// 
});

//口罩型号选择
$("#maskType").click(function (e) {
	$("#maskSlt").animate({
		"bottom": "0"
	});
	if (detect() != 'android') {
		iNoBounce.enable();
	}
});


// 关闭口罩型号选择
$("#closeSlt").click(function (e) {
	$(".maskBox").scrollTop(0);
	$("#maskSlt").animate({
		"bottom": "-70%"
	});
	if (detect() != 'android') {
		iNoBounce.disable();
	}
});

// 口罩颜色选择
$("#maskColor").click(function (e) {
	$("#maskColorSlt").animate({
		"bottom": "0"
	}, function () {
		if (!$("#colorValText").val()) {
			defaultColor = 'ffffff'
		}
		$('#picker2').click();

	});


});


// 关闭口罩颜色选择
$("#closeColorSlt").click(function (e) {
	$("#maskColorSlt").animate({
		"bottom": "-50%"
	});
});


// 加载字体
var fontFamily = "FangZhengKaiTiJianTi-1"; //simhei ,arial


if (document.fonts.check(`26px ${fontFamily}`, '') && detect() === 'android') {

	console.log(fontFamily + "字体已加载1")
	$("#picText").css({
		"font-family": fontFamily
	});

	$("#ttt").css({
		"font-family": fontFamily,
		"background": "#21476c"
	});




} else { //苹果系统必须重新加载

	// console.log(detect())
	const fontface = new FontFace(fontFamily, 'url(fonts/' + fontFamily + '.ttf)');
	document.fonts.add(fontface);
	fontface.load();
	$(".loadBox").show();

	fontface.loaded.then(() => {
		// console.log(fontFamily + "字体加载完毕2222")
		$("#picText").css({
			"font-family": fontFamily
		});
		$(".loadBox").hide();


	}).catch(err => {
		console.log(err)
		// 字体加载失败
	});


}



// 修改字体
$(".sltFont").change(function () {
	fontFamily = $('.sltFont  option:selected').val();
	// lettering();
	if (document.fonts.check(`26px ${fontFamily}`, '') && detect() === 'android') {

		console.log(fontFamily + "字体已加载3")
		$("#picText").css({
			"font-family": fontFamily
		});


	} else { //苹果系统必须重新加载

		console.log(detect())

		const fontface = new FontFace(fontFamily, 'url(fonts/' + fontFamily + '.ttf)');
		document.fonts.add(fontface);
		fontface.load();
		$(".loadBox").show();
		fontface.loaded.then(() => {
			console.log(fontFamily + "字体加载完毕4444")
			$("#picText").css({
				"font-family": fontFamily
			});
			$(".loadBox").hide();

		}).catch(err => {
			console.log(err)
			// 字体加载失败
		});


	}
});


//把文字放在canvas
function add_text(val, color) {
	// console.log(val+ ", "+color)

	let el = canvas.getObjects();

	yl_img = '';
	el.forEach(item => {
		console.log(item.text)
		if (item.text != '' && item.text != undefined) {
			canvas.remove(item); //删除原先图层
		}
	})
	$('#deleteBtn').hide();
	console.log(canvas.width);
	// alert(fontFamily)
	var text = new fabric.IText(val, {

		// top: canvas.height / 2,
		// left: canvas.width / 2,
		fill: '#' + color,
		fontSize: 28 * devicePixelRatio,
		fontFamily: fontFamily,
		transparentCorners: true,
		opacity: 1,
		cornerColor: '#177ee6',
		cornerStrokeColor: '#177ee6',
		borderColor: '#666',
		cornerSize: 30 * devicePixelRatio,
		padding: 10,
		cornerStyle: 'image',
		borderDashArray: [3, 3],
		selectable: true,
		absolutePositioned: false,

	});

	// canvas.bringToFront(text)

	canvas.add(text);
	text.bringToFront();
	text.center();



}
//把图片附到canvas
var hasText = false;
var imgScale = 1;

function add_img_canvas(imgele, type, w, h) {

	// if (type == "autoColor") {
	// 	console.log(type)
	// }


	if (type == "upload") {

	} else {
		imgScale = 1;
	}


	hasText = false;
	$('#deleteBtn').hide();
	let el = canvas.getObjects();

	var elen = el.length;
	// console.log(el)

	el.forEach(item => {

		if (item.text != '' && item.text != undefined) {
			hasText = true
		} else {

		}

		if (elen == 1 && item.cacheKey.search("autoColor") > -1) {
			// console.log(item)
			// console.log(canvas.getActiveObject())
			// canvas.remove(canvas.getActiveObject());
			deleteBtn.style.display = 'none';
		}

	})

	if (hasText) {
		if (elen > imgMaxNum) {
			// alert("图片已达到3张上限")
			showErrBox("图片已达3张上限，如需继续上传，请点击左上角删除原图后可继续上传")
			return
		}
	} else {
		if (elen > imgMaxNum - 1) {
			// alert("图片已达到3张上限")
			showErrBox("图片已达3张上限，如需继续上传，请点击左上角删除原图后可继续上传")
			return
		}
	}

	yl_img = '';
	// console.log(el)
	/*
	el.forEach((item, index) => {
		// console.log(item.text)
		if (item.cacheKey != '' && item.cacheKey != undefined) {
			canvas.remove(item); //删除原先图层
		}

	})
*/


	// canvas.remove(el);//删除原先图层




	fabric.Image.fromURL(imgele, function (img) {
		// console.log(img.width , img.height,img.width / img.height)
		// console.log((canvas.width - 30*devicePixelRatio) / img.width)
		// console.log((canvas.height - 30*devicePixelRatio) / img.height)

		if (type == "upload") {

			if (w && h) {
				if (w < canvas.width - 20 * devicePixelRatio) {
					imgScale = w / (canvas.width - 20 * devicePixelRatio);
				}

				// console.log(w,canvas.width - 20 * devicePixelRatio)
				// console.log("imgScale",imgScale)

			} else {
				alert("上传的图片不正常，请重新上传")
				return
			}


		} else {

		}





		if (type == "autoColor") {
			// console.log(type)
			//图案设置
			img.set({
				// 通过scale来设置图片大小，这里设置和画布一样大
				scaleX: ((canvas.width - 20 * devicePixelRatio) / img.width) * imgScale,
				scaleY: (((canvas.width - 20 * devicePixelRatio) / img.height) / (img.width / img.height)) * imgScale,
				hasControls: false,
				hasBorders: false,
				selectable: false,
				absolutePositioned: true, //true设置蒙版固定不动
			});
			$('#deleteBtn').hide();

		} else {
			//图案设置
			img.set({
				// 通过scale来设置图片大小，这里设置和画布一样大
				scaleX: ((canvas.width - 20 * devicePixelRatio) / img.width) * imgScale,
				scaleY: (((canvas.width - 20 * devicePixelRatio) / img.height) / (img.width / img.height)) *
					imgScale,
				opacity: 1,
				cornerColor: '#659854',
				cornerStrokeColor: '#ffffff',
				borderColor: '#ccc',
				cornerSize: 30 * devicePixelRatio, //图标大小
				padding: 0,
				cornerStyle: 'image',
				borderDashArray: [3, 3],
				selectable: true,
				absolutePositioned: false,


			});
		}






		// maskPic = "images/3d.png"; //测试用本地图片，正式版直接释掉
		//加载蒙版
		fabric.Image.fromURL(maskPic, (imgg) => {
			imgg.set({

				absolutePositioned: true, //true设置蒙版固定不动
				scaleX: (canvas.width - 20 * devicePixelRatio) / imgg.width,
				scaleY: ((canvas.width - 20 * devicePixelRatio) / imgg.height) / (imgg.width /
					imgg.height),
				left: 10 * devicePixelRatio,
				top: 10 * devicePixelRatio,
				// scaleX: canvas.width / imgg.width,
				// scaleY: canvas.height / imgg.height,
			});
			imgg.center();

			var clipPath = imgg;
			img.clipPath = clipPath;
			canvasPath = imgg;
			// console.log(canvasPath)




			canvas.add(img);
			if (type == "upload") {
				img.cacheKey = img.cacheKey + "_upload";
			}
			if (type == "autoColor") {
				img.cacheKey = img.cacheKey + "_autoColor";
				img.moveTo(0)
			} else {
				canvas.setActiveObject(img);
			}


			img.center();

			let el = canvas.getObjects();

			if (type == "upload") {

				img.bringToFront();
			} else {
				// console.log("不是上传图")
				var x = 0;

				el.forEach(item => {


					if (item.cacheKey) {
						if (item.cacheKey.search("upload") > -1) {
							x += 1;

							console.log(x)


							if (hasText) {
								console.log("有文字")

								if (x > 1) {
									console.log("有2张上传图")
									img.moveTo(1)
								} else {
									console.log("有1张上传图")
									img.moveTo(elen - 2)
								}
							} else {

								console.log("无文字")

								if (x > 1) {
									console.log("有2张上传图")
									img.moveTo(1)
								} else {
									console.log("有1张上传图")
									img.moveTo(elen - 1)
								}


							}


						}
					}


				})

			}




			el.forEach(item => {


				if (item.text != '' && item.text != undefined) {
					item.bringToFront()
				}

			})

			//



		});


		//加载轮廓
		/*
		fabric.Image.fromURL(linePic, (limg) => {
			limg.set({
		
				absolutePositioned: true, //true设置蒙版固定不动
				scaleX: canvas.width / limg.width,
				scaleY: canvas.height / limg.height,
				selectable: false
				
			});
			canvas.add(limg);
			
		
		});

		 */

	});



}

// 变更所有物件画出的控制项
fabric.Object.prototype.drawControls = function (ctx, styleOverride) {
	// 

	styleOverride = styleOverride || {};
	ctx.save();
	ctx.setTransform(this.canvas.getRetinaScaling(), 0, 0, this.canvas.getRetinaScaling(), 0, 0);
	ctx.strokeStyle = ctx.fillStyle = styleOverride.cornerColor || this.cornerColor;
	if (!this.transparentCorners) {
		ctx.strokeStyle = styleOverride.cornerStrokeColor || this.cornerStrokeColor;
	}
	this._setLineDash(ctx, styleOverride.cornerDashArray || this.cornerDashArray, null);
	this.setCoords();
	this.forEachControl(function (control, key, fabricObject) {
		if (control.getVisibility(fabricObject, key)) {
			// console.log(key);
			control.render(ctx, fabricObject.oCoords[key].x, fabricObject.oCoords[key].y, styleOverride,
				fabricObject, key); //增加下标项目‘key’，让插件可以根据下标名称替换控制器图标
		}
	});
	ctx.restore();
	return this;
}

function add_canvas_bg(imgages) {
	fabric.Image.fromURL("imgages", (img) => {
		img.set({
			// 通过scale来设置图片大小，这里设置和画布一样大
			scaleX: canvas.width / img.width,
			scaleY: canvas.height / img.height,

		});
		// 设置背景
		canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
		canvas.renderAll();
	});
}

canvas.on({
	// 鼠标滚动缩放
	// "mouse:wheel": (e) => { 
	//     zoom = (event.deltaY > 0 ? -0.1 : 0.1) + canvas.getZoom();
	//      zoom = Math.max(0.1, zoom); //最小为原来的1/10
	//      zoom = Math.min(3, zoom); //最大是原来的3倍
	//     //    zoomPoint = new fabric.Point(e.pointer.x, e.pointer.y);
	//      zoomPoint = new fabric.Point(400, 400); // 中心点
	//      canvas.zoomToPoint(zoomPoint, zoom);
	// },
	// 鼠标旋转
	"object:rotating": (e) => {


		var offsetX = e.e.offsetX;
		var offsetY = e.e.offsetY;
		// tag.style.left = offsetX + 30 + 'px'; // 离鼠标太近，可能会出现抖动，闪现
		// tag.style.top = offsetY + 30 + 'px'; 
	},
	"object:rotated": (e) => {

		yl_img = '';
		// tag.style.display = 'none';
	},
})


// 删除某个图层
var deleteBtn = document.getElementById('deleteBtn');

function addDeleteBtn(x, y) {
	// console.log(x,y);
	deleteBtn.style.display = 'none';
	deleteBtn.style.left = x + 20 + 'px';
	deleteBtn.style.top = y + 'px';
	deleteBtn.style.display = 'block';
	deleteBtn.style.width = '30px';
	deleteBtn.style.height = '30px';

}



canvas.on('selection:created', function (e) {
	let n = 0;
	let el = canvas.getObjects();


	if (e.target.lineCoords.tl.x / devicePixelRatio > 0 && el.length > 0) {
		n = -15
	}

	// console.log('selection:created',e.target)	

	addDeleteBtn(e.target.lineCoords.tl.x / devicePixelRatio + n, e.target.lineCoords.tl.y / devicePixelRatio +
		n);
});
canvas.on('selection:updated', function (e) {
	let n = 0;
	let el = canvas.getObjects();
	if (e.target.lineCoords.tl.x / devicePixelRatio > 0 && el.length > 0) {
		n = -15
	}
	// console.log('selection:updated',e.target.lineCoords.tl.x)	
	addDeleteBtn(e.target.lineCoords.tl.x / devicePixelRatio + n, e.target.lineCoords.tl.y / devicePixelRatio +
		n);
});
canvas.on('mouse:down', function (e) {

	// console.log(canvas.getActiveObject())

	if (!canvas.getActiveObject()) {

		deleteBtn.style.display = 'none';
	} else {



		let el = canvas.getObjects();
		let cg = canvas.getActiveObject();


		// return

		el.forEach((item, index) => {

			if (item.text != '' && item.text != undefined) {

				// console.log("有文字",el.length)

				// cg.moveTo(el.length - 1)
				item.bringForward()

				// console.log(el)


			} else {

				if (cg.cacheKey) {
					if (cg.cacheKey.search("upload") > -1) {
						console.log("选中上传图")
						// cg.bringForward()
						// cg.moveTo(0)
					} else {
						console.log("选中非上传图")

						// cg.moveTo(0)
					}
				}


				// console.log("没有文字")
				// 
			}


		})

	}
});

canvas.on('object:modified', function (e) {
	// console.log('object:modified',e.target.lineCoords.tl.x)
	addDeleteBtn(e.target.lineCoords.tl.x / devicePixelRatio - 15, e.target.lineCoords.tl.y / devicePixelRatio -
		15);
});
canvas.on('object:scaling', function (e) {
	yl_img = '';
	deleteBtn.style.display = 'none';
});
canvas.on('object:moving', function (e) {
	yl_img = '';
	deleteBtn.style.display = 'none';
});
canvas.on('object:rotating', function (e) {
	deleteBtn.style.display = 'none';
});
canvas.on('mouse:wheel', function (e) {
	deleteBtn.style.display = 'none';
})
$(document).on('click', "#deleteBtn", function () {

	// return
	if (canvas.getActiveObject()) {


		if (canvas.getActiveObject().text == undefined || canvas.getActiveObject().text == null) {
			canvas.remove(canvas.getActiveObject());
			deleteBtn.style.display = 'none';


			/*

			// console.log("删除的是图案");
			customPic = null;
			//删掉图案后显示默认纯色
			const canvas1 = document.createElement("canvas")
			const ctx = canvas1.getContext("2d")
			canvas1.width = canvas.width;
			canvas1.height = canvas.height;
			// ctx.fillStyle = getGoodsList[0].color.color_val;
			// customColor = getGoodsList[0].color.color_val;
			ctx.fillStyle = getColor;
			customColor = getColor;

			ctx.fillRect(0, 0, canvas.width, canvas.height);
			add_img_canvas(canvas1.toDataURL());
			//取消图案选择
			$(".picListBox ul li").siblings().removeClass("sltPic");
			$(".picListBox ul li").siblings().addClass("noSltPic");
*/
		} else {
			canvas.remove(canvas.getActiveObject());
			deleteBtn.style.display = 'none';
			if (customPic) {
				// add_img_canvas(customPic);
			} else {

				//删掉图案后显示默认纯色

				const canvas1 = document.createElement("canvas")
				const ctx = canvas1.getContext("2d")
				canvas1.width = canvas.width;
				canvas1.height = canvas.height;
				ctx.fillStyle = "#ffffff";
				customColor = "#ffffff";


				ctx.fillRect(0, 0, canvas.width, canvas.height);
				// add_img_canvas(canvas1.toDataURL("image/jpg"), "autoColor");
			}


			// console.log(canvas.getActiveObject());
			// console.log("删除的是文字");

		};

	}

	let el = canvas.getObjects();
	// console.log(el.length)
	if (el.length == 0 || (el.length == 1 && el[0].text != '' && el[0].text != undefined)) {

		//删掉图案后显示默认纯色



		const canvas1 = document.createElement("canvas")
		const ctx = canvas1.getContext("2d")
		canvas1.width = canvas.width;
		canvas1.height = canvas.height;
		ctx.fillStyle = "#ffffff";
		customColor = "#ffffff";

		ctx.fillRect(0, 0, canvas.width, canvas.height);
		// add_img_canvas(canvas1.toDataURL('image/jpg'), "autoColor");
	} else {

		if (!canvas.getActiveObject()) {
			console.log(el.length)
			if (el.length == 1 && el[0].cacheKey.search("autoColor") > -1) {
				console.log("已是底色层")
			} else {
				canvas.setActiveObject(el[el.length - 1])
			}

		}
	}

});


function base64ImgtoFile(dataurl, filename = 'file') {
	let arr = dataurl.split(',')
	let mime = arr[0].match(/:(.*?);/)[1]
	let suffix = mime.split('/')[1]
	let bstr = atob(arr[1])
	let n = bstr.length
	let u8arr = new Uint8Array(n)
	while (n--) {
		u8arr[n] = bstr.charCodeAt(n)
	}
	return new File([u8arr], `${filename}.${suffix}`, {
		type: mime
	})
}
//提示框
function showErrBox(e) {
	$(".errBoxBg").show();
	$(".errText").text(e);
}


// 获取文件对象并转换成base64
var mixPxW = 200;
mixPxH = 100 //最小像素值
function parseFileToBase64(file) {

	var image = file; //获取文件域中选中的图片
	var reader = new FileReader(); //实例化文件读取对象
	reader.readAsDataURL(image); //将文件读取为 DataURL,也就是base64编码

	reader.onload = function (ev) { //文件读取成功完成时触发
		// console.log(ev)
		// return
		var dataURL = ev.target.result; //获得文件读取成功后的DataURL,也就是base64编码

		var img = new Image();
		img.src = dataURL;
		img.crossOrigin = 'anonymous';
		img.onload = function () {
			var w = img.width;
			var h = img.height;

			// console.log(w * h)
			if (w * h < mixPxW * mixPxH) {
				// alert("图片像素过小会造成印刷成品模糊，请上传实际像素不小于" + mixPxW + "*" + mixPxH + "px,分辨率不低于72dpi的图片")

				showErrBox("图片像素过小会造成印刷成品模糊，请上传实际像素不小于" + mixPxW + "*" + mixPxH + "px,分辨率不低于72dpi的图片")

				return
			}

			add_img_canvas(dataURL, "upload", w, h)
			$('#upimg').val('');
		}

	}


}

//超时检查
function checkNetLink() {
	var checkNet = setTimeout(function () {
		if (offline) {
			$(".loadBox").hide();
			document.getElementById("newPage").innerHTML = "";
			$("#newPage").hide();
			$("#closePage").hide();

			if (detect() != 'android') {
				iNoBounce.disable();
			}
			alert("无法连接网络，请连网后再试")
		} else {

		}
		clearTimeout(checkNet)
	}, 10000)
}

var canvasPath;

$(".view3d").click(function () {

	checkNetLink();


	if (detect() != 'android') {
		iNoBounce.enable();
	}

	console.log("1.开始跳转")

	// console.log("跳转");
	$(".loadBox").show();


	var image = new Image();
	image.src = canvas.toDataURL('image/jpg');
	image.crossOrigin = 'anonymous';
	image.onload = function () {

		//创建一个canvas
		var canvas2 = document.createElement('canvas');
		//获取上下文
		var context = canvas2.getContext('2d');
		//获取压缩后的图片宽度,如果width为-1，默认原图宽度
		canvas2.width = outputImgW;
		//获取压缩后的图片高度,如果width为-1，默认原图高度
		canvas2.height = outputImgW;
		//把图片绘制到canvas上面
		// context.drawImage(image, 0, 0, canvas2.width, canvas2.height);

		context.drawImage(image, 10 * devicePixelRatio, 10 * devicePixelRatio, image.width - 20 *
		devicePixelRatio, image.height - 20 * devicePixelRatio, 0, 0, canvas2.width, canvas2.height);


		//压缩图片，获取到新的base64Url
		var newImageData = canvas2.toDataURL('image/jpg');

		// console.log(canvas2.toDataURL('image/jpg'))


		//合成两张base64

		let canvas3 = document.createElement('canvas');
		canvas3.width = outputImgW;
		canvas3.height = outputImgW;
		let context2 = canvas3.getContext('2d');

		context2.rect(0, 0, canvas3.width, canvas3.height);
		let bgImg = new Image();
		bgImg.src = newImageData; // 背景图的url
		bgImg.crossOrigin = 'anonymous';
		bgImg.onload = () => {
			context2.drawImage(bgImg, 0, 0, canvas3.width, canvas3.height);


			let img = new Image();
			img.src = linePic; // 需要合进去的图片url
			img.crossOrigin = 'anonymous';
			img.onload = () => {
				context2.drawImage(img, 0, 0, outputImgW, outputImgW);

				let base64 = canvas3.toDataURL('image/jpg');

				let noneMaskImg = new Image();

				let el = canvas.getObjects();


				el.forEach(item => {

					if (item.cacheKey != '' && item.cacheKey != undefined) {
						item.clipPath = null;

					}
				})

				console.log(canvasPath)

				noneMaskImg.src = canvas.toDataURL('image/jpg');
				// console.log(canvas.toDataURL('image/jpg'))

				noneMaskImg.crossOrigin = 'anonymous';
				let canvas4 = document.createElement('canvas');
				canvas4.width = outputImgW;
				canvas4.height = outputImgH;
				let context3 = canvas4.getContext('2d');
				context3.rect(0, 0, canvas4.width, canvas4.height);
				noneMaskImg.crossOrigin = 'anonymous';

				noneMaskImg.onload = () => {

					// console.log(noneMaskImg)

					// console.log("canvas4.width:", canvas4.width, "/canvas4.height:", canvas4.height)

					// console.log("outputImgW:", outputImgW, "/outputImgH:", outputImgH)

					if (canvas4.width > canvas4.height) {
						// console.log("横图")
						// console.log("-(outputImgW-outputImgH)/2=",-(outputImgW-outputImgH)/2)
						// context3.drawImage(noneMaskImg, 0 , 0 , noneMaskImg.width - 10 * devicePixelRatio,noneMaskImg.height - 10 * devicePixelRatio, 0, -(outputImgW -outputImgH) / 2, outputImgW, outputImgW);
						context3.drawImage(noneMaskImg, 10 * devicePixelRatio, 10 *
							devicePixelRatio, noneMaskImg.width - 20 * devicePixelRatio,
							noneMaskImg.height - 20 * devicePixelRatio, 0, -(outputImgW -
								outputImgH) / 2, outputImgW, outputImgW);
					} else {

						var getScale = canvas4.height / canvas4.width;


						var getX = ((noneMaskImg.width - 20 * devicePixelRatio) - (noneMaskImg
							.width / getScale - 20 * devicePixelRatio)) / 2;

						context3.drawImage(noneMaskImg, 10 * devicePixelRatio + getX, 10 *
							devicePixelRatio, noneMaskImg.width / getScale - 20 *
							devicePixelRatio, noneMaskImg.height - 20 * devicePixelRatio, 0,
							0, outputImgW, outputImgH);

					}


					let el = canvas.getObjects();

					el.forEach(item => {
						if (item.cacheKey != '' && item.cacheKey != undefined) {
							item.clipPath = canvasPath;
						}
					})

					$("#newPage").attr("data-img", base64);
					$("#newPage").attr("data-yimg", canvas4.toDataURL('image/png', 0.8));
					//////////////////////////////////////////////////
					var pageUrl = "index.html?id=" + getId + "&img=" +
						yl_img + "&yimg=" + ys_img +
						'&token=' + token;

					document.getElementById("newPage").innerHTML =
						'<object type="text/html" data="' + pageUrl +
						'" width="100%" height="100%"></object>';

					console.log("2.图片处理完成打开新页面")
					$("#newPage").css({
						"opacity": "0"
					});
					$("#newPage").show();

					return

				}

			}
		}

	}


})


//颜色选择器2
var pickerConfig = {
	layout: 'hex',
	submit: 0,
	colorScheme: 'dark',
	onChange: function (hsb, hex, rgb, el, bySetColor) {
		//把颜色存进 id=color 的input里
		$("#colorValText").val("#" + hex);
		//把边框的颜色 变为选择的颜色
		// $("#colorValText").css({
		// 	"color": "#" + hex + ""
		// });



		$('#picker2').css({
			"background": "#" + hex + ""
		})

		// color = hex;
		if (!bySetColor) $(el).val(hex);
	}
}


//点击按钮 获取到颜色
$(document).on("click", "button", function () {
	//获取 id=color 的颜色
	var color = $("#color").val();
	// alert(color)
});
//点击按钮 获取到颜色

// 关闭内嵌页
$("#closePage").click(function (e) {
	document.getElementById("newPage").innerHTML = "";
	$("#newPage").hide();
	$("#closePage").hide();

	if (detect() != 'android') {
		iNoBounce.disable();
	}

})



//显示预览大图
function showReviewImg() {
	console.log(devicePixelRatio)
	$("#reviewImg").attr("src", "");

	$("#reviewImgBox").show()
	$(".loadBox").show();

	// test()
	// return


	var image = new Image();
	image.src = canvas.toDataURL('image/jpg');
	image.crossOrigin = 'anonymous';
	image.onload = function () {

		//创建一个canvas
		var canvas2 = document.createElement('canvas');
		//获取上下文
		var context = canvas2.getContext('2d');
		//获取压缩后的图片宽度,如果width为-1，默认原图宽度
		canvas2.width = outputImgW * devicePixelRatio;
		//获取压缩后的图片高度,如果width为-1，默认原图高度
		canvas2.height = outputImgW * devicePixelRatio;
		//把图片绘制到canvas上面
		// context.drawImage(image, 0, 0, canvas2.width, canvas2.height);


		context.drawImage(image, 10 * devicePixelRatio, 10 * devicePixelRatio, image.width - 20 *
			devicePixelRatio, image.height - 20 * devicePixelRatio, 0, 0, canvas2.width, canvas2.height);


		//压缩图片，获取到新的base64Url
		var newImageData = canvas2.toDataURL('image/jpg');



		//合成两张base64

		let canvas3 = document.createElement('canvas');
		canvas3.width = outputImgW * devicePixelRatio;
		canvas3.height = outputImgW * devicePixelRatio;
		let context2 = canvas3.getContext('2d');

		context2.rect(0, 0, canvas3.width, canvas3.height);
		let bgImg = new Image();
		bgImg.src = newImageData; // 背景图的url
		bgImg.crossOrigin = 'anonymous';
		bgImg.onload = () => {
			context2.drawImage(bgImg, 0, 0, canvas3.width, canvas3.height);


			let img = new Image();
			img.src = linePic; // 需要合进去的图片url
			img.crossOrigin = 'anonymous';
			img.onload = () => {
				context2.drawImage(img, 0, 0, outputImgW * devicePixelRatio, outputImgW * devicePixelRatio);

				let base64 = canvas3.toDataURL('image/jpg');

				// console.log(base64)
				$("#reviewImg").attr("src", base64);
				let img2 = new Image();
				img2.src = base64; // 需要合进去的图片url
				img2.crossOrigin = 'anonymous';
				img2.onload = () => {
					middleImg();

					oldW = $("#reviewImg").width();
					oldH = $("#reviewImg").height();
					p(oldW, oldH);
					$(".loadBox").hide();
				}

				// 创建无遮罩的图片

			}
		}
	}



}

//关闭大图显示
function closeReviewImg() {
	$("#reviewImgBox").hide();
	$("#reviewImg").attr("src", "");
	$(".loadBox").hide();

}

$(function () {
	$('div.pinch-zoom').each(function () {
		new RTP.PinchZoom($(this), {});
	});
})

function middleImg() {
	var gh = $("#reviewImg").height() / 2 + 50;
	$("#reviewImg").css({
		"top": "calc(50% - " + gh + "px ) ",
		"transform": "scale(1)",
		"left": "0"
	})
}

function closeErrBox() {
	$(".errBoxBg").hide()
}
