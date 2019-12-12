# -*- coding: utf-8 -*-
# Generated by Django 1.11.8 on 2019-11-23 22:56
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='WeiboUser',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('wuid', models.CharField(db_index=True, max_length=50)),
                ('access_token', models.CharField(db_index=True, max_length=200)),
                ('buser', models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, to='user.UserProfile')),
            ],
            options={
                'db_table': 'user_weibo',
            },
        ),
    ]
