// 全局变量
var map;
var user_aim_site;//目的地
var user_curent_site;//用户当前位置
var user_aim_lnglatXY;//用户目的经纬度
var user_curent_lnglatXY;//用户位置经纬度
var current_city;//当前城市
var show_car_instru_flag=1;
var show_walk_instru_flag=1;
// 全局变量
// 异步初始化map
function init(){
        map= new AMap.Map('mainmap', {
            center: [117.000923, 36.675807],
            zoom: 6
        });
        map.setFeatures(['bg','road','building','point'])
        map.plugin(["AMap.ToolBar"], function() {
            map.addControl(new AMap.ToolBar());
        });
        // 第一次定位
        getAPosition();
        // 获取城市
        GetCity();
    }
window.onload=function(){
    // 获取目标地址
    var href=window.location.href;
    var latlng=href.substr(href.indexOf('?')+5,href.length)
    var lat=latlng.substr(0,latlng.indexOf(','));
    var lng=latlng.substr(latlng.indexOf('=')+1,latlng.length)
    user_aim_lnglatXY=[lat,lng];
    $.ajax({
    type: 'GET',
    url:'https://restapi.amap.com/v3/geocode/regeo?key=23607f1a1d0fc69c3dea47551babe4d5&location='+lng+','+lat+'&poitype=%E5%95%86%E5%8A%A1%E5%86%99%E5%AD%97%E6%A5%BC&radius=1000&extensions=all&batch=false&roadlevel=0',
    data:{},
    dataType:"json",
    cache: false,
    success: function(data){
        if(data.status==1){
            
            user_aim_site=data.regeocode.formatted_address
            setTimeout(function(){$(".aim_site_text").html(user_aim_site);},1000)
            
            // $(".top_input input").val(user_aim_site)
        }  
    },
    error: function(e) { 
        alert("目标位置解析失败!")
        } 
    });
    // 页面开始加载
    //输入提示
    var autoOptions = {
        input: "search_top"
     };
    var auto = new AMap.Autocomplete(autoOptions);
    var placeSearch = new AMap.PlaceSearch({
        map: map
     });  //构造地点查询类
     AMap.event.addListener(auto, "select", select);//注册监听，当选中某条记录时会触发
     // poi click
    function select(e) {
       var aim_site_text=$(".aim_site_text")
        placeSearch.setCity(e.poi.adcode);
        placeSearch.search(e.poi.name);  //关键字查询查询
        aim_site_text.html(e.poi.district+e.poi.name);
        user_aim_site=e.poi.district+e.poi.name;  
    }
    // other
    addMap("bus_map");//添加公交地图
    $(".top_item li").on("touchend",function(){
        $(".top_item li").removeClass("under_border")
        $(this).addClass("under_border")
    });
    $(".navi_btn").on("touchend",function(){
        $(".suiwei_road").css("display","block")
        $(".suiwei_road").animate({left:"0"},"slow")
        
           // 公交导航
        $(".top_item li").eq(0).on("touchend",function(){
        $(".all_car").css("display","none");
        $(".all_bus").css("display","block");
        $(".all_walk").css("display","none");
        $(".amap-content-body").css("display","none")
        $(".amap-combo-close").css("display","none")
        $(".amap-combo-sharp").css("display","none")
       $("#bus_tip").css("display","block").fadeIn("slow")
    //    goToByBus();
    });
    // 公交详情
    $(".bus_main_detail_btn").on('touchend',function(){
        $("#bus_tip").animate({top:"0"},'slow');
        $(".amap-content-body").css("display","none")
        $(".amap-combo-close").css("display","none")
        $(".amap-combo-sharp").css("display","none")
        $(".bus_nav").animate({left:"0"},'slow')
    })
        // 驾车导航
        $(".top_item li").eq(1).on("touchend",function(){
        $(".all_car").css("display","block")
        $(".all_bus").css("display","none")
        $(".all_walk").css("display","none")
        addMap('car_map');
        goToByCar();
    });
     // 步行导航
        $(".top_item li").eq(2).on("touchend",function(){
        $(".all_car").css("display","none")
        $(".all_bus").css("display","none")
        $(".all_walk").css("display","block")
        addMap('walk_map');
        goToByWalk();
    });
    })
    $("#back_suiwei").on("touchend",function(){
        $(".suiwei_road").animate({left:"100%"},"slow")    
    })
    $("#back_bus").on("touchend",function(){             
        $(".bus_nav").animate({left:"100%"},"slow");
    });
    var main=setInterval(function(){
         
        // copyright
        $(".amap-copyright").css("z-index","-9999999999")
        // 取消公交详情展示
        $("#bus_tip .amap-lib-transfer .plan").css("display","none");
        $("#car_road .amap-lib-driving .plan").css("display","block");
        $("#walk_road .amap-lib-walking .plan").css("display","block");
        $("#bus_tip .amap-lib-transfer .planTitle").on("touchend",function(){
        $("#bus_tip .amap-lib-transfer .plan").css("display","block");
        $("#bus_tip").css("display","none").fadeOut("slow")
        $(".bus_main_num").html($(this).find("h3").html())
        $(".bus_main_subnum").html($(this).find("p").html());
        // if($(this).prev().length==0){
            
        //     addMap("bus_map")
        //     goToByBus()
            
        // }
        //公交详情
        $(".bus_nav .amap-lib-transfer .planTitle").html($(this).html())
        $(".bus_nav .amap-lib-transfer .plan").html($(this).next().html())
        $(".bus_nav .amap-lib-transfer .plan").css("display","block")
         // 公交车详情
        $(".amap-lib-transfer .plan dd a.icon-arrow").on("touchend",function(){
            if($(this).parent().find('ul').css('display')=="none"){
                $(this).parent().find('ul').css("display","block");
                $(this).addClass("expand")
            }else{
                $(this).parent().find('ul').css("display","none");
                $(this).removeClass("expand")
                }    
                })
        // if($(this).prev().length==0){
            
        //     goToByBus()
        //     clearInterval(main)
        // }
        //  clearInterval(main)
        // alert("gh")
        // $(".bus_nav").animate({left:"0"},"slow")
    })
    // car

    },10)
// setTimeout(function(){
//     clearInterval(main);
// },10000)

}
// 添加地图并定位
function addMap(id){
    map = new AMap.Map(id, {
        mapStyle: 'amap://styles/normal',
        resizeEnable: true,
        zoom: 14
    });
    map.setFeatures(['bg','road','building','point'])
    map.plugin('AMap.Geolocation', function() {
        geolocation = new AMap.Geolocation({
            enableHighAccuracy: true,//是否使用高精度定位，默认:true
            timeout: 10000,          //超过10秒后停止定位，默认：无穷大
        //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            buttonPosition:'RB',
            panToLocation:true,
            showCircle:true,
            showButton:false
        });
        map.addControl(geolocation);
        // geolocation.getCurrentPosition();//定位到中心
        AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
        AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
    });
              
 }
 // 公交路经规划
