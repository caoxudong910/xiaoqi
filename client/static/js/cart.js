
function load_cart() {
    var token = window.localStorage.getItem('xiaoqi_token');
    var user = window.localStorage.getItem('xiaoqi_user');
    var cart = window.localStorage.getItem('xiaoqi_cart');
    if (token && user){
        // 用户登录状态下
        $.ajax({
            type:'get',
            dataType:'json',
            url:'http://127.0.0.1:8000/v1/cart',
            contentType:'application/json;charset=utf-8',
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", token);
            },
            data:{
                "user":user,
                "cart":cart
            },
            success:function (result) {
                var show = '';
                if (result.code == 200){
                    // 合并后删除本地存储的购物车
                    window.localStorage.removeItem('xiaoqi_cart');
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
                                show += '<a class="aa" href="">我的购物车</a>';
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
                    if (!token && !user){
                        show += '<div id="mid_top">';
                            show += '<img id="gth" src="/static/images/gth.jpeg">';
                            show += '<span id="mid_top_1">您还没有登录！登录后购物车的商品将保存到您账号中</span>';
                            show += '<a href="/login" id="mid_top_2">点击登录</a>';
                        show += '</div>';
                    }
                        show += '<div id="goods">';
                            show += '<span>全部商品&nbsp</span><span style="color: red">'+result.all_num+'</span><span>&nbsp件</span>';
                        show += '</div>';
                        show += '<div id="mid_mid">';
                        if (result.all_selected == 1){
                            show += '<input onclick="all_selected1()" id="all_selected1" type="checkbox" checked>';
                        }else{
                            show += '<input onclick="all_selected1()" id="all_selected1" type="checkbox">';
                        }
                            show += '<span>全选</span>';
                            show += '<span>商品</span>';
                            show += '<span>单价/元</span>';
                            show += '<span>数量</span>';
                            show += '<span>金额</span>';
                            show += '<span>操作</span>';
                        show += '</div>';
                        $.each(result.all_sku,function (i,obj) {
                            show += '<div class="mid_bottom">';
                                if (obj.selected == 1){
                                    show += '<input onclick="selected('+obj.id+')" id="'+obj.id+'" type="checkbox" checked>';
                                }else{
                                    show += '<input onclick="selected('+obj.id+')" id="'+obj.id+'" type="checkbox">';
                                }
                                show += '<img src="http://127.0.0.1:8000/static/imgs/snacks/'+obj.img+'">';
                                show += '<span class="sp1">'+obj.title+'</span>';
                                show += '<span class="sp2">￥:'+obj.price+'</span>';
                                show += '<span class="sp3">';
                                show += '<button onclick="add('+obj.id+')" class="add">+</button><input id="sku_'+obj.id+'" onchange="num('+obj.id+','+obj.count+')" class="num" type="text" value="'+obj.count+'"><button onclick="reduce('+obj.id+')" class="reduce">-</button>';
                                show += '</span>';
                                show += '<span class="sp4">￥:'+obj.all_price+'</span>';
                                show += '<a onclick="del('+obj.id+')" href="#" class="sp5">删除</a>';
                            show += '</div>';
                        });
                        show += '<div id="mid_bot">';
                            if (result.all_selected == 1){
                                show += '<input onclick="all_selected2()" id="all_selected2" type="checkbox" checked>';
                            }else{
                                show += '<input onclick="all_selected2()" id="all_selected2" type="checkbox">';
                            }
                            show += '<span>全选</span>';
                            show += '<a id="delete" href="#">删除选中商品</a>';
                            show += '<a id="clear" href="#">清空购物车</a>';
                            show += '<span id="total_num">已选择&nbsp<span style="color: red">'+result.is_num+'</span>&nbsp件商品</span>';
                            show += '<span id="total_price">总价:&nbsp￥&nbsp<span style="color: red">'+result.all_money+'</span></span>';
                            show += '<a id="total" href="#"><b>去结算</b></a>';
                        show += '</div>';
                    show += '</div>';

                    show += '<div id="bottom">';
                        show += '<p id="bot">@版权归小柒优品所有</p>';
                    show += '</div>';
                    $('body').html(show)
                }else if (result.code == 15555){
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
                                show += '<a class="aa" href="">我的购物车</a>';
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
                        if (!token && !user){
                            show += '<div id="mid_top">';
                                show += '<img id="gth" src="/static/images/gth.jpeg">';
                                show += '<span id="mid_top_1">您还没有登录！登录后购物车的商品将保存到您账号中</span>';
                                show += '<a href="/login" id="mid_top_2">点击登录</a>';
                            show += '</div>';
                        }
                        show += '<div id="goods">';
                            show += '<span>全部商品&nbsp</span><span style="color: red">0</span><span>&nbsp件</span>';
                        show += '</div>';
                        show += '<div id="mid_mid">';
                            show += '<input type="checkbox">';
                            show += '<span>全选</span>';
                            show += '<span>商品</span>';
                            show += '<span>单价/元</span>';
                            show += '<span>数量</span>';
                            show += '<span>金额</span>';
                            show += '<span>操作</span>';
                        show += '</div>';
                        show += '<div>';
                            show += '<p id="empty">您的购物车是空的,请您先选购商品！</p>';
                        show += '</div>';
                        show += '<div id="mid_bot">';
                            show += '<input type="checkbox">';
                            show += '<span>全选</span>';
                            show += '<a id="delete" href="#">删除选中商品</a>';
                            show += '<a id="clear" href="#">清空购物车</a>';
                            show += '<span id="total_num">已选择&nbsp<span style="color: red">0</span>&nbsp件商品</span>';
                            show += '<span id="total_price">总价:&nbsp￥&nbsp<span style="color: red">0</span></span>';
                            show += '<a id="total" href="#"><b>去结算</b></a>';
                        show += '</div>';
                    show += '</div>';

                    show += '<div id="bottom">';
                        show += '<p id="bot">@版权归小柒优品所有</p>';
                    show += '</div>';
                    $('body').html(show)
                }else{
                    alert(result.error)
                }
            }
        })
    }else{
        // 用户未登录状态下
        $.ajax({
            type:'get',
            dataType:'json',
            url:'http://127.0.0.1:8000/v1/cart',
            contentType:'application/json;charset=utf-8',
            data:{
                "cart":cart
            },
            success:function (result) {
                var show = '';
                if (result.code == 200){
                    // 合并后删除本地存储的购物车
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
                                show += '<a class="aa" href="">我的购物车</a>';
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
                        if (!token && !user){
                            show += '<div id="mid_top">';
                                show += '<img id="gth" src="/static/images/gth.jpeg">';
                                show += '<span id="mid_top_1">您还没有登录！登录后购物车的商品将保存到您账号中</span>';
                                show += '<a href="/login" id="mid_top_2">点击登录</a>';
                            show += '</div>';
                        }
                        show += '<div id="goods">';
                            show += '<span>全部商品&nbsp</span><span style="color: red">'+result.all_num+'</span><span>&nbsp件</span>';
                        show += '</div>';
                        show += '<div id="mid_mid">';
                        if (result.all_selected == 1){
                            show += '<input onclick="all_selected1()" id="all_selected1" type="checkbox" checked>';
                        }else{
                            show += '<input onclick="all_selected1()" id="all_selected1" type="checkbox">';
                        }
                            show += '<span>全选</span>';
                            show += '<span>商品</span>';
                            show += '<span>单价/元</span>';
                            show += '<span>数量</span>';
                            show += '<span>金额</span>';
                            show += '<span>操作</span>';
                        show += '</div>';
                        $.each(result.all_sku,function (i,obj) {
                            show += '<div class="mid_bottom">';
                                if (obj.selected == 1){
                                    show += '<input onclick="selected('+obj.id+')" id="'+obj.id+'" type="checkbox" checked>';
                                }else{
                                    show += '<input onclick="selected('+obj.id+')" id="'+obj.id+'" type="checkbox">';
                                }
                                show += '<img src="http://127.0.0.1:8000/static/imgs/snacks/'+obj.img+'">';
                                show += '<span class="sp1">'+obj.title+'</span>';
                                show += '<span class="sp2">￥:'+obj.price+'</span>';
                                show += '<span class="sp3">';
                                show += '<button onclick="add('+obj.id+')" class="add">+</button><input id="sku_'+obj.id+'" onchange="num('+obj.id+','+obj.count+')" class="num" type="text" value="'+obj.count+'"><button onclick="reduce('+obj.id+')" class="reduce">-</button>';
                                show += '</span>';
                                show += '<span class="sp4">￥:'+obj.all_price+'</span>';
                                show += '<a onclick="del('+obj.id+')" href="#" class="sp5">删除</a>';
                            show += '</div>';
                        });
                        show += '<div id="mid_bot">';
                            if (result.all_selected == 1){
                                show += '<input onclick="all_selected2()" id="all_selected2" type="checkbox" checked>';
                            }else{
                                show += '<input onclick="all_selected2()" id="all_selected2" type="checkbox">';
                            }
                            show += '<span>全选</span>';
                            show += '<a id="delete" href="#">删除选中商品</a>';
                            show += '<a id="clear" href="#">清空购物车</a>';
                            show += '<span id="total_num">已选择&nbsp<span style="color: red">'+result.is_num+'</span>&nbsp件商品</span>';
                            show += '<span id="total_price">总价:&nbsp￥&nbsp<span style="color: red">'+result.all_money+'</span></span>';
                            show += '<a id="total" href="#"><b>去结算</b></a>';
                        show += '</div>';
                    show += '</div>';

                    show += '<div id="bottom">';
                        show += '<p id="bot">@版权归小柒优品所有</p>';
                    show += '</div>';
                    $('body').html(show)
                }else if (result.code == 15555){
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
                                show += '<a class="aa" href="">我的购物车</a>';
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
                        if (!token && !user){
                            show += '<div id="mid_top">';
                                show += '<img id="gth" src="/static/images/gth.jpeg">';
                                show += '<span id="mid_top_1">您还没有登录！登录后购物车的商品将保存到您账号中</span>';
                                show += '<a href="/login" id="mid_top_2">点击登录</a>';
                            show += '</div>';
                        }
                        show += '<div id="goods">';
                            show += '<span>全部商品&nbsp</span><span style="color: red">0</span><span>&nbsp件</span>';
                        show += '</div>';
                        show += '<div id="mid_mid">';
                            show += '<input type="checkbox">';
                            show += '<span>全选</span>';
                            show += '<span>商品</span>';
                            show += '<span>单价/元</span>';
                            show += '<span>数量</span>';
                            show += '<span>金额</span>';
                            show += '<span>操作</span>';
                        show += '</div>';
                        show += '<div>';
                            show += '<p id="empty">您的购物车是空的,请您先选购商品！</p>';
                        show += '</div>';
                        show += '<div id="mid_bot">';
                            show += '<input type="checkbox">';
                            show += '<span>全选</span>';
                            show += '<a id="delete" href="#">删除选中商品</a>';
                            show += '<a id="clear" href="#">清空购物车</a>';
                            show += '<span id="total_num">已选择&nbsp<span style="color: red">0</span>&nbsp件商品</span>';
                            show += '<span id="total_price">总价:&nbsp￥&nbsp<span style="color: red">0</span></span>';
                            show += '<a id="total" href="#"><b>去结算</b></a>';
                        show += '</div>';
                    show += '</div>';

                    show += '<div id="bottom">';
                        show += '<p id="bot">@版权归小柒优品所有</p>';
                    show += '</div>';
                    $('body').html(show)
                }else{
                    alert(result.error)
                }
            }
        })
    }
}


