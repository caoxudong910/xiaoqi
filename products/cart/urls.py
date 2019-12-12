from django.conf.urls import url
from . import views

urlpatterns=[
    # http://127.0.0.1:8000/v1/cart
    url(r'^$',views.Cart.as_view()),

]