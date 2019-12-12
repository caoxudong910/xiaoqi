from django.conf.urls import url
from . import views


urlpatterns = [
    url(r'^/register$',views.register),
    url(r'^/login$',views.login),
    url(r'^/weibo/url$', views.users_weibo_url),
    url(r'^/weibo/token$', views.users_weibo_token),
]