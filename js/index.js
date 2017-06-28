var url_head="https://www.pojumws.cn";
// 发送验证码
function upPhone(json){
    $.ajax({
        type: 'POST',
        url:url_head+'/body/user/sendLoginMsg',
        data:json,
        dataType:"json",
        cache: false,
        success: function(data){
            if(data.code){
                alert(data.msg);//发送json之后，服务器的返回
                 // 禁用按钮
                var sec=59;
                $('.input_code_btn').attr('disabled',"true");//添加disabled属性 
                var inter=setInterval(function(){
                if(sec>0){
                $(".input_code_btn").text("已发送("+sec+"s)");
                sec--;
                }else{
                 $(".input_code_btn").text("发送验证码");  
                 $('.input_code_btn').removeAttr("disabled");// 移除disabled属性 
                clearInterval(inter);
            }
                
        },1000)
        }else{
            alert(data.msg)
        }
                
        },
        error: function(e) { 
        alert("发送失败"); 
    } 
    });
}
// 绑定
function upPhoneALCode(json){
    $.ajax({
        type: 'POST',
        url:url_head+'/body/user/login',
        data:json,
        dataType:"json",
        cache: false,
        success: function(data){
            if(data.code==200){
                location.href="html/loged.html"
            }else{
            alert(data.msg)
        }    
        },
        error: function(e) { 
        alert("绑定失败！"); 
    } 
});
// test 跳转

}
// 获取订单
function getAllOrder(){
    $.ajax({
        type: 'GET',
        url:url_head+'/body/order/query',
        body:{},
        dataType:"json",
        cache: false,
        success: function(data){
            // if(data.code==200){
            //    alert(data.content); 
            // }    
        },
        error: function(e) { 
        alert("获取失败！"); 
    } 
    });
}
// sendcode click
function sendPhone(){
    if(testPhone($(".input_phone").val())){
        var jsonString ='{"apple":"'+$(".input_phone").val()+'"}';
        var json=JSON.parse(jsonString);
        upPhone(json);
    }else{
        alert("你输入的电话有误！");
    }
   
}
function senPhoneALCode(){
    var jsonString ='{"apple":"'+$(".input_phone").val()+'"'+',"loginCode":"'+$(".input_code").val()+'"}';
    var json=JSON.parse(jsonString);
    upPhoneALCode(json);
}

//监测数据
//  电话
function testPhone(phone){
    if(!(/^1[34578]\d{9}$/.test(phone))){
        return false;
    }else{
        return true;
    }
}