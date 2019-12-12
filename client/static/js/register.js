
function load_register(){
    $.ajax({
        type:'get',
        url:'http://127.0.0.1:8000/v1/user/register',
        datatype:'json',
        contentType:"application/json;charset=utf-8",
        success:function (result) {
            var show = '';
            if (result.code == 200){
                show += '<img id="bg" src="/static/images/bj.jpg" alt="">';
                show += '<div id="log">';
                    show += '<h3>注册</h3>';
                    show += '<img class="bg1" src="/static/images/xiaoqi.png" alt="">';
                    show += '<input onblur="username()" class= "txt" type="text" placeholder="请输入用户名" name="username" id="username" >';
                    show += '<input class= "txt" type="password" placeholder="请输入密码" name="userpass_1" id="userpass_1">';
                    show += '<input class= "txt" type="password" placeholder="请再次输入密码" name="userpass_2" id="userpass_2">';
                    show += '<input onblur="email()" class= "txt" type="text" placeholder="请输入邮箱" name="email" id="email">';
                    show += '<input class= "txt" type="text" placeholder="请输入邮箱验证码" name="emailpass" id="emailpass">';

                    show += '<input onclick="window.location.href=\'/login\'" class = "btn" type="submit" value="登录">';
                    show += '<input onclick="register()" class = "btn" type="button" value="注册">';
                show += '</div>';
                $('body').html(show)
            }
        }
    })
}

// 验证用户名
function username(){
    var username = $('#username').val();
    if (!username){alert('请输入用户名！')}else{
        $.ajax({
            type:'get',
            url:'http://127.0.0.1:8000/v1/user/register',
            data:{
                "username":username
            },
            datatype:'json',
            contentType:"application/json;charset=utf-8",
            success:function (result) {
                if (result.code == 200){
                    alert(result.data)
                }else {
                    alert(result.error)
                }
            }
        })
    }
}

// 验证邮箱
function email() {
    var email = $('#email').val();
    if (!email){alert('请输入您的邮箱！')}else{
        alert('邮箱验证码已发送 请等待 !');
        $.ajax({
            type:'get',
            url:'http://127.0.0.1:8000/v1/user/register',
            data:{
                "email":email
            },
            datatype:'json',
            contentType:"application/json;charset=utf-8",
            success:function (result) {
                if (result.code == 200){
                    alert(result.data)
                }
            }
        })
    }
}


function getQueryString(v){
    var quert = window.location.search.substring(1);
    var data = quert.split('&');
    for (var i=0;i<data.length;i++){
        // state=123
        var par = data[i].split('=');
        // [state,123]
        if (par[0] == v){
            return par[1]
        }
    }
    return null
}

// 提交注册数据
function register() {
    var username = $('#username').val();
    if (!username){alert('请输入您的用户名！')}else{
        var userpass_1 = $('#userpass_1').val();
        if (!userpass_1){alert('请输入您的密码！')}else{
            var userpass_2 = $('#userpass_2').val();
            if (!userpass_2){alert('请再次输入您的密码！')}else{
                var email = $('#email').val();
                if (!email){alert('请输入您的邮箱！')}else{
                    var emailpass = $('#emailpass').val();
                    if (!emailpass){alert('请输入您的邮箱验证码！')}else{
                        var wuid = getQueryString('wuid');
                        var post_data = {
                            "username":username,
                            "userpass_1":userpass_1,
                            "userpass_2":userpass_2,
                            "email":email,
                            "emailpass":emailpass,
                            'wuid':wuid
                        };
                        $.ajax({
                            type:'post',
                            url:'http://127.0.0.1:8000/v1/user/register',
                            datatype:'json',
                            data:JSON.stringify(post_data),
                            contentType:"application/json;charset=utf-8",
                            success:function (result) {
                                if (result.code == 200){
                                    window.localStorage.setItem('xiaoqi_token', result.data.token);
                                    window.localStorage.setItem('xiaoqi_user', result.data.username);
                                    alert("注册成功 点击确认即可跳转到网站主页");
                                    window.location.href = '/index'
                                }else {
                                    alert(result.error)
                                }
                            }
                        })
                    }
                }
            }
        }
    }
}







$(function(){
    load_register();
});