// 退出
function login_out(){
    window.localStorage.removeItem('xiaoqi_token');
    window.localStorage.removeItem('xiaoqi_user');
    alert('您的账号已退出！');
    window.location.reload()
}

// 删除
function del(sku_id){
    token = window.localStorage.getItem('xiaoqi_token');
    user = window.localStorage.getItem('xiaoqi_user');
    if (token && user){
        // 用户登录状态
        $.ajax({
            type:'delete',
            url:'http://127.0.0.1:8000/v1/cart',
            dataType:'json',
            contentType:'application/json;charset=utf-8',
            data:JSON.stringify({'sku_id':sku_id,'user':user}),
            beforeSend:function (request) {
                alert('您确认要删除此商品吗？');
                request.setRequestHeader("Authorization", token);
            },
            success:function (result) {
                if (result.code == 200){
                    alert(result.data);
                    window.location.reload()
                }else{
                    alert(result.error)
                }
            }
        })
    }else{
        // 用户未登录状态下
        var cart = window.localStorage.getItem('xiaoqi_cart');
        $.ajax({
            type:'delete',
            url:'http://127.0.0.1:8000/v1/cart',
            dataType:'json',
            contentType:'application/json;charset=utf-8',
            data:JSON.stringify({'sku_id':sku_id,'cart':cart}),
            beforeSend:function(){
                alert('您确认要删除此商品吗？');
            },
            success:function (result) {
                if (result.code == 200){
                    alert(result.data);
                    if (result.cart){
                        window.localStorage.setItem('xiaoqi_cart',result.cart)
                    }else{
                        window.localStorage.removeItem('xiaoqi_cart')
                    }
                    window.location.reload()
                }else{
                    alert(result.error)
                }
            }
        })
    }
}

