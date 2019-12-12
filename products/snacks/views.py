from django.http import JsonResponse
from index.models import Products
from django.core.paginator import *


# Create your views here.

def snacks(request):
    if request.method == 'GET':
        seek = request.GET.get('seek', 'None')
        if seek == 'None':
            all_snacks = Products.objects.filter(products_type=1).order_by('-invest_money')
            paginator = Paginator(all_snacks, 12)
            current_page = request.GET.get('page', 1)
            page = paginator.page(current_page)
            #当前数据的总页码
            max_num = paginator.num_pages
            # 获取当前页面的页码
            num = page.number
            result = {
                "code": 200,
                'max_num':max_num,
                'num':num,
                'seeks':'None'
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
        elif seek:
            snacks = Products.objects.filter(title__contains=seek).order_by('-invest_money')
            if not snacks:
                result = {"code":123,'error':'没有找到此商品'}
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
                'seeks':seek,
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
