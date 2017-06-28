// golobel args
// var map;//地图
var geolocation;//地理编码信息
var show_car_instru_flag=true;
var show_walk_instru_flag=true;
var show_bus_instru_flag=true;
var user_aim_site=$("#aim_site").html();
var user_curent_site=$("#curent_site").html();
var user_aim_lnglatXY;//目的地经纬度
var user_curent_lnglatXY;//当前位置经纬度
function showClear(){
    var t=$(".top_input input").val();
    if(t!=""){
    $(".clear").show();
    }else{
      $(".clear").hide();  
    }
 }
// 显示历史记录
function showhistory(bol){
                if(bol){
                    search_His.his_show=true;
                    $("#map_top_nav").css("height","100%").fadeIn(1000);
                    $("#search_His").css("height","100%").fadeIn(1000);
                    $("#map_bottom_nav").animate({height:"60px"},"slow")
                    $(".navi_btn").animate({bottom:"30px"},"slow")
                }else{
                    search_His.his_show=false;
                     $("#map_top_nav").css("height","44px").fadeIn(1000);
                     $("#search_His").css("height","0").fadeIn(1000); 
                     $("#map_bottom_nav").animate({height:"120px"},"slow")
                     $(".navi_btn").animate({bottom:"90px"},"slow")
                     goToByBus();
                     closePoi();
                }        
 }
