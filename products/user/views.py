from django.http import JsonResponse
from .models import UserProfile,WeiboUser
from django.core import mail
import json,jwt,random
import datetime,time
import hashlib
from django.db import transaction
from .weiboapi import OAuthWeibo

# Create your views here.

def make_token(username,login_time,exp):
    # 生成令牌
    key = 'xiaoqi'
    login_time = str(login_time)
    exp = int(time.time() + exp)
    payload = {'username':username,'login_time':login_time,'exp':exp}
    token = jwt.encode(payload,key,algorithm='HS256')
    return token

def make_validation():
    # 生成随机六位验证码
    num = random.sample('0123456789',6)
    number = num[0]+num[1]+num[2]+num[3]+num[4]+num[5]
    return number

def register(request):
    # 用户注册
    if request.method == 'GET':
        email = request.GET.get('email')
        username = request.GET.get('username')
        if email:
            global num_code
            num_code = make_validation()
            mail.send_mail(subject='小柒优品验证码', message=num_code, from_email='caoxudong910@qq.com',recipient_list=[email])
            result = {'code': 200, 'data': '邮箱验证码已发送至您的邮箱,请查收 !'}
            return JsonResponse(result)
        if username:
            user = UserProfile.objects.filter(username=username)
            if user:
                result = {'code': 10101, 'error': '此用户名已注册,请重新输入 !'}
                return JsonResponse(result)
            else:
                result = {'code': 200, 'data': '此用户名可以使用 !'}
                return JsonResponse(result)
        return JsonResponse({'code':200})

    elif request.method == 'POST':
        # 创建用户
        json_str = request.body
        if not json_str:
            result = {'code': 10101, 'error': '请给我数据 !'}
            return JsonResponse(result)
        json_obj = json.loads(json_str)
        emailpass = json_obj.get('emailpass')
        if emailpass == num_code:
            username = json_obj.get('username')
            if not username:
                result = {'code': 10102, 'error': '请输入用户名 !'}
                return JsonResponse(result)
            email = json_obj.get('email')
            if not email:
                result = {'code': 10103, 'error': '请输入邮箱 !'}
                return JsonResponse(result)
            userpass_1 = json_obj.get('userpass_1')
            userpass_2 = json_obj.get('userpass_2')
            if userpass_1 != userpass_2:
                result = {'code': 10104, 'error': '两次密码输入不一致,请重新输入 !'}
                return JsonResponse(result)
            old_user = UserProfile.objects.filter(username=username)
            if old_user:
                result = {'code': 10105, 'error': '用户名已存在,请重新输入 !'}
                return JsonResponse(result)
            # 生成散列密码
            m5 = hashlib.md5()
            m5.update(userpass_1.encode())
            password = m5.hexdigest()

            wuid = json_obj.get('wuid')

            # 创建用户
            try:
                with transaction.atomic():
                    user = UserProfile.objects.create(username=username, email=email,password=password)
                    if wuid:
                        # 微博用户进行绑定注册
                        w_obj = WeiboUser.objects.get(wuid=wuid)
                        w_obj.buser = user
                        w_obj.save()
            except Exception as e:
                print('-----create error-----')
                print(e)
                result = {'code': 10106, 'error': '用户名已存在,请重新输入 !!'}
                return JsonResponse(result)
            # 可以生成令牌
            now_datetime = datetime.datetime.now()
            user.login_time = now_datetime
            user.save()
            token = make_token(username, now_datetime, 86400)
            result = {'code': 200, 'data': {'token': token.decode(),'username': username}}
            return JsonResponse(result)
        else:
            result = {'code': 10107, 'error': '验证码输入错误,请重新输入 !'}
            return JsonResponse(result)

def login(request):
    # 用户登录
    if request.method == 'GET':
        return JsonResponse({'code': 200})
    elif request.method == 'POST':
        json_str = request.body
        if not json_str:
            result = {'code': 10101, 'error': '请给我数据 !'}
            return JsonResponse(result)
        json_obj = json.loads(json_str)
        username = json_obj.get('username')
        if not username:
            result = {'code': 10102, 'error': '请输入用户名 !'}
            return JsonResponse(result)
        userpass = json_obj.get('userpass')
        if not userpass:
            result = {'code': 10108, 'error': '请输入密码 !'}
            return JsonResponse(result)
        try:
            user = UserProfile.objects.get(username=username)
        except Exception as e:
            result = {'code': 10109, 'error': '用户名或密码输入错误 !'}
            return JsonResponse(result)
        m5 = hashlib.md5()
        m5.update(userpass.encode())
        password = m5.hexdigest()
        if user.password != password:
            result = {'code': 10110, 'error': '用户名或密码输入错误 !'}
            return JsonResponse(result)
        else:
            now_datetime = datetime.datetime.now()
            user.login_time = now_datetime
            user.save()
            token = make_token(username,now_datetime,86400)
            result = {'code':200,'data':{'token':token.decode(),'username':username}}
            return JsonResponse(result)


def users_weibo_url(request):
    oauth = OAuthWeibo('123')
    oauth_weibo_url = oauth.get_weibo_login()
    return JsonResponse({'code':200,'oauth_url':oauth_weibo_url})

def users_weibo_token(request):
    # 接收前端返回的code并去微博校验
    code = request.GET.get('code')
    oauth = OAuthWeibo()
    # 向微博服务器提交code 若校验成功 返回该用户的token
    res = oauth.get_access_token_uid(code)
    res_obj = json.loads(res)
    access_token = res_obj['access_token']
    uid = res_obj['uid']

    # 检查当前用户是否注册过
    try:
        bu = WeiboUser.objects.get(wuid=uid)
    except Exception as e:
        # 用户第一次用微博账号登录
        # TODO?
        WeiboUser.objects.create(wuid=uid,access_token=access_token)
        return JsonResponse({'code':10999,'wuid':uid})
    else:
        # 检查是否真的绑定过 buser是否为空
        buser = bu.buser
        if not buser:
            return JsonResponse({'code': 10999, 'wuid': uid})
        login_time = datetime.datetime.now()
        token = make_token(buser.username,login_time,86400)
        return JsonResponse({'code':200,'username':buser.username,'token':token.decode()})