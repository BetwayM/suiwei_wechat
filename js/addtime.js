function add(){
    var day=$(".day_text").val();
    day++;
    $(".day_text").val(day);
}
function reduce(){
    var day=$(".day_text").val();
    day--;
    if(day<=0){day=1;}
    $(".day_text").val(day);
}
var chossed_time="4小时/天";
            $(".add_right_main button").click(function(){  
            var clickThis=$(this).html();
            chossed_time=clickThis;
            var strarr=$(".add_right_main button");
                if(strarr.eq(0).html()==clickThis){
                   strarr.eq(0).css("background","#43c2cb")
                   strarr.eq(1).css("background","#fff")
                   strarr.eq(2).css("background","#fff")
                }
                if(strarr.eq(1).html()==clickThis){
                   strarr.eq(0).css("background","#fff")
                   strarr.eq(1).css("background","#43c2cb")
                   strarr.eq(2).css("background","#fff")
                }
                if(strarr.eq(2).html()==clickThis){
                   strarr.eq(0).css("background","#fff")
                   strarr.eq(1).css("background","#fff")
                   strarr.eq(2).css("background","#43c2cb")
                }
                
         });  
    var start_date=$(".start_date").val();
    var day_text=$(".day_text").val();
    var start_time=$(".start_time").val();
    var choose_time=$(".choose_time").val();
        var popView=new Vue({
        el:"#popView",
        data:{date:start_date,time:start_time,day:day_text,choose:chossed_time},
        "created":function(){
            setInterval(() => {
                var start_date=$(".start_date").val();
                popView.date=start_date
                var day_text=$(".day_text").val();
                popView.day=day_text;
                var start_time=$(".start_time").val();
                popView.time=start_time
                var choose_time=$(".choose_time").val();
                popView.choose=chossed_time;
            },100)    
        }
    })
function commit_click(){
    if(checkNull()){
      $("#dropback").css("display","block");
    $("#popView").fadeIn("slow").css("display","block");
}else{
    return;
}
}
function cancel(){
    $("#dropback").css("display","none");
    $("#popView").css("display","none");
}
function commit(){
  $.ajax({
        type: 'POST',
        url:'',
        data:toJson(),
        dataType:"json",
        cache: false,
        success: function(data){
                alert("success");//发送json之后，服务器的返回
        },
        error: function(e) { 
        alert("fail"); 
} 
}); 
}
// 空数据检测
function checkNull(){
    var start_date=$(".start_date").val();
    var day_text=$(".day_text").val();
    var start_time=$(".start_time").val();
    var choose_time=$(".choose_time").val();
    if(start_date==""||day_text==""||start_time==""||choose_time==""){
        alert("请将内容填写完整！");
      return false;  
    }else{
        return true;
    }
}
//json数据转换
function toJson(){
    //test id
    var id="123456"
     var start_date=$(".start_date").val();
    var day_text=$(".day_text").val();
    var start_time=$(".start_time").val();
    var choose_time=$(".choose_time").val();
    var jsonString='{"id":"'+id+'","date":"'+start_date+'","day":"'+day_text+'","time":"'+choose_time+'"}'
    var json=JSON.parse(jsonString);
    return json;
}
// 打电话
function call(obj){
    
}
