// test data
var suiweiinfo;
var orderdata;
// urlhead
var url_head="https://www.pojumws.cn";
window.onload=function(){
        getUserInfo()//获取随卫信息
        getOrderData()//获取订单数据
        setTimeout(function(){
            getUserStateInfo()
        },1000)
        
 }
$(document).ready(function(){
     
   })

//    获取随卫状态
function getUserStateInfo(){
    var $this =$(".change_state");
            $.ajax({
            type: 'GET',
            url:url_head+'/body/attendance/info',
            body:{},
            dataType:"json",
            cache: false,
            success: function(data){
                if(data.code==200){
                    $this.attr('this_state', data.content);
                    $this.on("touchend",changeUserStateInfo);
                    if(data.content==1){
                        $this.html("待命");
                    }else{
                        $this.html("出勤"); 
                    }
                }else{
                 alert(data.msg)
             }   
        },
        error: function(e) { 
            alert("随卫状态获取失败!")
        
    } 
    });
}
//    修改随卫状态
function changeUserStateInfo(){
    
    var $this = $(this);
     $this.attr('disabled',"true");//添加disabled属性 
     $this.html("...");
     var state = Number($this.attr('this_state'));
     var setting = {
         0: {
             url: '/body/attendance/entrance',
             text: '待命',
             state: 1
         },
         1: {
             url: '/body/attendance/standby',
             text: '出勤',
             state: 0
         }
     }
     var con=confirm('是否'+setting[state].text+'?');
     if (con) {
        $.ajax({
            type: 'POST',
            url: url_head+setting[state].url,
            body:{},
            dataType:"json",
            cache: false,
            success: function(data){
                    $this.attr('this_state', setting[state].state);
                if(data.code==200){
                    setTimeout(function(){
                        $this.html(setting[state].text);
                        $this.removeAttr("disabled");// 移除disabled属性 
                    },2000)   
             }else{
                 alert(data.msg)
             }    
        },
        error: function(e) { 
            alert("随卫状态修改失败!")
        }
        
    });
     }

     
}
// 获取随卫信息
function getUserInfo(){
    $.ajax({
        type: 'GET',
        url:url_head+'/body/user/info',
        body:{},
        dataType:"json",
        cache: false,
        success: function(data){
            if(data.code==200){
              top_main.suiweidata=data.content;
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
// 获取数据
function getOrderData(){
     $.ajax({
        type: 'GET',
        url:url_head+'/body/order/query',
        body:{},
        dataType:"json",
        cache: false,
        success: function(data){
            if(data.code==200){
                // 时间戳转换
            data.content.forEach(function(item) {
                item.time=new Date(Number(item.time)).format('yyyy-MM-dd hh:mm')
            });

            //  for(var i=0;i<data.content.length;i++){
            //      data.content[i].time=Time_turn(data.content[i].time)
            //     }
              all_order.orderlist=data.content;
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
//  顶部vue
var top_main=new Vue({
    el:"#top_main",
    data:{
        suiweidata:{},
        state:""
    },
    methods:{
        
    },
    "created":function(){
        // alert("fg");

    }
    
 })
// var order=[{ordernum:"123456",order_state:"执行中",order_time:"2017-05-06 02:25"},{ordernum:"123456",order_state:"已完成",order_time:"2017-05-06 02:25"}]
// order Vue
var all_order=new Vue({
    el:"#all_order",
    data:{
        orderlist:[],
        clickIndex:"0"//列表索引
    },
    "created":function(){
    //     setInterval(() =>{
    //     },10)
    },
    methods:{ 
         //    跳转到订单详情
        detail_Click:function(index){
            var jump=this.orderlist[index].oid;
            location.href="../html/detailindex.html?jump="+jump;
         } 
    }
   
 })
// 时间转化
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