// 增加商品数量
function add(sku_id){
    var token = window.localStorage.getItem('xiaoqi_token');
    var user = window.localStorage.getItem('xiaoqi_user');
    var cart = window.localStorage.getItem('xiaoqi_cart');
    key = "#sku_"+sku_id;
    count = parseInt($(key).val()) + 1;
    if (token && user){
        // 用户登录状态
        $.ajax({
            type:'put',
            url:'http://127.0.0.1:8000/v1/cart',
            dataType:'json',
            contentType:'application/json;charset=utf-8',
            data:JSON.stringify({'sku_id':sku_id,'user':user,'count':count}),
            beforeSend:function (request) {
                request.setRequestHeader("Authorization", token);
            },
            success:function (result) {
                if (result.code == 200){
                    alert(result.data);
                    window.location.reload()
                }else{
                    alert(result.error)
                }
            }
        })
    }else{
        // 用户未登录状态下
        $.ajax({
            type:'put',
            url:'http://127.0.0.1:8000/v1/cart',
            dataType:'json',
            contentType:'application/json;charset=utf-8',
            data:JSON.stringify({'sku_id':sku_id,'count':count,'cart':cart}),
            success:function (result) {
                if (result.code == 200){
                    alert(result.data);
                    window.localStorage.setItem('xiaoqi_cart',result.cart);
                    window.location.reload()
                }else{
                    alert(result.error)
                }
            }
        })
    }
}


