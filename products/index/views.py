from django.http import JsonResponse
from .models import ProductsType
from index.models import Products
from django.core.paginator import *

# Create your views here.

def index(request):
    # 加载所有种类商品
    # [{ 'type':{'title':'零食'},'goods':[{},{},{}] },]
    if request.method == 'GET':
        seek = request.GET.get('seek')
        if seek:
            snacks = Products.objects.filter(title__contains=seek).order_by('-invest_money')
            if not snacks:
                result = {"code": 123, 'error': '没有找到此商品'}
                return JsonResponse(result)
            all_snacks = snacks.order_by('-invest_money')
            paginator = Paginator(all_snacks, 12)
            current_page = request.GET.get('page', 1)
            page = paginator.page(current_page)
            # 当前数据的总页码
            max_num = paginator.num_pages
            # 获取当前页面的页码
            num = page.number
            result = {
                "code": 200,
                'max_num': max_num,
                'num': num,
                'seeks': seek,
            }
            data = []
            for obj in page:
                dic = {}
                dic["title"] = obj.title
                dic['supplier'] = obj.supplier
                dic['img'] = str(obj.img)
                dic['market_price'] = int(obj.market_price)
                dic['id'] = obj.id
                data.append(dic)
            result["data"] = data
            return JsonResponse(result)
        else:
            result = {'code':200,}
            all_list = []
            all_type = ProductsType.objects.all()
            for _type in all_type:
                data = {}
                data['type'] = {'title':_type.title}
                data['page'] = {'page':_type.page}
                data['goods'] = []
                all_goods = _type.products_set.order_by('-invest_money')[:10]
                for good in all_goods:
                    d={}
                    d['id'] = good.id
                    d['img'] = str(good.img)
                    d['title'] = good.title
                    d['market_price'] = int(good.market_price)
                    data['goods'].append(d)
                all_list.append(data)
            result['data'] = all_list
            return JsonResponse(result)
