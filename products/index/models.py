from django.db import models
import random

# Create your models here.

def default_info():
    infos = [
        '果冻,薯片,爆米花,水果糖,棒棒糖,果脯、蜜饯话梅、话李干脆面饼干泡泡糖、口香糖膨化小食品葵花花生核桃奶糖芝麻糊奶酪固齿葡萄干薄荷糖无花果南瓜子和开心果柑桔、橙子、苹果乳饮料牛肉干、烤鱼片香辣鳗鱼丝，香辣鱿鱼丝，香辣鱿鱼块。',
        '碳烤鱿鱼丝，香辣小银鱼，香辣红娘鱼，碳烤鱿鱼仔，泡椒鱿鱼须，碳烤鱿鱼足，蜜汁猪肉脯，麻辣猪肉铺，麻辣牛肉，牛肉丝，鹌鹑蛋，猪肉丝，xo牛肉粒， Q肉，QQ肠，秘制牛肉棒，独家牛肉，天椒麻牛，香辣猪脆骨，香辣牛板筋，果蔬干，芒果干。',
        '榴莲干，杨梅干，菠萝蜜，玉米粒，红枣片，香蕉片，金桔干，紫薯干，猕猴桃干，无花果干，草莓冻干，草莓蜜饯，柠檬蜜饯，秋葵干，蔬菜干，菠萝圈，香芋干，半边梅，水果冻干，海苔豆，盐津葡萄干，榴莲条冻干，藕片，黑加仑，蔓越莓沙琪玛。',
        '蔓越莓曲奇饼干，黄金肉松条，印尼威化饼干，椰丝米糕，椰蓉球，椰子酥，椰子片，蓝莓奶酪片，奶酪玉米棒，秘制豆腐干，甜甜圈，冰淇淋饼干，奶酪起司蛋糕，，可比克，妙脆角，雪丽糍，芝士条，艾比利，好丽友，好多鱼，徐福记，鲜虾片，粟米条。',
        '荷兰豆，保龄豆，玉米花，烧贝壳，铜锣烧，瑞士莲，蛋黄派，卷卷芯，喜之郎.挤挤沙发，果冻薯片爆米花水果糖棒棒糖果脯、蜜饯话梅、话李干脆面饼干泡泡糖、口香糖膨化小食品葵花花生核桃奶糖芝麻糊奶酪固齿葡萄干薄荷糖无花果南瓜子和开心果柑桔。',
        '橙子、苹果乳饮料牛肉干、烤鱼片香辣鳗鱼丝，香辣鱿鱼丝，香辣鱿鱼块，碳烤鱿鱼丝，香辣小银鱼，香辣红娘鱼，碳烤鱿鱼仔，泡椒鱿鱼须，碳烤鱿鱼足，蜜汁猪肉脯，麻辣猪肉铺，麻辣牛肉，牛肉丝，鹌鹑蛋，猪肉丝， xo牛肉粒，Q肉， QQ肠，秘制牛肉棒。',
        '独家牛肉，天椒麻牛，香辣猪脆骨，香辣牛板筋，果蔬干，芒果干，榴莲干，杨梅干，菠萝蜜，玉米粒，红枣片，香蕉片，金桔干，紫薯干，猕猴桃干，无花果干，草莓冻干，草莓蜜饯，柠檬蜜饯，秋葵干，蔬菜干，菠萝圈，香芋干，半边梅，水果冻干，海苔豆。',
        '盐津葡萄干，榴莲条冻干，藕片，黑加仑，蔓越莓曲奇饼干，黄金肉松条，印尼威化饼干，椰丝米糕，椰蓉球，椰子酥，椰子片，蓝莓奶酪片，奶酪玉米棒，秘制豆腐干，甜甜圈， 冰淇淋饼干，奶酪起司蛋糕，可比克，妙脆角，雪丽糍，芝士条， 艾比利，好丽友，好多鱼，徐福记，鲜虾片，粟米条。'
    ]
    return random.choice(infos)



class ProductsType(models.Model):
    title = models.CharField(verbose_name='品类名称',max_length=20)
    page = models.CharField(verbose_name='地址',max_length=20,null=True)
    def __str__(self):
        return self.title
    class Meta:
        db_table = 'products_type'
        verbose_name = '商品类别'
        verbose_name_plural = verbose_name


class Products(models.Model):
    id=models.IntegerField(verbose_name='编号',primary_key=True,unique=True)
    title=models.CharField(verbose_name='名称',max_length=20,unique=True)
    price=models.DecimalField(verbose_name='定价',max_digits=5,decimal_places=2)
    market_price=models.DecimalField(verbose_name='售价',max_digits=5,decimal_places=2)
    repertory=models.IntegerField(verbose_name='库存')
    supplier=models.CharField(verbose_name='供货商',max_length=50)
    invest_money=models.DecimalField(verbose_name='投资金额',max_digits=8,decimal_places=2,default=0)
    sell_number=models.IntegerField(verbose_name='售出数量',default=0)
    img = models.ImageField(upload_to='static/imgs/snacks', verbose_name='图片')
    create_time = models.DateTimeField(verbose_name='创建时间', auto_now_add=True)
    mod_time = models.DateTimeField(verbose_name='修改时间', auto_now=True)
    info = models.CharField(max_length=300,verbose_name='商品描述',default=default_info)
    products_type = models.ForeignKey(ProductsType)
    def __str__(self):
        return self.title
    class Meta:
        db_table='products'
        verbose_name='商品'
        verbose_name_plural=verbose_name