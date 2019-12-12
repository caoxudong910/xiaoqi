


function load_info() {
    var token = window.localStorage.getItem('xiaoqi_token');
    var user = window.localStorage.getItem('xiaoqi_user');
    // 获取上一个页面传递的商品id
    var id = $.query.get('id');
    $.ajax({
        type:'get',
        url:'http://127.0.0.1:8000/v1/message',
        datatype:'json',
        contentType:'application/json;charset=utf-8',
        data:{'id':id},
        success:function (result) {
            var show = '';
            if (result.code == 200){
                show += '<div id="top">';
                    show += '<div id="nav">';
                        show += '<div id="title">';
                            show += '<b>小柒优品</b>';
                        show += '</div>';
                        show += '<ul>';
                            show += '<li><a class="aa" href="/index">网站首页</a></li>';
                            show += '<li><a class="aa" href="/snacks">零食</a></li>';
                            show += '<li><a class="aa" href="#">数码</a></li>';
                            show += '<li><a class="aa" href="#">服饰</a></li>';
                            show += '<li><a class="aa" href="#">图书</a></li>';
                            show += '<li><a class="aa" href="#">服装</a></li>';
                            show += '<li><a class="aa" href="#">运动</a></li>';
                            show += '<li><a class="aa" href="#">个人中心</a></li>';
                        show += '</ul>';
                        show += '<div id="gwc">';
                            show += '<a class="aa" href="/cart">我的购物车</a>';
                        show += '</div>';
                        show += '<div id="a1">';
                        if (token && user){
                            show += '<span><a class="aa" href="#">欢迎您:'+user+'</a></span>';
                            show += '<span><a onclick="login_out()" class="aa" href="">退出</a></span>';
                        }else{
                            show += '<span><a class="aa" href="/login">登录</a></span>';
                            show += '<span><a class="aa" href="/register">注册</a></span>';
                        }
                        show += '</div>';
                    show += '</div>';
                show += '</div>';
                show += '<div id="mid">';
                    show += '<div id="mid_t">';
                            show += '<img  id="img" src="http://127.0.0.1:8000/static/imgs/snacks/'+result.goods.img+'">';
                            show += '<div id="mid_top">';
                            show += '<h2>'+result.goods.title+'</h2>';
                            show += '<div id="miaoshu1">';
                                show += '<p>小柒价：'+result.goods.market_price+'</p>';
                                show += '<p>厂商：'+result.goods.supplier+'</p>';
                            show += '</div>';
                            show += '<div id="miaoshu2">';
                                show += '<p>库存：'+result.goods.repertory+'件</p>';
                                show += '<p>售出数量：'+result.goods.sell_number+'件</p>';
                            show += '</div>';
                            show += '<div id="miaoshu3">';
                                show += '<p>描述：</p><span>'+result.goods.info+'</span>';
                            show += '</div>';
                            show += '<p>温馨提示 · 支持7天无理由退货(拆封后不支持)</p>';
                            show += '<div id="cart" onclick="cart('+result.goods.id+')">';
                                show += '<p><b>加入购物车</b></p>';
                            show += '</div>';
                        show += '</div>';
                    show += '</div>';
                    show += '<div id="mid_bottom">';
                        show += '<p id="m_t">商&nbsp&nbsp&nbsp品&nbsp&nbsp&nbsp评&nbsp&nbsp&nbsp论</p>';
                        show += '<hr>';
                        show += '<div id="m_b">';
                            show += '<h3>到现在共有 <span style="color: red;">'+result.messages_count+'</span> 条评论</h3>';
                            if (result.messages) {
                                $.each(result.messages, function (i, obj) {
                                    show += '<div class="father">';
                                    show += '<img src="http://127.0.0.1:8000/media/avatar/' + obj.publisher_avatar + '">';
                                    show += '<div class="f_div">';
                                    show += '<h3>' + obj.publisher + ' &nbsp<span>' + obj.created_time + ' &nbsp</span><a href="#" class="reply" mid="'+obj.id+'">回复</a></h3>';
                                    show += '<p>' + obj.content + '</p>';
                                    show += '</div>';
                                    show += '</div>';
                                    show += '<div class="clear"></div>';
                                    if (obj.reply){
                                        $.each(obj.reply, function (i, objx) {
                                            show += '<div class="son">';
                                            show += '<img src="http://127.0.0.1:8000/media/avatar/' + objx.publisher_avatar + '">';
                                            show += '<div class="f_div">';
                                            show += '<h3>' + objx.publisher + ' &nbsp<span>' + objx.created_time + ' &nbsp</span></h3>';
                                            show += '<p>' + objx.content + '</p>';
                                            show += '</div>';
                                            show += '</div>';
                                            show += '<div class="clear"></div>';
                                        });
                                    }
                                });
                            }
                        show += '</div>';
                        show += '<hr>';
                        show += '<div id="editor"><p id="e_p">请在此输入您的评价</p></div>';
                        show += '<button id="btn">提交</button>';
                    show += '</div>';
                show += '</div>';
                show += '<div id="bottom">';
                    show += '<p id="bot">@版权归小柒优品所有</p>';
                show += '</div>';
                $('body').html(show);

                var E = window.wangEditor;
                var editor = new E('#editor');
                editor.create();

                // 点击后移除提示语
                $('#editor').click(function(){
                   $('#e_p').remove();
                });

                //绑定提交按钮的单击事件
                $('#btn').on('click', function(){
                            var content = editor.txt.text();
                            var post_data = {'content': content,
                                                'id':id,
                                                'user':user
                                            };
                            $.ajax({
                            // 请求方式
                            type:"post",
                            // contentType
                            contentType:"application/json;charset=utf-8",
                            // dataType
                            dataType:"json",
                            // url
                            url:"http://127.0.0.1:8000/v1/message",
                            // 把JS的对象或数组序列化一个json 字符串
                            data:JSON.stringify(post_data),
                            // result 为请求的返回结果对象
                            beforeSend: function(request) {
                                if (!token && !user){
                                    alert('请您先登录后再评论！');
                                    window.location.href = '/login'
                                }
                              request.setRequestHeader("Authorization", token);
                            },
                            success:function (result) {
                                if (200 == result.code){
                                    alert("发布成功");
                                    window.location.reload()
                                }else{
                                    alert(result.error);
                                    window.location.href = '/login'
                                }
                             }
                        })
                    });
                 //弹窗
            var list = document.getElementsByClassName('reply');
            for ( var i of list) {
                i.addEventListener("click", function (ev) {
                    ev.preventDefault();
                    console.log('123123123');
                    var m_id = this.getAttribute('mid');
                    var txt = "请输入回复：";
                    window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.input,{
                        onOk: function (reply) {
                            console.log(reply);
                            var post_data = {'content': reply, 'user':user,'parent_id': m_id,'id':id};
                            var reply_url = "http://127.0.0.1:8000/v1/message";
                            $.ajax({
                                // 请求方式
                                type: "post",
                                // contentType
                                contentType: "application/json;charset=utf-8",
                                // dataType
                                dataType: "json",
                                // url
                                url: reply_url,
                                // 把JS的对象或数组序列化一个json 字符串
                                data: JSON.stringify(post_data),
                                // result 为请求的返回结果对象
                                beforeSend: function (request) {
                                    if (!token && !user){
                                    alert('请您先登录后再评论！');
                                    window.location.href = '/login'
                                    }
                                    request.setRequestHeader("Authorization", token);
                                },
                                success: function (result) {
                                    if (200 == result.code) {
                                        alert("发布成功");
                                        window.location.reload()
                                    } else {
                                        alert(result.error);
                                    }
                                }
                            })
                        }
                    });
                })
            }
            }
        }
    })
}


