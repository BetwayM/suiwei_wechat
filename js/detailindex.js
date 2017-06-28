var orderid;//订单ID
var user_lat;
var user_lng;//用户位置
var end_time;//订单结束时间
// urlhead
var url_head="https://www.pojumws.cn";

window.onload=function(){

        // 禁用按钮
        banBTN()
        getOrderID() //获取订单号
        getOrderData(orderid)//获取订单详情 
 }
 function Tip(str){
      // 提示
         commit_tip.tip=str
        $("#commit_tip").animate({top:"0"},1500,"linear",function(){
            setTimeout(function() {
                $("#commit_tip").animate({top:"-68px"},1500)
            }, 1000);
        })
            
 }
// 禁用按钮
 function banBTN(){
    // 禁用按钮
    $(".order_btn").attr('disabled',"true");//添加disabled属性 
    $(".order_btn").css("background","#dde1e1")
    $(".order_btn").css("color","#797979")  
     }
//  启用按钮
function openBTN(){
    //启用按钮
    $(".order_btn").css("background","#43c2cb")
    $(".order_btn").css("color","#fff")
    $(".order_btn").removeAttr("disabled");// 移除disabled属性 
}

 function getUserPosition(){
       $(".order_btn").text("定位中...")
    var map, geolocation;
    //加载地图，调用浏览器定位服务
    map = new AMap.Map('', {
        resizeEnable: true
    });
    map.plugin('AMap.Geolocation', function() {
        geolocation = new AMap.Geolocation({
            enableHighAccuracy: true,//是否使用高精度定位，默认:true
            timeout: 10000,          //超过10秒后停止定位，默认：无穷大
         
        });
        map.addControl(geolocation);
        geolocation.getCurrentPosition();
        AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
        AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
    });
  
  }
     //解析定位结果
    function onComplete(data) {
        
        user_lng= data.position.getLng();
        user_lat= data.position.getLat();
        //启用按钮
        $(".order_btn").text("确认到达");
         openBTN();
        $(".order_btn").on("touchend",function(){
             arrive(orderid,user_lat,user_lng);
            });  
    }
    //解析定位错误信息
    function onError(data) {
        $(".order_btn").text("定位失败");
    }
function getOrderID(){
    var location=window.location.href;
    var indexof=location.indexOf("=");
    orderid=location.substring(indexof+1,location.length);
    if(orderid.length==0){}
 }
//  时间戳转换
 function Time_turn(n){
    return new Date(parseInt(n)).toLocaleString().replace(/:\d{1,2}$/,' ');
  }

//   随卫到达目的地
function arrive(orid,lat,lng){
    var jsonString='{"oid":"'+orid+'",'+'"lat":"'+lat+'","lng":"'+lng+'"}';
    var json=JSON.parse(jsonString);
    $.ajax({
        type: 'POST',
        url:url_head+'/body/order/arrive',
        data:json,
        dataType:"json",
        cache: false,
        success: function(data){
            if(data.code==200){
                $(".order_state b").html("已到达")
                $(".order_btn").text("完成订单");
                banBTN();
                // 提示
                Tip("您已到达目的地,可执行任务!")
                var time = (end_time.getTime() - (new Date().getTime()));
                alert(time);
                if (time < 0) {
                    openBTN();
                    $(".order_btn").on("touchend",function(){
                // 完成订单
                    EndOrder(orderid);
                    });
                } else {
                    if (time / (24*60*60*1000) > 2) return;
                setTimeout(function() {
                    openBTN();
                    $(".order_btn").on("touchend",function(){
                // 完成订单
                    EndOrder(orderid);
                });
                }, time);
            }
                //  banBTN();
            }else{
                alert(data.msg)
            }   
        },
        error: function(e) { 
            //跳转到错误页面
        window.location.href="../html/error.html"
    } 
});
 }
//  完成订单
function EndOrder(orid){
    var jsonString='{"oid":"'+orid+'"}';
    var json=JSON.parse(jsonString);
    $.ajax({
        type: 'POST',
        url:url_head+'/body/order/complete',
        data:json,
        dataType:"json",
        cache: false,
        success: function(data){
            if(data.code==200){
                $(".order_state b").html("已完成")
                $(".order_btn").text("已完成");
                    banBTN();
                   // 提示
                Tip("您已完成任务!");
            }else{
                alert(data.msg)
            }    
        },
        error: function(e) { 
          //跳转到错误页面
        window.location.href="../html/error.html"
    } 
});
}
// 通过订单号获取订单详情
function getOrderData(orid){
    var jsonString='{"oid":"'+orid+'"}';
    var json=JSON.parse(jsonString);
    $.ajax({
        type: 'GET',
        url:url_head+'/body/order/queryInfo',
        data:json,
        dataType:"json",
        cache: false,
        success: function(data){
            if(data.code==200){
                //计算结束时间
                //
                let date = new Date(Number(data.content.appointment));
                date.setDate(date.getDate() + data.content.day - 1);
                date.setHours(date.getHours() + data.content.company);
                end_time=date;
                // 是否需要定位
                if(data.content.state==3){
                    getUserPosition();
                }
                // 数据处理
                if(data.content.vehicle==0){data.content.vehicle="不带车"}
                if(data.content.vehicle==1){data.content.vehicle="轿车"}
                if(data.content.vehicle==2){data.content.vehicle="商务车"}
                if(data.content.module_type==0){data.content.module_type="帮我选"}
                if(data.content.module_type==1){data.content.module_type="我来选"}
                if(data.content.module_type==2){data.content.module_type="高端定制"}
                if(data.content.type==0){data.content.type="普通订单"}
                if(data.content.type==1){data.content.type="紧急订单"}
                if(data.content.state==3){data.content.state="已付款"}
                if(data.content.state==4){data.content.state="已到达"}
                if(data.content.state==5){data.content.state="已完成"}
                // 时间转换
                data.content.time=new Date(Number(data.content.time)).format('yyyy-MM-dd hh:mm')
                data.content.appointment=new Date(Number(data.content.appointment)).format('yyyy-MM-dd hh:mm')
                Order_All.OrderData= data.content 
              
            }else{
                alert(data.msg)
            }    
        },
        error: function(e) { 
          //跳转到错误页面
        window.location.href="../html/error.html"
    } 
    });    
 }
