import redis,json
from django.http import JsonResponse
from index.models import Products
from user.models import UserProfile
from django.views import View
from user.logging_check import logging_check,get_username_by_request


# Create your views here.

class Cart(View):
    def get(self,request):
        username = request.GET.get('user')
        cart = request.GET.get('cart')
        r = redis.Redis(host='127.0.0.1', port=6379, db=0)
        # 总商品数量
        all_num = 0
        # 购物车中的所有商品
        all_sku = []
        # 选中状态的所有商品
        is_num = 0
        # 总价格
        all_money = 0
        # 全选=1 非全选=0
        all_selected = 1
        if username:
            # 用户登录状态下合并
            token_username = get_username_by_request(request)
            if token_username != username:
                return JsonResponse({'code': 11111, 'error': "请您重新登录"})
            if cart:
                # 如果本地购物车有值 将其合并到reids库中
                cart_dict = json.loads(cart)
                for sku_id in cart_dict:
                    count = cart_dict[sku_id]['count']
                    # 校验参数有没有空值或值为0
                    if not all([sku_id, count]):
                        return JsonResponse({"code": 11111, "error": "参数不完整"})
                    # 判断商品是否存在
                    try:
                        sku = Products.objects.get(id=sku_id)
                    except Exception as e:
                        return JsonResponse({'code': 11111, 'error': '商品不存在'})
                    # 判断数量是否为整数
                    try:
                        count = int(count)
                    except Exception as e:
                        return JsonResponse({'code': 11111, 'error': '请您输入正确的数量'})
                    redis_value = r.hget('cart_%s' % username, sku_id)
                    if redis_value:
                        # 该商品已存在redis中 增加数量
                        redis_value = json.loads(redis_value)
                        count += int(redis_value['count'])
                        if count > sku.repertory:
                            return JsonResponse({'code': 11111, 'error': '库存不足'})
                        # 将商品保存/更新到redis数据库中 selected=1 默认勾选
                        status = json.dumps({'count': count, 'selected': 1})
                        r.hset('cart_%s' % username, sku_id, status)
                    else:
                        # redis中没有该商品
                        status = json.dumps({'count': count, 'selected': 1})
                        r.hset('cart_%s' % username, sku_id, status)
                redis_cart_dict = r.hgetall('cart_%s'%username)
                for k, v in redis_cart_dict.items():
                    # 返回字典的键值对为字节串
                    redis_sku_id = k.decode()
                    redis_sku_id_value = v.decode()
                    # 将字符串json类型的值转换为字典类型
                    redis_sku_id_value = json.loads(redis_sku_id_value)
                    count = int(redis_sku_id_value['count'])
                    selected = int(redis_sku_id_value['selected'])
                    if selected == 0:
                        all_selected = 0
                    elif selected == 1:
                        is_num += 1

                    # 判断商品是否存在
                    try:
                        sku = Products.objects.get(id=redis_sku_id)
                    except Exception as e:
                        return JsonResponse({'code': 11111, 'error': '商品不存在'})
                    # 如果商品存在 总数量加1
                    all_num += 1
                    # 单个商品的总价格
                    all_price = count * sku.market_price
                    # 所有商品的总价格
                    all_money += all_price

                    sku_dict = {}
                    sku_dict['id'] = sku.id
                    sku_dict['title'] = sku.title
                    sku_dict['img'] = str(sku.img)
                    sku_dict['price'] = sku.market_price
                    sku_dict['count'] = count
                    sku_dict['all_price'] = all_price
                    sku_dict['selected'] = selected
                    all_sku.append(sku_dict)
                result = {'code':200,'all_num':all_num,'all_sku':all_sku,'is_num':is_num,'all_money':all_money,'all_selected':all_selected}
                return JsonResponse(result)
            else:
                # 如果本地购物车没值 直接查询redis数据库
                redis_cart_dict = r.hgetall('cart_%s' % username)
                if not redis_cart_dict:
                    # 如果redis里面也没值 说明没有添加过购物车
                    return JsonResponse({'code':15555,'error':'您的购物车是空的,请先选购商品！'})
                for k,v in redis_cart_dict.items():
                    # 返回字典的键值对为字节串
                    redis_sku_id = k.decode()
                    redis_sku_id_value = v.decode()
                    # 将字符串json类型的值转换为字典类型
                    redis_sku_id_value = json.loads(redis_sku_id_value)
                    count = int(redis_sku_id_value['count'])
                    selected = int(redis_sku_id_value['selected'])
                    if selected == 0:
                        all_selected = 0
                    elif selected == 1:
                        is_num += 1

                    # 判断商品是否存在
                    try:
                        sku = Products.objects.get(id=redis_sku_id)
                    except Exception as e:
                        return JsonResponse({'code': 11111, 'error': '商品不存在'})
                    # 如果商品存在 总数量加1
                    all_num += 1
                    # 单个商品的总价格
                    all_price = count * sku.market_price
                    # 所有商品的总价格
                    all_money += all_price

                    sku_dict = {}
                    sku_dict['id'] = sku.id
                    sku_dict['title'] = sku.title
                    sku_dict['img'] = str(sku.img)
                    sku_dict['price'] = sku.market_price
                    sku_dict['count'] = count
                    sku_dict['all_price'] = all_price
                    sku_dict['selected'] = selected
                    all_sku.append(sku_dict)
                result = {'code': 200, 'all_num': all_num, 'all_sku': all_sku, 'is_num': is_num, 'all_money': all_money,
                          'all_selected': all_selected}
                return JsonResponse(result)
        else:
            # 如果用户没登录
            if not cart:
                return JsonResponse({'code':15555, 'error': '您的购物车是空的,请先选购商品！'})
            else:
                cart_dict = json.loads(cart)
                for sku_id in cart_dict:
                    count = int(cart_dict[sku_id]['count'])
                    selected = int(cart_dict[sku_id]['selected'])
                    if selected == 0:
                        all_selected = 0
                    else:
                        is_num += 1
                    try:
                        sku = Products.objects.get(id=sku_id)
                    except Exception as e:
                        return JsonResponse({'code': 11111, 'error': '商品不存在'})
                    # 如果商品存在 总数量加1
                    all_num += 1
                    # 单个商品的总价格
                    all_price = count * sku.market_price
                    # 所有商品的总价格
                    all_money += all_price

                    sku_dict = {}
                    sku_dict['id'] = sku.id
                    sku_dict['title'] = sku.title
                    sku_dict['img'] = str(sku.img)
                    sku_dict['price'] = sku.market_price
                    sku_dict['count'] = count
                    sku_dict['all_price'] = all_price
                    sku_dict['selected'] = selected
                    all_sku.append(sku_dict)
                result = {'code': 200, 'all_num': all_num, 'all_sku': all_sku, 'is_num': is_num, 'all_money': all_money,
                          'all_selected': all_selected}
                return JsonResponse(result)




    def post(self,request):
        json_str = request.body
        json_obj = json.loads(json_str)
        # 用户名
        username = json_obj.get('user')
        # 商品id
        sku_id = json_obj.get('sku_id')
        # 商品数量
        count = json_obj.get('count')
        # 校验参数有没有空值或值为0
        if not all([sku_id, count]):
            return JsonResponse({"code":11111, "error": "参数不完整"})
        # 判断商品是否存在
        try:
            sku = Products.objects.get(id=sku_id)
        except Exception as e:
            return JsonResponse({'code':11111,'error':'商品不存在'})
        # 判断数量是否为整数
        try:
            count = int(count)
        except Exception as e:
            return JsonResponse({'code':11111,'error':'请您输入正确的数量'})
        if username:
            token_username = get_username_by_request(request)
            if token_username != username:
                return JsonResponse({'code': 11111, 'error': "请您重新登录后再执行"})
            # 用户登录状态下
            r = redis.Redis(host='127.0.0.1', port=6379, db=0)
            # 检查该商品是否已经在redis数据库
            redis_count = r.hget('cart_%s'%username,sku_id)
            if redis_count is not None:
                redis_count = json.loads(redis_count)
                count += int(redis_count['count'])
            if count > sku.repertory:
                return JsonResponse({'code':11111,'error':'库存不足'})
            # 将商品保存/更新到redis数据库中 selected=1 默认勾选
            status = json.dumps({'count':count, 'selected':1})
            r.hset('cart_%s'%username,sku_id,status)
            return JsonResponse({'code':200,'data':'添加购物车成功'})
        else:
            # 用户没有登录时添加购物车 保存数据到cookie中
            cart = json_obj.get('cart')
            if cart is not None:
                cart_dict = json.loads(cart)
            else:
                cart_dict = {}
            sku_id = str(sku_id)
            if sku_id in cart_dict:
                count += int(cart_dict[sku_id]['count'])
            if count > sku.repertory:
                return JsonResponse({'code':11111,'error':'库存不足'})
            # 设置最终的商品数量和默认选中到购物车
            cart_dict[sku_id] = {'count':count, 'selected':1}
            # 将json字典转成json字符串
            cart_str = json.dumps(cart_dict)
            # 将购物车数据传回本地
            result = {'code':200,'data':'添加购物车成功','cart':cart_str}

            return JsonResponse(result)


    def delete(self,request):
        json_str = request.body
        json_obj = json.loads(json_str)
        username = json_obj.get('user')
        sku_id = json_obj.get('sku_id')
        if username:
            # 用户登录状态下
            token_username = get_username_by_request(request)
            if token_username != username:
                return JsonResponse({'code':11111,'error':'请您重新登录后再执行'})
            r = redis.Redis('127.0.0.1',port=6379,db=0)
            r.hdel('cart_%s'%username,sku_id)
            return JsonResponse({'code':200,'data':'删除成功'})
        else:
            cart_dict = json_obj.get('cart')
            cart_dict = json.loads(cart_dict)
            del cart_dict[str(sku_id)]
            if cart_dict == {}:
                return JsonResponse({'code':200,'data':'删除成功'})
            else:
                cart_dict = json.dumps(cart_dict)
                return JsonResponse({'code':200,'data':'删除成功','cart':cart_dict})

    def put(self,request):
        json_str = request.body
        json_obj = json.loads(json_str)
        username = json_obj.get('user')
        sku_id = json_obj.get('sku_id')
        count = json_obj.get('count')
        cart = json_obj.get('cart')
        all_selected = json_obj.get('all_selected')
        selected = json_obj.get('selected')

        if all_selected:
            # 全选非全选 全选yes=1  全不选no=0
            if all_selected == 'yes':
                # 全选
                if username:
                    # 用户登录状态下
                    r = redis.Redis(host='127.0.0.1',port=6379,db=0)
                    redis_cart_dict = r.hgetall('cart_%s'%username)
                    values = {}
                    for k,v in redis_cart_dict.items():
                        sku_id = k.decode()
                        sku_id_value = v.decode()
                        sku_id_value = json.loads(sku_id_value)
                        sku_id_value['selected'] = 1
                        sku_id_value = json.dumps(sku_id_value)
                        values[sku_id] = sku_id_value
                    r.hmset('cart_%s'%username,values)
                    return JsonResponse({'code':200})
                else:
                    # 用户没有登录
                    cart_dict = json.loads(cart)
                    values = {}
                    for k,v in cart_dict.items():
                        sku_id = k
                        sku_id_value = v
                        sku_id_value['selected'] = 1
                        values[sku_id] = sku_id_value
                    cart = json.dumps(values)
                    return JsonResponse({'code':200,'cart':cart})

            elif all_selected == 'no':
                # 全不选
                if username:
                    # 用户登录状态下
                    r = redis.Redis(host='127.0.0.1', port=6379, db=0)
                    redis_cart_dict = r.hgetall('cart_%s' % username)
                    values = {}
                    for k, v in redis_cart_dict.items():
                        sku_id = k.decode()
                        sku_id_value = v.decode()
                        sku_id_value = json.loads(sku_id_value)
                        sku_id_value['selected'] = 0
                        sku_id_value = json.dumps(sku_id_value)
                        values[sku_id] = sku_id_value
                    r.hmset('cart_%s' % username, values)
                    return JsonResponse({'code': 200})
                else:
                    # 用户没有登录
                    cart_dict = json.loads(cart)
                    values = {}
                    for k, v in cart_dict.items():
                        sku_id = k
                        sku_id_value = v
                        sku_id_value['selected'] = 0
                        values[sku_id] = sku_id_value
                    cart = json.dumps(values)
                    return JsonResponse({'code': 200, 'cart': cart})

        if selected:
            # 单选 不选中  单选yes=1  不选no=0
            if selected == 'yes':
                # 单选选中
                if username:
                    # 用户登录状态下
                    r = redis.Redis(host='127.0.0.1',port=6379,db=0)
                    redis_dict = r.hget('cart_%s'%username,sku_id)
                    sku_id_value_dict = json.loads(redis_dict)
                    sku_id_value_dict['selected'] = 1
                    sku_id_value_dict = json.dumps(sku_id_value_dict)
                    r.hset('cart_%s'%username,sku_id,sku_id_value_dict)
                    return JsonResponse({'code':200})
                else:
                    # 用户没有登录
                    cart_dict = json.loads(cart)
                    sku_id_value_dict = cart_dict[str(sku_id)]
                    sku_id_value_dict['selected'] = 1
                    cart_dict[str(sku_id)] = sku_id_value_dict
                    cart = json.dumps(cart_dict)
                    return JsonResponse({'code':200,'cart':cart})

            elif selected == 'no':
                # 单选不选中
                if username:
                    # 用户登录状态下
                    r = redis.Redis(host='127.0.0.1', port=6379, db=0)
                    redis_dict = r.hget('cart_%s' % username, sku_id)
                    sku_id_value_dict = json.loads(redis_dict)
                    sku_id_value_dict['selected'] = 0
                    sku_id_value_dict = json.dumps(sku_id_value_dict)
                    r.hset('cart_%s' % username, sku_id, sku_id_value_dict)
                    return JsonResponse({'code': 200})
                else:
                    # 用户没有登录
                    cart_dict = json.loads(cart)
                    sku_id_value_dict = cart_dict[str(sku_id)]
                    sku_id_value_dict['selected'] = 0
                    cart_dict[str(sku_id)] = sku_id_value_dict
                    cart = json.dumps(cart_dict)
                    return JsonResponse({'code': 200, 'cart': cart})

        if username:
            # 用户登录状态下
            r = redis.Redis(host='127.0.0.1',port=6379,db=0)
            sku_dict = r.hget('cart_%s'%username,sku_id)
            sku_dict = json.loads(sku_dict)
            sku_dict['count'] = count
            status = json.dumps(sku_dict)
            r.hset('cart_%s'%username,sku_id,status)
            return JsonResponse({'code':200,'data':'商品数量更新成功'})
        else:
            cart = json.loads(cart)
            cart_dict = cart[str(sku_id)]
            cart_dict['count'] = count
            cart[str(sku_id)] = cart_dict
            cart = json.dumps(cart)
            return JsonResponse({'code':200,'data':'商品数量更新成功','cart':cart})

