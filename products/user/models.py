from django.db import models
import random

# Create your models here.

def default_sign():
    signs = ['地表最强','中国最伟大','我爱我家']
    return random.choice(signs)



class UserProfile(models.Model):
    username = models.CharField(max_length=11,primary_key=True,verbose_name='用户名')
    email = models.EmailField(verbose_name='邮箱')
    password = models.CharField(max_length=32,verbose_name='密码')
    sign = models.CharField(max_length=50,verbose_name='个人签名',default=default_sign)
    info = models.CharField(max_length=150,verbose_name='个人描述',default='')
    avatar = models.ImageField(upload_to='media/avatar',verbose_name='头像',default='moren.jpg')
    login_time = models.DateTimeField(null=True,verbose_name='登录时间')
    cteated_time = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')
    updated_time = models.DateTimeField(auto_now=True, verbose_name='更新时间')

    def __str__(self):
        return self.username

    class Meta:
        db_table = 'user_profile'
        verbose_name = '用户表'
        verbose_name_plural = verbose_name


class WeiboUser(models.Model):
    wuid = models.CharField(max_length=50,db_index=True)
    access_token = models.CharField(max_length=200,db_index=True)
    buser = models.OneToOneField(UserProfile,null=True)

    class Meta:
        db_table = 'user_weibo'