//清除历史记录 
function clearSeaarch(){
    var t=$(".top_input input").val(""); 
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
// 定位完成
function onComplete(data) {
         $("#current_site").html(data.formattedAddress)
         var lnglatXY=[data.position.getLng(), data.position.getLat()];//地图上所标点的坐标
         user_curent_lnglatXY=lnglatXY; 
         user_curent_site=data.formattedAddress;
        // map.setZoomAndCenter(14,[user_curent_lnglatXY[0],user_curent_lnglatXY[1]]);  
    }
// 逆地理编码传入城市和经纬度
function getAddress(one_city,lnglatXY){
    var geocoder = new AMap.Geocoder({
          city:one_city//城市，默认：“全国”
        });
    geocoder.getAddress(lnglatXY, function(status, result) {
            if (status === 'complete' && result.info === 'OK') {
            //获得了有效的地址信息:
             return result.regeocode.formattedAddress;
                }else{
                alert("获取地址失败")
            }
        });    
    }
// 地理编码传入城市和地址
function getLocation(one_city,address,lnglatXY){
     var geocoder = new AMap.Geocoder({
          city:one_city//城市，默认：“全国”
        });
    geocoder.getLocation(address, function(status, result) {
    if (status === 'complete' && result.info === 'OK') {
                //比如在获得的经纬度上打上一个Marker
                // marker.setPosition(result.geocodes[0].location);
                // map.setCenter(marker.getPosition())
         lnglatXY=[result.geocodes[0].location.getLng(),result.geocodes[0].location.getLat()];   
     }else{
        //获取经纬度失败
         }
            });   

 }
//解析定位错误信息
function onError(data) {
        alert("定位失败！")
 }
// 公交路经规划
function goToByBus(){
     // 清空bus_road所有子节点
            $("#bus_nav").html('');
            AMap.service(["AMap.Transfer"], function() {
            var transOptions = {
            map: map,
            city: current_city,
            panel:'bus_nav',                            //公交城市
            //cityd:'乌鲁木齐',
            policy: AMap.TransferPolicy.LEAST_TIME //乘车策略
                };
            //构造公交换乘类
            var trans = new AMap.Transfer(transOptions);
            //根据起、终点坐标查询公交换乘路线
            trans.search([{keyword:$("#current_site").html()},{keyword:$("#aim_site").html()}], function(status, result){
                
            });    
            });
 }
//展示公交路线
function show_road(show){
    if(show==1){
          if($("#current_site").html()==""){
        alert("请先确定你的位置！");
        return;
    }else{
        suiwei_road.show=true;
         $("#suiwei_road").animate({left:"0"},"1500")
        //  //  背景消失
        $("#map_bottom_nav").css("display","none")
        $(".navi_btn").css("display","none")
    }
    }
    if(show==0){
        $("#suiwei_road").animate({left:"100%"},"1500","linear",function(){
           suiwei_road.show=false;
           //  背景导航显示 // 
           $("#map_bottom_nav").css("display","block")
           $(".navi_btn").css("display","block")
        })
        }
        suiwei_road.show_bus()//初次进入显示公交路线
        
 }

// Vue。js
// 设定位置到中心和缩放级别
function setCenter(sc){
    getAPosition();
    map.setZoomAndCenter(sc,[user_curent_lnglatXY[0],user_curent_lnglatXY[1]]);
    $("#map_bottom_nav").animate({height:"120px"},"slow")
    $(".navi_btn").animate({bottom:"90px"},"slow")
 }
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
var search_His=new Vue({
        el:"#search_His",
        data:{
            his:sea_history,
            his_show:false,
            null_his_show:false,
            clear_his_show:false
        },
        "created":function(){
        setInterval(() => { 
            if(sea_history.length<=0){
               this.null_his_show=true; 
               this.clear_his_show=false;
            }else{
                this.null_his_show=false; 
               this.clear_his_show=true; 
            }
    }, 1000)
        }
    })
var suiwei_road = new Vue({
        el:"#suiwei_road",
        data:{
            show:false,
            bus_show:true,
            car_show:false,
            walk_show:false,
            instru_show:true,
            styleObj1:{
                color:"#43c2cb",
                borderBottom:"2px solid #43c2cb"
            },
            styleObj2:{
                color:"#000",
                borderBottom:"0px solid #43c2cb"
            },
            styleObj3:{
                color:"#000",
                borderBottom:"0px solid #43c2cb"
            }
            },
    methods:{
        show_bus:function(){
            // goToByBus();
            this.styleObj1.color="#43c2cb";
            this.styleObj1.borderBottom="2px solid #43c2cb";
            this.styleObj2.color="#000";
            this.styleObj2.borderBottom="0px solid #43c2cb";
            this.styleObj3.color="#000";
            this.styleObj3.borderBottom="0px solid #43c2cb";
            this.bus_show=true;
            this.car_show=false;
            this.walk_show=false;
            // 添加地图
            addMap("bus_map");
            setCenter(12);
            // 公交路线
            // 清空bus_road所有子节点
            $("#bus_nav").html('');
            AMap.service(["AMap.Transfer"], function() {
            var transOptions = {
            map: map,
            city: current_city,
            panel:'bus_nav',                            //公交城市
            //cityd:'乌鲁木齐',
            policy: AMap.TransferPolicy.LEAST_TIME //乘车策略
                };
            //构造公交换乘类
            var trans = new AMap.Transfer(transOptions);
            //根据起、终点坐标查询公交换乘路线
            trans.search([{keyword:$("#current_site").html()},{keyword:$("#aim_site").html()}], function(status, result){
                });    
            });
        
        
        
         },
        show_car:function(){
            this.styleObj2.color="#43c2cb";
            this.styleObj2.borderBottom="2px solid #43c2cb";
            this.styleObj1.color="#000";
            this.styleObj1.borderBottom="0px solid #43c2cb";
            this.styleObj3.color="#000";
            this.styleObj3.borderBottom="0px solid #43c2cb"; 
            this.bus_show=false;
            this.car_show=true;
            this.walk_show=false;
            // 添加地图
            addMap("car_map");
            setCenter(12);
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
                panel: "drive_nav"
            });
            // 调起app导航
                 $(".car_instru").on("touchend",function(){
                    driving.searchOnAMAP({
                origin:result.origin,
                destination:result.destination
            });
            }) 
            // alert($("#drive_nav .planTitle p").html());
              $(".drive_nav_tip_text").html($("#drive_nav .planTitle p").html()+"路程最短")
		 }else{
             
             console.log("没有合适的路线！")
         }
	     });

   
  
         },
        show_walk:function(){
            this.styleObj3.color="#43c2cb";
            this.styleObj3.borderBottom="2px solid #43c2cb";
            this.styleObj2.color="#000";
            this.styleObj2.borderBottom="0px solid #43c2cb";
            this.styleObj1.color="#000";
            this.styleObj1.borderBottom="0px solid #43c2cb";
            this.bus_show=false;
            this.car_show=false;
            this.walk_show=true;
            addMap("walk_map")
            //步行导航
            var walking = new AMap.Walking({
            map: map,
            panel: "walk_nav"
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
            $(".walk_nav_tip_text").html($("#walk_nav .amap-lib-walking .planTitle p").html())
            },10)
        },
        show_bus_road:function(){
            if(show_bus_instru_flag){
                $(".show_bus_router").text("收起公交详情")
                $("#bus_map").animate({height:"60%"},"slow");
                $(".bus_nav_tip").animate({bottom:"0",height:"50%"},"slow");
                $(".bus_nav").animate({height:"120%",top:"80px"},"slow");
                show_bus_instru_flag=false;
            }else{
                 $(".show_bus_router").text("查看公交详情")
                $("#bus_map").animate({height:"100%"},"slow");
                $(".bus_nav_tip").animate({position:"absolute",bottom:"0",height:"80px"},"slow");
                $(".bus_nav").animate({height:"0px"},"slow");
                show_bus_instru_flag=true; 
            }
          
         },
        show_instru_road:function(){
            if(show_car_instru_flag){
                $(".show_car_router").text("收起驾车详情")
                $("#car_map").animate({height:"60%"},"slow");
                $(".drive_nav_tip").animate({bottom:"0",height:"50%"},"slow");
                $(".drive_nav").animate({height:"100%",top:"80px"},"slow");
                show_car_instru_flag=false;
            }else{
                 $(".show_car_router").text("查看驾车详情")
                $("#car_map").animate({height:"100%"},"slow");
                $(".drive_nav_tip").animate({position:"absolute",bottom:"0",height:"80px"},"slow");
                $(".drive_nav").animate({height:"0px"},"slow");
                show_car_instru_flag=true; 
            }
         },
        show_walk_road:function(){
            if(show_walk_instru_flag){
                $(".show_walk_router").text("收起步行详情")
                $("#walk_map").animate({height:"60%"},"slow");
                $(".walk_nav_tip").animate({bottpm:"50%",height:"50%"},"slow");
                $(".walk_nav").animate({height:"100%",top:"80px"},"slow");
                show_walk_instru_flag=false;
            }else{
                 $(".show_walk_router").text("查看步行详情")
                $("#walk_map").animate({height:"100%"},"slow");
                $(".walk_nav_tip").animate({position:"absolute",bottom:"0",height:"80px"},"slow");
                $(".walk_nav").animate({height:"0px"},"slow");
                show_walk_instru_flag=true; 
            }

         },
        show_current_bus:function(){
               
         }
        }

    })
