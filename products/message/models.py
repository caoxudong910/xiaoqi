from django.db import models
from user.models import UserProfile
from index.models import Products

# Create your models here.

class Message(models.Model):
    content = models.CharField(max_length=50,verbose_name='评论内容')
    created_time = models.DateTimeField(auto_now_add=True,verbose_name='留言创建时间')
    parent_message = models.IntegerField(default=0,verbose_name='关联的留言ID')
    publisher = models.ForeignKey(UserProfile,verbose_name='评论的用户')
    topic = models.ForeignKey(Products,verbose_name='评论的商品')

    class Meta:
        db_table='message'
        verbose_name='评论表'
        verbose_name_plural=verbose_name