function goToByBus(){
            // 清空bus_tip所有子节点
            $("#bus_tip").html('');
            AMap.service(["AMap.Transfer"], function() {
            var transOptions = {
            map: map,
            city: current_city,
            panel:'bus_tip',                            //公交城市
            //cityd:'乌鲁木齐',
            policy: AMap.TransferPolicy.LEAST_TIME //乘车策略
                };
            //构造公交换乘类
            var trans = new AMap.Transfer(transOptions);
            //根据起、终点坐标查询公交换乘路线
            trans.search([{keyword:user_curent_site},{keyword:user_aim_site}], function(status, result){
                
            });    
            });
}
//  驾车路线
 function goToByCar(){
        // 清空car_road所有子节点
        $("#car_road").html('');
        // 导航路线 
         var drivingOption = {
         policy:AMap.DrivingPolicy.LEAST_TIME
         };
         var driving = new AMap.Driving(drivingOption); //构造驾车导航类
         //  user_curent_site=getAddress("珠海市",user_curent_lnglatXY)
         //根据起终点坐标规划驾车路线
         driving.search([{keyword:user_curent_site},{keyword:user_aim_site}], function(status, result){
		 if(status === 'complete' && result.info === 'OK'){
			(new Lib.AMap.DrivingRender()).autoRender({
				data: result,
                map: map,
                panel: 'car_road'
            });
            // 调起app导航
                 $(".car_instru").on("touchend",function(){
                    driving.searchOnAMAP({
                origin:result.origin,
                destination:result.destination
            });
            }) 
            // alert($("#drive_nav .planTitle p").html());
            $(".car_time").html($("#car_road .planTitle p").html()+"路程最短")
		 }else{
             
             console.log("没有合适的路线！")
         }
	     });
 }
