from django.http import JsonResponse
from index.models import Products
from .models import Message
from user.models import UserProfile
import json
from user.logging_check import logging_check

# Create your views here.

@logging_check('POST')
def message(request):
    if request.method == 'GET':
        goods_id = request.GET.get('id')
        result = {'code':200}
        try:
            goods = Products.objects.get(id = goods_id)
        except Exception as e:
            result = {'code':20101,'error':'没有找到此商品'}
            return JsonResponse(result)
        goods_dict = {}
        goods_dict['id'] = goods.id
        goods_dict['title'] = goods.title
        goods_dict['market_price'] = goods.market_price
        goods_dict['supplier'] = goods.supplier
        goods_dict['repertory'] = goods.repertory
        goods_dict['sell_number'] = goods.sell_number
        goods_dict['info'] = goods.info
        goods_dict['img'] = str(goods.img)
        result['goods'] = goods_dict
        all_messages = Message.objects.filter(topic_id=goods_id).order_by('-created_time')
        m_count = 0
        # 留言专属容器
        msg_list = []
        # 回复专属容器
        reply_home = {}
        for message in all_messages:
            m_count += 1
            if message.parent_message:
                # 回复
                reply_home.setdefault(message.parent_message, [])
                reply_home[message.parent_message].append({'msg_id': message.id, 'content': message.content,
                                                           'publisher': message.publisher.username,
                                                           'publisher_avatar': str(message.publisher.avatar),
                                                           'created_time': message.created_time.strftime('%Y-%m-%d %H:%M:%S')})
            else:
                # 留言
                dic = {}
                dic['id'] = message.id
                dic['content'] = message.content
                dic['publisher'] = message.publisher.username
                dic['publisher_avatar'] = str(message.publisher.avatar)
                dic['reply'] = []
                dic['created_time'] = message.created_time.strftime('%Y-%m-%d %H:%M:%S')
                msg_list.append(dic)
            # 关联留言及回复
        for m in msg_list:
            if m['id'] in reply_home:
                m['reply'] = reply_home[m['id']]

        result['messages'] = msg_list
        result['messages_count'] = m_count

        return JsonResponse(result)

    if request.method == 'POST':
        # 发表评论/回复
        json_str = request.body
        json_obj = json.loads(json_str)
        content = json_obj.get('content')
        username = json_obj.get('user')
        id = json_obj.get('id')
        parent_id = json_obj.get('parent_id', 0)
        # TODO 参数检查

        # 检查商品是否存在
        try:
            goods = Products.objects.get(id=id)
        except Exception as e:
            result = {'code': 20102, 'error': '没有此商品 !'}
            return JsonResponse(result)
        try:
            user = UserProfile.objects.get(username=username)
        except Exception as e:
            result = {'code': 20103, 'error': '没有此用户 !'}
            return JsonResponse(result)
        if request.user != user:
            result = {'code': 20104, 'error': '用户未登陆 !'}
            return JsonResponse(result)
        # 第一种方案 可以直接对外建属性赋值 对象
        Message.objects.create(content=content, parent_message=parent_id, publisher=user, topic=goods)

        return JsonResponse({'code': 200})