// 减少商品数量
function reduce(sku_id){
    var token = window.localStorage.getItem('xiaoqi_token');
    var user = window.localStorage.getItem('xiaoqi_user');
    var cart = window.localStorage.getItem('xiaoqi_cart');
    key = "#sku_"+sku_id;
    count = parseInt($(key).val()) - 1;
    if (count == 0){
        $(key).val(1);
        alert('商品数量不能少于一');
        return
    }
    if (token && user){
        // 用户登录状态
        $.ajax({
            type:'put',
            url:'http://127.0.0.1:8000/v1/cart',
            dataType:'json',
            contentType:'application/json;charset=utf-8',
            data:JSON.stringify({'sku_id':sku_id,'user':user,'count':count}),
            beforeSend:function (request) {
                request.setRequestHeader("Authorization", token);
            },
            success:function (result) {
                if (result.code == 200){
                    alert(result.data);
                    window.location.reload()
                }else{
                    alert(result.error)
                }
            }
        })
    }else{
        // 用户未登录状态下
        $.ajax({
            type:'put',
            url:'http://127.0.0.1:8000/v1/cart',
            dataType:'json',
            contentType:'application/json;charset=utf-8',
            data:JSON.stringify({'sku_id':sku_id,'count':count,'cart':cart}),
            success:function (result) {
                if (result.code == 200){
                    alert(result.data);
                    window.localStorage.setItem('xiaoqi_cart',result.cart);
                    window.location.reload()
                }else{
                    alert(result.error)
                }
            }
        })
    }
}


