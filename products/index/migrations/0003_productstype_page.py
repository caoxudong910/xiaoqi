# -*- coding: utf-8 -*-
# Generated by Django 1.11.8 on 2019-11-12 21:01
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('index', '0002_products'),
    ]

    operations = [
        migrations.AddField(
            model_name='productstype',
            name='page',
            field=models.CharField(max_length=20, null=True, verbose_name='地址'),
        ),
    ]