var Top_nav=new Vue({
    el:"#Top_nav",
    data:{
        styleObj1:{
           color:"#43c2cb",
           borderBottom:"2px solid #43c2cb"
        },
        styleObj2:{
           color:"#000",
           borderBottom:"0px solid #43c2cb"
        }

    },
     methods:{
        // 界面切换
        show_Order:function(){
            Order_All.order_show=true;
            Order_All.contact_show=false;
            // addTime_Order.add_show=true;
            // 导航样式转换
            var t;
            t=this.styleObj1;
            this.styleObj1=this.styleObj2;
            this.styleObj2=t;
            t=Order_All.styleObj3;
            Order_All.styleObj3=Order_All.styleObj4;
            Order_All.styleObj4=t

        },
        show_Contact:function(){
            Order_All.order_show=false;
            Order_All.contact_show=true;
            // addTime_Order.add_show=false;
            // 导航样式转换
            var t;
            t=this.styleObj1;
            this.styleObj1=this.styleObj2;
            this.styleObj2=t;
             t=Order_All.styleObj4;
            Order_All.styleObj4=Order_All.styleObj3;
            Order_All.styleObj3=t
            
        }
    }

 })
// var Order={order_id:"013",order_state:"服务中...",order_num:"3254665",type:"普通订单",m_order_time:"2017-05-18 02:15",order_man:"一般随卫",time_type:"普通时间",order_time:"4",order_currentTime:"2017/04/05至2017/04/05",order_currentDay:1,order_day:"1",order_start:"09:30",order_car:"不带",order_men:"3",order_site:"珠海市香洲区景乐路55号珠海市香洲区景乐路55号",addtime:[{order_state:"订单正在服务中...",order_start_date:"2017/08/19",order_end_date:"2017/08/22",order_day:4,order_start:"09:30",order_time:"8",can_add:"true"},{order_state:"已完成",order_start_date:"2017/08/19",order_end_date:"2017/08/21",order_day:3,order_start:"09:30",order_time:"8",can_add:"false"},{order_state:"已完成",order_start_date:"2017/08/19",order_end_date:"2017/08/22",order_day:4,order_start:"09:30",order_time:"4",can_add:"false"}],contact_user:"赖小姐",contact_phone:"15232654596",user_tip:"无",suiwei:[{name:"吴随卫",phone:"15888456245"},{name:"张随卫",phone:"15888456245"},{name:"黄随卫",phone:"15888456245"}]}
var Order_All=new Vue({
    el:"#Order_All",
    data:{
       add_order_state:[],
       OrderData:{},
       order_show:true,
       contact_show:false,
       isUpdate:true,
        styleObj3:{
            marginTop:"54px"
        },
        styleObj4:{
            marginTop:"54px"
        }
     },
    "created":function(){
        setTimeout(function() {  
            if($(".order_state b").html()=="已付款"){}
            // 
        if($(".order_state b").html()=="已到达"){
            $(".order_btn").text("完成订单");
            var time = (end_time.getTime() - (new Date().getTime()));
            
            if (time < 0) {
                openBTN();
                 $(".order_btn").on("touchend",function(){
            // 完成订单
                EndOrder(orderid);
            });
        } else {
            if (time / (24*60*60*1000) > 2) return;
            setTimeout(function() {
                openBTN();
                 $(".order_btn").on("touchend",function(){
            // 完成订单
                EndOrder(orderid);
            });
                }, time);
            }
        }
        if($(".order_state b").html()=="已完成"){}
        }, 500);

   
    },
    methods:{
        tomap:function(){
            window.location.href="../map/index.html?lat="+this.OrderData.lat+',lng='+this.OrderData.lng;
        }
    }
 })

var commit_tip=new Vue({
    el:"#commit_tip",
    data:{
        tip:"你已到达目的地,可开始执行任务!"
    }   
})
 Date.prototype.format = function(format) {
  let date = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),
    "S+": this.getMilliseconds()
  };
    if (/(y+)/i.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (var k in date) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1
          ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
    }
  }
  return format;
  }
// 加时订单
// var addTime_Order=new Vue({
//     el:"#addTime_Order",
//     data:{
//         Addorder:Order[0].addtime,
//         add_show:true
//     },
//     methods:{

//     }    
//  })
// var main_addOrder=new Vue({
//     el:"#main_addOrder",
//     data:{
//         Addorder:[{order_state:"s"},{order_state:"ft"}]
//     },
//     methods:{

//     }    
// })
// var AComponent = Vue.extend({
//   props: ['text'],
//   template: '<li>A Component: {{ text }}</li>'
// })

// var BComponent = Vue.extend({
//   props: ['text'],
//   template: '<li>B Component: {{ text }}</li>'
// })


// new Vue({
//   el: '#app',
//   components: {
//     'a-component': AComponent,
//     'b-component': BComponent,
//   },
//   data: {
//     items: []
//   },
//   methods: {
//     add(component, text) {
//       this.items.push({
//         'component': component,
//         'text': text,
//       })
//     }
//   }
// })