// 输入商品数量
function num(sku_id,num) {
    var token = window.localStorage.getItem('xiaoqi_token');
    var user = window.localStorage.getItem('xiaoqi_user');
    var cart = window.localStorage.getItem('xiaoqi_cart');
    key = "#sku_" + sku_id;
    count = parseInt($(key).val());
    if (!count){
        alert('输入的值必须为整数噢！');
        $(key).val(num);
        return;
    }
    if (count < 1) {
        $(key).val(num);
        alert('商品数量不能少于一');
        return
    }
    if (token && user){
        // 用户登录状态
        $.ajax({
            type:'put',
            url:'http://127.0.0.1:8000/v1/cart',
            dataType:'json',
            contentType:'application/json;charset=utf-8',
            data:JSON.stringify({'sku_id':sku_id,'user':user,'count':count}),
            beforeSend:function (request) {
                request.setRequestHeader("Authorization", token);
            },
            success:function (result) {
                if (result.code == 200){
                    alert(result.data);
                    window.location.reload()
                }else{
                    alert(result.error)
                }
            }
        })
    }else{
        // 用户未登录状态下
        $.ajax({
            type:'put',
            url:'http://127.0.0.1:8000/v1/cart',
            dataType:'json',
            contentType:'application/json;charset=utf-8',
            data:JSON.stringify({'sku_id':sku_id,'count':count,'cart':cart}),
            success:function (result) {
                if (result.code == 200){
                    alert(result.data);
                    window.localStorage.setItem('xiaoqi_cart',result.cart);
                    window.location.reload()
                }else{
                    alert(result.error)
                }
            }
        })
    }
}

// 全选非全选 第一个全选按钮
function all_selected1(){
    var user = window.localStorage.getItem('xiaoqi_user');
    var token = window.localStorage.getItem('xiaoqi_token');
    var cart = window.localStorage.getItem('xiaoqi_cart');
    if (user && token){
        // 用户登录状态下
        if ($('#all_selected1').prop('checked')){
            // 全选按钮选中状态下
            $.ajax({
                type:'put',
                url:'http://127.0.0.1:8000/v1/cart',
                dataType:'json',
                contentType:'application/json;charset=utf-8',
                data:JSON.stringify({'user':user,'all_selected':'yes'}),
                beforeSend:function (request) {
                    request.setRequestHeader("Authorization", token);
                },
                success:function (result) {
                    if (result.code == 200){
                        window.location.reload()
                    }else {
                        alert(result.error)
                    }
                }
            })
        }else{
            // 全选按钮非选中状态下
            $.ajax({
                type:'put',
                url:'http://127.0.0.1:8000/v1/cart',
                dataType:'json',
                contentType:'application/json;charset=utf-8',
                data:JSON.stringify({'user':user,'all_selected':'no'}),
                beforeSend:function (request) {
                    request.setRequestHeader("Authorization", token);
                },
                success:function (result) {
                    if (result.code == 200){
                        window.location.reload()
                    }else {
                        alert(result.error)
                    }
                }
            })
        }
    }else{
        // 用户没有登录
        if ($('#all_selected1').prop('checked')){
            // 全选按钮选中状态下
            $.ajax({
                type:'put',
                url:'http://127.0.0.1:8000/v1/cart',
                dataType:'json',
                contentType:'application/json;charset=utf-8',
                data:JSON.stringify({'all_selected':'yes','cart':cart}),
                success:function (result) {
                    if (result.code == 200){
                        window.localStorage.setItem('xiaoqi_cart',result.cart);
                        window.location.reload()
                    }else {
                        alert(result.error)
                    }
                }
            })
        }else{
            // 全选按钮非选中状态下
            $.ajax({
                type:'put',
                url:'http://127.0.0.1:8000/v1/cart',
                dataType:'json',
                contentType:'application/json;charset=utf-8',
                data:JSON.stringify({'cart':cart,'all_selected':'no'}),
                success:function (result) {
                    if (result.code == 200){
                        window.localStorage.setItem('xiaoqi_cart',result.cart);
                        window.location.reload()
                    }else {
                        alert(result.error)
                    }
                }
            })
        }
    }
}

