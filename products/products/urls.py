"""products URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url,include
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    # http://127.0.0.1:8000/v1/snacks
    url(r'^v1/snacks',include('snacks.urls')),
    # http://127.0.0.1:8000/v1/index
    url(r'^v1/index',include('index.urls')),
    # http://127.0.0.1:8000/v1/user
    url(r'^v1/user',include('user.urls')),
    # http://127.0.0.1:8000/v1/message
    url(r'^v1/message',include('message.urls')),
    # http://127.0.0.1:8000/v1/cart
    url(r'^v1/cart',include('cart.urls'))

]



# 绑定 media_url 和 media_root,
urlpatterns += static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)