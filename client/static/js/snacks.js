
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
        $.ajax({
        type:"post",
        dataType:"json",
        url:'http://127.0.0.1:8000/v1/cart',
        contentType:"application/json;charset=utf-8",
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", token);
        },
        data:JSON.stringify(params),
        success:function (result) {
            if (result.code == 200){
                alert(result.data)
            }else{
                alert(result.error)
            }
        }
        });
    }else{
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

// 上一页
function up_page(seeks,page_num){
    console.log(3,seeks);
    var seek = seeks;
    var num = page_num;
    var page = num-1;
    if (page==0){
        page = 1
    }
    $.ajax({
        // 请求方式
        type: "get",
        // contentType
        contentType:"application/json;charset=utf-8",
        // dataType
        dataType: "json",
        // 提交的参数
        data: {
            "page":page,
            "seek":seek
        },
        // url
        url: "http://127.0.0.1:8000/v1/snacks",
        success:function (result) {
            if (result.code == 200) {
                var show = '';
                var num = result.num;
                var max_num = result.max_num;
                var seeks = result.seeks;
                $.each(result.data, function (i, obj) {
                    show += '<div id="obj">';
                    show += '<img onclick="img('+obj.id+')" id="o_img" src="http://127.0.0.1:8000/static/imgs/snacks/' + obj.img + '">';
                    show += '<p>名称：' + obj.title + ' &nbsp&nbsp￥：' + obj.market_price + '元</p>';
                    show += '<p>商家：' + obj.supplier + '</p>';
                    show += '<img onclick="cart('+obj.id+')" id="cart" src="/static/images/cart.png">';
                    show += '</div>';

                });
                show += '</div>';
                $('#mid_mid').html(show);
                show1 = '';
                show1 += '<div id="page">';
                show1 += '<span style="color: blue" onclick="up_page(' + '\''+seeks+'\'' + ',' + num + ')">上一页&nbsp&nbsp&nbsp&nbsp&nbsp</span>';
                show1 += '<span style="color: blue" onclick="next_page(' + '\''+seeks+'\'' + ',' + num + ',' + max_num + ')">下一页</span>';
                show1 += '</div>';
                show1 += '</div>';
                show1 += '</div>';
                $('#mid_bottom').html(show1)



            }else {
                alert(result.error)
            }
        }
    });

}
// 下一页
function next_page(seeks,page_num,max_num) {
    var seek = seeks;
    var num = page_num;
    var page = num + 1;
    if (page > max_num) {
        page = max_num
    }
    $.ajax({
        // 请求方式
        type: "get",
        // contentType
        contentType:"application/json;charset=utf-8",
        // dataType
        dataType: "json",
        // 提交的参数
        data: {
            "page": page,
            "seek": seek
        },
        // url
        url: "http://127.0.0.1:8000/v1/snacks",
        success: function (result) {
            if (result.code == 200) {
                var show = '';
                var num = result.num;
                var max_num = result.max_num;
                var seeks = result.seeks;
                $.each(result.data, function (i, obj) {
                    show += '<div id="obj">';
                    show += '<img onclick="img('+obj.id+')" id="o_img" src="http://127.0.0.1:8000/static/imgs/snacks/' + obj.img + '">';
                    show += '<p>名称：' + obj.title + ' &nbsp&nbsp￥：' + obj.market_price + '元</p>';
                    show += '<p>商家：' + obj.supplier + '</p>';
                    show += '<img onclick="cart('+obj.id+')" id="cart" src="/static/images/cart.png">';
                    show += '</div>';

                });
                show += '</div>';
                $('#mid_mid').html(show);
                show1 = '';
                show1 += '<div id="page">';
                show1 += '<span style="color: blue" onclick="up_page(' + '\''+seeks+'\'' + ',' + num + ')">上一页&nbsp&nbsp&nbsp&nbsp&nbsp</span>';
                show1 += '<span style="color: blue" onclick="next_page(' + '\''+seeks+'\'' + ',' + num + ',' + max_num + ')">下一页</span>';
                show1 += '</div>';
                show1 += '</div>';
                show1 += '</div>';
                $('#mid_bottom').html(show1)

            }else {
                alert(result.error)
            }
        }
    });

}


// 搜索商品
function seek() {
    var seek = $('#seek').val();
    if (!seek){alert('搜索的商品不能为空！')}else {
        $.ajax({
            // 请求方式
            type: "get",
            // contentType
            contentType:"application/json;charset=utf-8",
            // dataType
            dataType: "json",
            // 提交的参数
            data: {
                "seek": seek
            },
            // url
            url: "http://127.0.0.1:8000/v1/snacks",
            // result 为请求的返回结果对象
            success: function (result) {
                if (result.code == 200) {
                    var show = '';
                    var num = result.num;
                    var max_num = result.max_num;
                    var seeks = result.seeks;
                    $.each(result.data, function (i, obj) {
                        show += '<div id="obj">';
                        show += '<img onclick="img('+obj.id+')" id="o_img" src="http://127.0.0.1:8000/static/imgs/snacks/' + obj.img + '">';
                        show += '<p>名称：' + obj.title + ' &nbsp&nbsp￥：' + obj.market_price + '元</p>';
                        show += '<p>商家：' + obj.supplier + '</p>';
                        show += '<img onclick="cart('+obj.id+')" id="cart" src="/static/images/cart.png">';
                        show += '</div>';

                    });
                    show += '</div>';
                    $('#mid_mid').html(show);
                    show1 = '';
                    show1 += '<div id="page">';
                    show1 += '<span style="color: blue" onclick="up_page(' + '\'' + seeks + '\'' + ',' + num + ')">上一页&nbsp&nbsp&nbsp&nbsp&nbsp</span>';
                    show1 += '<span style="color: blue" onclick="next_page(' + '\'' + seeks + '\'' + ',' + num + ',' + max_num + ')">下一页</span>';
                    show1 += '</div>';
                    show1 += '</div>';
                    show1 += '</div>';
                    $('#mid_bottom').html(show1)
                } else {
                    alert(result.error)
                }
            }
        })
    }
}



function load_snacks() {
    var token = window.localStorage.getItem('xiaoqi_token');
    var user = window.localStorage.getItem('xiaoqi_user');
    $.ajax({
        	// 请求方式
        type:"get",
        	// contentType
        contentType:"application/json;charset=utf-8",
        	// dataType
        dataType:"json",
        	// url
        url:"http://127.0.0.1:8000/v1/snacks",
        	// result 为请求的返回结果对象
        success:function (result) {
            var show = '';
            var num = result.num;
            var max_num = result.max_num;
            var seeks = result.seeks;
            if (result.code == 200) {
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
                show += '<div id="mid_top">';
                show += '<input placeholder="请输入要搜索的商品" id="seek" type="text" name="seek"><button id="sub" onclick="seek()">提交</button>';
                show += '</div>';
                show += '<div id="mid_mid">';
                $.each(result.data, function (i, obj) {
                    show += '<div id="obj">';
                    show += '<img onclick="img('+obj.id+')" id="o_img" src="http://127.0.0.1:8000/static/imgs/snacks/' + obj.img + '">';
                    show += '<p>名称：' + obj.title + ' &nbsp&nbsp￥：' + obj.market_price + '元</p>';
                    show += '<p>商家：' + obj.supplier + '</p>';
                    show += '<img onclick="cart('+obj.id+')" id="cart" src="/static/images/cart.png">';
                    show += '</div>';

                });
                show += '</div>';
                show += '<div id="mid_bottom">';
                show += '<div id="page">';
                show += '<span style="color: blue" onclick="up_page(' + '\''+seeks+'\'' + ',' + num + ')">上一页&nbsp&nbsp&nbsp&nbsp&nbsp</span>';
                show += '<span style="color: blue" onclick="next_page(' + '\''+seeks+'\'' + ',' + num + ',' + max_num + ')">下一页</span>';
                show += '</div>';
                show += '</div>';
                show += '</div>';

                show += '<div id="bottom">';
                show += '<p id="bot">@版权归小柒优品所有</p>';
                show += '</div>';
                $('body').html(show);

            }else {
                alert(result.error)
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


function img(id) {
    window.location.href = '/info?id='+id
}


$(function(){
    load_snacks();
});
