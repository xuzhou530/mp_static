/**
 * Created by fxh on 2016/4/26.
 */

//消息窗替代alert
window.msgBox = function (texts,tos) {
	$('.msgbox').remove();
	$("body").append('<div class="msgbox msgUp">' + texts + '</div>');
	$('.msgbox').show();
	if(!tos){tos = 2200;}
	setTimeout(function () {
		$('.msgbox').removeClass("msgUp").addClass("msgDown");
	},tos);//停留时间
};

//全局变量 map
var scale = new AMap.Scale(),
	toolBar = new AMap.ToolBar(),
	map = new AMap.Map('map', {
		resizeEnable: true,
		zoom:11,
		center: [113.518364,22.712559]//南沙区域正中心点	//[113.53141,22.808029],//南沙区政府点
	});    


$(function(){	
	var pileLng=0, pileLat=0;
	//var cluster = null;
	
	var pointMark = null,zoomN;
	var t=null;

	function getBoundary(){
	   
	    //map.addControl(scale); map.addControl(toolBar);
	    infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)},{closeWhenClickMap:true});
        
		
		
    	//构建南沙各镇分区经纬度坐标数组
    	/*var nsTsPgs = [];
	    var nsPolygon=function(arr,fillColor){
	    	var pg = new AMap.Polygon({
	            map: map,
		        path: arr,//设置多边形边界路径
		        strokeOpacity:0,
		        fillColor: fillColor, //填充色
		        fillOpacity: 0.35//填充透明度
		    });
	    	nsTsPgs.push(pg);
	    	return pg;
	    };
	    for(var i=0;i<10;i++){	//9个镇区域色块
	    	nsPolygon(towns[i],townColor[i]);
	    }  */
         
	    queryCallback = function(results){	//获取到热点数据后执行（地图画点、显示数据、事件）
	    	//先清除地图上已有的数据
	    	if(markers){
	    		for(var i=0;i<markers.length;i++){
	    			markers[i].hide();
	    		}
	    	}
	    	if(pointMark){pointMark.hide();}
	    	infoWindow.close();

	    	markers=[];
	    	var lnglats = [];
		    
		    // 循环处理查询到的数据
		    for (var i = 0; i < results.length; i++) {
				var object = results[i];
			     mpoi_id = object.mpoi_id;
				 
				//AP 数量显示
				var num = GetApInfo(lists,mpoi_id);
				/*var datacount= GetApInfo(lists,mpoi_id)[0];
				var norNum = GetApInfo(lists,mpoi_id)[1];
				var errNum = GetApInfo(lists,mpoi_id)[2];
				var onliPeopleNum= GetApInfo(lists,mpoi_id)[3];*/
				var datacount= num[0];
				var norNum = num[1];
				var errNum = num[2];
				var onliPeopleNum= num[3];
				
				
		        var marker = new AMap.Marker({
					
				    //icon: (i%2==1)?"images/nsc_images/map/p3.png":"images/nsc_images/map/p2.png",
					//content: div,
		            position: [object.lng,object.lat],
		            //map: map,
		            offset: new AMap.Pixel(-25, -28)
		        });
		        //markers.push(marker);
				marker.title=object.mpoi_address;
		        //marker.content = '<p></p><p>名称：' + object.mpoi_name + '</p><p>地址：'+object.mpoi_address+'</p><p>接入点数量：'+datacount+'</p><p>状态：'+(norNum>=(norNum+errNum)?'运行':'故障')+'</p><p>运行/故障：'+norNum+'/'+errNum+'</p><p>类型：'+object.type+'</p><p data-id="'+object.id+'"><button class="btn-open-edit">修改</button> <button class="btn-open-del">删除</button></p>';
		        marker.content = '<p></p><p>名称：' + object.mpoi_address + '</p><p>地址：'+object.mpoi_name+'</p><p>接入点数量：'+datacount+'</p></p><p>在线人数：'+onliPeopleNum+'</p><p>类型：'+object.type+'</p>';
				marker.on('click', markerClick);
		        marker.on('mouseover', function(e){
		        	e.target.setAnimation("AMAP_ANIMATION_BOUNCE");
			        //e.target.setIcon("http://amappc.cn-hangzhou.oss-pub.aliyun-inc.com/lbs/static/img/marker.png")
			    });
		        marker.on('mouseout', function(e){
		        	e.target.setAnimation("AMAP_ANIMATION_NONE");
			        //e.target.setIcon("images/p2.png")
			    });
				
				var  type =object.type;
				
				switch (type){
				case "政府":
				case "医院":
					marker.setIcon("/static/images/nsc_images/blue.png");
					GonvernMarkers.push(marker);
					break;
				case "校区":
					marker.setIcon("/static/images/nsc_images/green.png");
					CmpuMarkers.push(marker);
					break;
				case "商超":
				case "餐饮": 
				case "宾馆":
				case "文娱": 
				case "景区":
				case "企业":
				case "公共":
					marker.setIcon("/static/images/nsc_images/orange.png");
					BusiMarkers.push(marker);
					break;
				case "机场":
				case "车站":
					marker.setIcon("/static/images/nsc_images/blue-green.png");
					TraffiMarkers.push(marker);
					break;
				}
				//markers=GonvernMarkers.concat(TraffiMarkers);
		    }
			
		    function markerClick(e) {
				console.log(1);
		        infoWindow.setContent(e.target.content);
		        infoWindow.open(map, e.target.getPosition());
		    }	
			
			
	    };
		//queryDB();
		GetListMidNotnull();
		
		//查询在线AP数目
		queryAPOnLineCallback = function(results)
		{	
		 //document.getElementById("num-of-onlineAP").disabled=true;
		 //document.getElementById("num-of-onlineAP").innerText=results.length;
		}
		queryAPOnLine();
		//查询在线人数
		queryPeopleOnLineCallback = function(results){
			var NumOfPeoOnli =0;
			for (var i = 0; i < results.length; i++) {
				var object = results[i];
				NumOfPeoOnli=object.conns+NumOfPeoOnli
			}
			//document.getElementById("num-of-onlinePeple").value = NumOfPeoOnli;
			//document.getElementById("num-of-onlinePeple").innerText = NumOfPeoOnli;
			
		}
		queryPeopleOnLine();

		//添加定时触发函数
		timedMsg=function (){
		   queryAPOnLine();
		   queryPeopleOnLine();
		   t=setTimeout("timedMsg()",600000)//600秒钟获取一次值(10min)
		}
		//timedMsg();
		//添加地图缩放或平移时infoWIndow关闭
		

	   /* function addNanSha() {
	        //加载行政区划插件
	        AMap.service('AMap.DistrictSearch', function() {
	            var opts = {
	                subdistrict: 1,   //返回下一级行政区
	                extensions: 'all',  //返回行政区边界坐标组等具体信息
	                level: 'city'  //查询行政级别为 市
	            };
	            //实例化DistrictSearch
	            district = new AMap.DistrictSearch(opts);
	            district.setLevel('district');
	            //行政区查询
	            district.search('南沙区', function(status, result) {
	                var bounds = result.districtList[0].boundaries;
	                var polygons = [];
	                if (bounds) {
                        //生成行政区划polygon
                        var polygon = new AMap.Polygon({
                            map: map,
                            strokeWeight: 2,
                            path: bounds[0],
                            fillOpacity: 0.2,
                            fillColor: '#CCF3FF',
                            //strokeColor: '#f00',
							strokeColor: '#CC66CC',
                            cursor:'default',
							strokeStyle:'dashed',
							strokeDasharray:[10,8,10]
							
                        });
                        polygons.push(polygon);
						//点击地图获取经纬度、标记、地址
                        map.on('click', function(e) {
							console.log(e.lnglat.getLng() + ',' + e.lnglat.getLat());
						});
                        polygon.on('click', function(e) {
							console.log(e.lnglat.getLng() + ',' + e.lnglat.getLat());
							pileLng = e.lnglat.getLng(); pileLat = e.lnglat.getLat();
							//插入一个标记
							if(pointMark){pointMark.show(); pointMark.setPosition([pileLng, pileLat]);}
							else{
								pointMark = new AMap.Marker({
						            icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
						            position: [pileLng, pileLat]
						        });
						        pointMark.setMap(map);
						    }

						    var lnglatXY = [pileLng, pileLat]; //待解析坐标
						    function regeocoder() {  //逆地理编码
						        var geocoder = new AMap.Geocoder({
						            radius: 1000,
						            extensions: "all"
						        });        
						        geocoder.getAddress(lnglatXY, function(status, result) {
						            if (status === 'complete' && result.info === 'OK') {
						            	var addrStr = result.regeocode.addressComponent.district;
						            	addrStr += result.regeocode.addressComponent.township
						            	addrStr += result.regeocode.addressComponent.street
						            	addrStr += result.regeocode.addressComponent.streetNumber;
						            	if(result.regeocode.addressComponent.neighborhood!=""){
						            		addrStr += "("+result.regeocode.addressComponent.neighborhood+"附近)";
						            	}
						            	$(".add-wifi-address").val(addrStr);
						            }
						        });
						    }
						    regeocoder();
					    });
	                    map.setFitView();//地图自适应
	                    //限定地图范围
                    	//map.setLimitBounds(map.getBounds());
                    	zoomN = map.getZoom();
                    	map.on('zoomchange', function(e) {
							//南沙区划显示隐藏
                    		if(map.getZoom()<=zoomN){
								for(var i=0;i<nsTsPgs.length;i++){
									nsTsPgs[i].show();
								}
							}
							else{
								for(var i=0;i<nsTsPgs.length;i++){
									nsTsPgs[i].hide();
								}
							}
                    	});
	                }
	            });
	        });
	    }
	    addNanSha();*/


	    //查询实时天气信息
	    AMap.service('AMap.Weather', function() {
	        var weather = new AMap.Weather();
	        weather.getLive('南沙区', function(err, data) {
	            var wStr = '',minStr = '';
	            if (!err) {
	            	minStr = data.weather + ' ' + data.temperature + '℃';

	                wStr+=('<p style="color: #36f;">' + data.city + ' 实时天气' + '</p>');
	                wStr+=('<p>天气：' + data.weather + '</p>');
	                wStr+=('<p>温度：' + data.temperature + '℃</p>');
	                wStr+=('<p>湿度：' + data.humidity + '%</p>');
	                wStr+=('<p style="margin-bottom: 10px;">风力：' + data.windDirection +'风 '+ data.windPower + '级</p>');
	                // wStr+=('<p>发布时间：' + data.reportTime + '</p>');

			        //未来4天天气预报
			        weather.getForecast('南沙区', function(err, data) {
			            if (err) {return;}
			            wStr += '<p style="color: #36f;">未来4天天气预报：</p>';
			            for (var i = 0,dayWeather; i < data.forecasts.length; i++) {
			                dayWeather = data.forecasts[i];
			                var week="";
			                switch(dayWeather.week){
			                	case "1":week="一";break;
			                	case "2":week="二";break;
			                	case "3":week="三";break;
			                	case "4":week="四";break;
			                	case "5":week="五";break;
			                	case "6":week="六";break;
			                	default:week="日";break;
			                }
			                wStr+=('<p>周'+week+' '+dayWeather.dayWeather+' '+ dayWeather.nightTemp + '~' + dayWeather.dayTemp + '℃</p>');
			            }			            
			        });

	            	$(".weather").html(minStr).show();

	                $(".weather").on("mouseover",function(e){
	                	$(this).html(wStr);
	                });

	                $(".weather").on("mouseleave",function(e){
	                	setTimeout(function(){
	                		$(".weather").html(minStr);
	                	},1000);
	                })
	            }
	        });
	    });
		
		
		//POI显示隐藏
		var feature1 = ["bg", "road", "building", "point"],
			feature2 = ["bg", "road", "building"],
			poiOn = true;
		map.setFeatures(feature2);
		$(document).on("click",".hide-poi",function(e){
			$(this).html((poiOn?"隐藏":"显示")+"POI");
			map.setFeatures(poiOn?feature1:feature2);
			poiOn = !poiOn;
		});
		//新增
		$(document).on("click",".open-add",function(e){
			setToAdd();
			$(".add-pile-box").show();
		});
	    //切换热点、充电桩
		$(document).on("click",".pop-title a",function(e){
			if($(this).hasClass("on")){return;}
			if($(this).index()=='1'){msgBox("此功能暂未开放。");return;}
			$(this).addClass("on").siblings().removeClass("on");
			$(".tbl-wifi").toggle();
			$(".tbl-pile").toggle();
		});	
	}
	getBoundary();

	//设置为修改状态
	var setToEdit = function(){
		$(".pop-title").html('<a class="on" href="javascript:;">修改</a>');
		$(".btn-add").hide();
		$(".btn-edit").show();
	};
	//设置为新增状态
	var setToAdd = function(){
		$(".pop-title").html('<a class="on" href="javascript:;">新增热点</a> | <a href="javascript:;">新增充电桩</a>');
		$(".btn-add").show();
		$(".btn-edit").hide();
	};

	$(document).on("click",".btn-open-edit",function(e){
		setToEdit();
		$(".add-pile-box").show();
		editObjId = $(this).parent().data("id");
		console.log(editObjId);
	});

	$(document).on("click",".btn-open-del",function(e){
		var delObjId = $(this).parent().data("id");
		console.log("delObjId:"+delObjId);
		if(confirm("确定要删除该点？")){
			delDB(delObjId);
		}
	});

	//添加成功后callback
	addCallback = function(){
		msgBox("添加成功！");
		$(".add-wifi-name,.add-wifi-address,.add-wifi-mac").val("");
	};


	var trim = function($inputObj){ //非空验证
		var fl=true;
		$inputObj.val($inputObj.val().replace(/(^\s*)|(\s*$)/g, ""));
		if($inputObj.val()==""){msgBox("请输入"+$inputObj.data("tip"));$inputObj.focus();fl=false;}
		return fl;
　　};
	var valid = function(){	//表单验证
		if(pileLng==0 || pileLat==0){msgBox("请在地图上点击选择位置");return false;}
		if(!trim($(".add-wifi-address")) || !trim($(".add-wifi-name")) || !trim($(".add-wifi-mac"))){return false;};
		var regMAC = /^([0-9a-fA-F]{2})(([/\s-][0-9a-fA-F]{2}){5})$/;
		///[A-F\d]{2}-[A-F\d]{2}-[A-F\d]{2}-[A-F\d]{2}-[A-F\d]{2}-[A-F\d]{2}/;
		if(!regMAC.test($(".add-wifi-mac").val())){msgBox("请输入正确的MAC地址<br>例如:1A-2B-3C-4D-5E-6F",3000);$(".add-wifi-mac").focus();return false;}
		return true;
	};

	$(document).on("click",".btn-add.wifi",function(e){
		if(!valid())return;
		//添加热点
		var addHotData = {
			name:$(".add-wifi-name").val(),
			address:$(".add-wifi-address").val(),
			lng:""+pileLng,
			lat:""+pileLat,
			mac:$(".add-wifi-mac").val()
		};
		addtoDB(addHotData);
	});
	
	var editObjId=null;//待修改的点id
	$(document).on("click",".btn-edit.wifi",function(e){
		if(!valid())return;
		//修改热点
		var editHotData = {
			id:editObjId,
			name:$(".add-wifi-name").val(),
			address:$(".add-wifi-address").val(),
			lng:""+pileLng,
			lat:""+pileLat,
			mac:$(".add-wifi-mac").val()
		};
		updateDB(editHotData);
	});


	$(document).on("click",".pop-close",function(e){
		$(".add-pile-box").hide();
	});
    
});