//  步行路线
function goToByWalk(){
     // 清空walk_road所有子节点
        $("#walk_road").html('');
    var walking = new AMap.Walking({
            map: map,
            panel: "walk_road"
            }); 
            //根据起终点坐标规划步行路线
            walking.search([{keyword:user_curent_site,city:current_city},{keyword:user_aim_site,city:current_city}], function(status, result){
                    // 调起app导航
                    $(".walk_instru").on("touchend",function(){
                        walking.searchOnAMAP({
                            origin:result.origin,
                            destination:result.destination
                        });
                    } )
                });
            setInterval(function(){
            $(".walk_time").html($("#walk_road .amap-lib-walking .planTitle p").html())
            },10)
}
//  显示驾车路线
function show_instru_road(){
                if(show_car_instru_flag){
                $(".show_car").text("收起驾车详情")
                $("#car_map").animate({height:"60%"},"slow");
                $(".car_bottom_nav").animate({bottom:"0",height:"50%"},"slow");
                $("#car_road").animate({height:"100%",top:"80px"},"slow");
                show_car_instru_flag=false;
            }else{
                 $(".show_car").text("查看驾车详情")
                $("#car_map").animate({height:"100%"},"slow");
                $(".car_bottom_nav").animate({position:"absolute",bottom:"45px",height:"80px"},"slow");
                $("#car_road").animate({height:"0px"},"slow");
                show_car_instru_flag=true; 
            }
}
// 显示步行路线
function show_walk_road(){
     if(show_walk_instru_flag){
                $(".show_walk").text("收起步行详情")
                $("#walk_map").animate({height:"60%"},"slow");
                $(".walk_bottom_nav").animate({bottpm:"50%",height:"50%"},"slow");
                $(".walk_road").animate({height:"100%",top:"80px"},"slow");
                show_walk_instru_flag=false;
            }else{
                 $(".show_walk").text("查看步行详情")
                $("#walk_map").animate({height:"100%"},"slow");
                $(".walk_bottom_nav").animate({position:"absolute",bottom:"45px",height:"80px"},"slow");
                $(".walk_road").animate({height:"0px"},"slow");
                show_walk_instru_flag=true; 
            }
}
// 关闭提示
function closePoi(){
    // setTimeout(function(),500)
    $(".amap-sug-result").css("display","none")
}
// 定位
function getAPosition(){
    map.plugin('AMap.Geolocation', function() {
    geolocation = new AMap.Geolocation({
        enableHighAccuracy: true,//是否使用高精度定位，默认:true
        timeout: 10000,          //超过10秒后停止定位，默认：无穷大
    //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
        zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        buttonPosition:'RB',
        panToLocation:true,
        showCircle:true,
        showButton:false
        });
        map.addControl(geolocation);
        // 蓝点
        geolocation.getCurrentPosition();
        AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
        AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
    });
}
//定位完成
function onComplete(data) {
    var lnglatXY=[data.position.getLng(), data.position.getLat()];//地图上所标点的坐标
    user_curent_lnglatXY=lnglatXY;
    user_curent_site=data.formattedAddress;
    setTimeout(function(){$(".current_site_text").html(user_curent_site);},1000)
     // 公交路径规划
    addMap('bus_map');
    goToByBus();
}
//定位错误信息
function onError(data) {
        alert("定位失败！")
}
// 清除输入框
function clearInput(){
    $("#search_top").val('')
}
// 输入框获取焦点
function isOnFocus(focus){
    // 
    var top_tip=$(".top_tip");
    var search_top=$("#search_top");
    var clear=$(".clear");
    var bottom_nav=$(".bottom_nav");
    var navi_btn=$(".navi_btn")
    // //////////
    var isshowClear;
    if(focus==1){
        top_tip.css("display","block");
        isshowClear=setInterval(function(){
        if(search_top.val()!=''){
            clear.css("display","block")   
        }else{
           clear.css("display","none")   
        }
    },500) 
    //  底部动态效果
     bottom_nav.animate({height:"120px"},"slow")
     navi_btn.animate({bottom:"90px"},"slow")
    }
    if(focus==0){
        clearInterval(isshowClear)
        clear.css("display","block")
        // closePoi();
        top_tip.css("display","none");
          //  底部动态效果
        bottom_nav.animate({height:"60px"},"slow")
        navi_btn.animate({bottom:"30px"},"slow")
    }
}
// 路径规划
// 获取城市信息
function GetCity(){
     var citysearch = new AMap.CitySearch();
             //自动获取用户IP，返回当前城市
        citysearch.getLocalCity(function(status, result) {
            if (status === 'complete' && result.info === 'OK') {
                if (result && result.city && result.bounds) {
                    var cityinfo = result.city;
                    var citybounds = result.bounds;
                    current_city=cityinfo;
                    // document.getElementById('tip').innerHTML = '您当前所在城市：'+cityinfo;
                    //地图显示当前城市
                    map.setBounds(citybounds);
                }
            } else {
                // 未获得城市
            }
        });
    }