//退出
function login_out(){
    window.localStorage.removeItem('xiaoqi_token');
    window.localStorage.removeItem('xiaoqi_user');
    alert('您的账号已退出！');
    window.location.reload()
}



// 添加购物车
function cart(id){
    var token = window.localStorage.getItem('xiaoqi_token');
    var user = window.localStorage.getItem('xiaoqi_user');
    var cart = window.localStorage.getItem('xiaoqi_cart');
    var params = {
            "user":user,
            "sku_id":id,
            "count":1,
            "cart":cart
        };
    if (token && user){
        // 登录状态
        $.ajax({
        type:"post",
        dataType:"json",
        url:'http://127.0.0.1:8000/v1/cart',
        contentType:"application/json;charset=utf-8",
        data:JSON.stringify(params),
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", token);
        },
        success:function (result) {
            if (result.code == 200){
                alert(result.data)
            }else{
                alert(result.error)
            }
        }
        });
    }else{
        // 未登录状态
        $.ajax({
        type:"post",
        dataType:"json",
        url:'http://127.0.0.1:8000/v1/cart',
        contentType:"application/json;charset=utf-8",
        data:JSON.stringify(params),
        success:function (result) {
            if (result.code == 200){
                window.localStorage.setItem('xiaoqi_cart',result.cart);
                alert(result.data)
            }else{
                alert(result.error)
            }
        }
    });
    }
}





$(function () {
    load_info()
});