
function load_login(){
    $.ajax({
        type:'get',
        url:'http://127.0.0.1:8000/v1/user/login',
        datatype:'json',
        contentType:"application/json;charset=utf-8",
        success:function (result) {
            var show = '';
            if (result.code == 200){
                show += '<img id="bg" src="/static/images/bj.jpg" alt="">';
                show += '<div id="log">';
                    show += '<h3>登录</h3>';
                    show += '<img class="bg1" src="/static/images/xiaoqi.png" alt="">';
                    show += '<input class= "txt" type="text" placeholder="请输入用户名" name="username" id="username">';
                    show += '<input class= "txt" type="password" placeholder="请输入密码" name="userpass" id="userpass">';

                    show += '<input onclick="user_login()" class = "btn" type="button" value="用户登录">';
                    show += '<input onclick="weibo()" class = "btn" type="button" value="微博登录">';
                    show += '<input onclick="window.location.href=\'/register\'" class = "btn" type="button" value="去注册">';
                show += '</div>';
                $('body').html(show)
            }
        }
    })
}

// 普通登录
function user_login() {
    var username = $('#username').val();
    if (!username){alert('请输入您的用户名！')}else{
        var userpass = $('#userpass').val();
        if (!userpass){alert('请输入您的密码！')}else{
            var post_data = {'username':username,'userpass':userpass};
            $.ajax({
                type:'post',
                url:'http://127.0.0.1:8000/v1/user/login',
                data:JSON.stringify(post_data),
                datatype:'json',
                contentType:"application/json;charset=utf-8",
                success:function (result) {
                    if (result.code == 200){
                        window.localStorage.setItem('xiaoqi_token',result.data.token);
                        window.localStorage.setItem('xiaoqi_user',result.data.username);
                        alert('登陆成功！');
                        refer_url = document.referrer;
                        if (refer_url){
                            if (refer_url == 'http://127.0.0.1:5000/register'){
                                window.location.href = '/index'
                            }else{
                                window.location.href = refer_url
                            }
                        }else{
                            window.location.href = '/index'
                        }
                    }else{
                        alert(result.error)
                    }
                }
            })
        }
    }
}


// 微博登陆
function weibo(){
    $.ajax({
        type:'get',
        url:'http://127.0.0.1:8000/v1/user/weibo/url',
        dataType:'json',
        success:function(result){
            if (result.code == 200){
                console.log(result);
                window.location = result.oauth_url
            }else{
                alert('Get weibo url error')
            }
        }
    })
}



$(function(){
    load_login();
});