// 全选非全选 第二个全选按钮
function all_selected2(){
    var user = window.localStorage.getItem('xiaoqi_user');
    var token = window.localStorage.getItem('xiaoqi_token');
    var cart = window.localStorage.getItem('xiaoqi_cart');
    if (user && token){
        // 用户登录状态下
        if ($('#all_selected2').prop('checked')){
            // 全选按钮选中状态下
            $.ajax({
                type:'put',
                url:'http://127.0.0.1:8000/v1/cart',
                dataType:'json',
                contentType:'application/json;charset=utf-8',
                data:JSON.stringify({'user':user,'all_selected':'yes'}),
                beforeSend:function (request) {
                    request.setRequestHeader("Authorization", token);
                },
                success:function (result) {
                    if (result.code == 200){
                        window.location.reload()
                    }else {
                        alert(result.error)
                    }
                }
            })
        }else{
            // 全选按钮非选中状态下
            $.ajax({
                type:'put',
                url:'http://127.0.0.1:8000/v1/cart',
                dataType:'json',
                contentType:'application/json;charset=utf-8',
                data:JSON.stringify({'user':user,'all_selected':'no'}),
                beforeSend:function (request) {
                    request.setRequestHeader("Authorization", token);
                },
                success:function (result) {
                    if (result.code == 200){
                        window.location.reload()
                    }else {
                        alert(result.error)
                    }
                }
            })
        }
    }else{
        // 用户没有登录
        if ($('#all_selected2').prop('checked')){
            // 全选按钮选中状态下
            $.ajax({
                type:'put',
                url:'http://127.0.0.1:8000/v1/cart',
                dataType:'json',
                contentType:'application/json;charset=utf-8',
                data:JSON.stringify({'all_selected':'yes','cart':cart}),
                success:function (result) {
                    if (result.code == 200){
                        window.localStorage.setItem('xiaoqi_cart',result.cart);
                        window.location.reload()
                    }else {
                        alert(result.error)
                    }
                }
            })
        }else{
            // 全选按钮非选中状态下
            $.ajax({
                type:'put',
                url:'http://127.0.0.1:8000/v1/cart',
                dataType:'json',
                contentType:'application/json;charset=utf-8',
                data:JSON.stringify({'cart':cart,'all_selected':'no'}),
                success:function (result) {
                    if (result.code == 200){
                        window.localStorage.setItem('xiaoqi_cart',result.cart);
                        window.location.reload()
                    }else {
                        alert(result.error)
                    }
                }
            })
        }
    }
}


// 单选和单不选
function selected(sku_id){
    var user = window.localStorage.getItem('xiaoqi_user');
    var token = window.localStorage.getItem('xiaoqi_token');
    var cart = window.localStorage.getItem('xiaoqi_cart');
    if (user && token){
        // 用户登录状态下
        if ($('#'+sku_id).prop('checked')){
            // 单选按钮选中状态下
            $.ajax({
                type:'put',
                url:'http://127.0.0.1:8000/v1/cart',
                dataType:'json',
                contentType:'application/json;charset=utf-8',
                data:JSON.stringify({'sku_id':sku_id,'user':user,'selected':'yes'}),
                beforeSend:function (request) {
                    request.setRequestHeader("Authorization", token);
                },
                success:function (result) {
                    if (result.code == 200){
                        window.location.reload()
                    }else {
                        alert(result.error)
                    }
                }
            })
        }else{
            // 单选按钮非选中状态下
            $.ajax({
                type:'put',
                url:'http://127.0.0.1:8000/v1/cart',
                dataType:'json',
                contentType:'application/json;charset=utf-8',
                data:JSON.stringify({'sku_id':sku_id,'user':user,'selected':'no'}),
                beforeSend:function (request) {
                    request.setRequestHeader("Authorization", token);
                },
                success:function (result) {
                    if (result.code == 200){
                        window.location.reload()
                    }else {
                        alert(result.error)
                    }
                }
            })
        }
    }else{
        // 用户没有登录
        if ($('#'+sku_id).prop('checked')){
            // 单选按钮选中状态下
            $.ajax({
                type:'put',
                url:'http://127.0.0.1:8000/v1/cart',
                dataType:'json',
                contentType:'application/json;charset=utf-8',
                data:JSON.stringify({'sku_id':sku_id,'selected':'yes','cart':cart}),
                success:function (result) {
                    if (result.code == 200){
                        window.localStorage.setItem('xiaoqi_cart',result.cart);
                        window.location.reload()
                    }else {
                        alert(result.error)
                    }
                }
            })
        }else{
            // 单选按钮非选中状态下
            $.ajax({
                type:'put',
                url:'http://127.0.0.1:8000/v1/cart',
                dataType:'json',
                contentType:'application/json;charset=utf-8',
                data:JSON.stringify({'sku_id':sku_id,'cart':cart,'selected':'no'}),
                success:function (result) {
                    if (result.code == 200){
                        window.localStorage.setItem('xiaoqi_cart',result.cart);
                        window.location.reload()
                    }else {
                        alert(result.error)
                    }
                }
            })
        }
    }
}




$(function () {
    load_cart()
});