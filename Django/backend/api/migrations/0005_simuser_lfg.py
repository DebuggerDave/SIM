# Generated by Django 2.2 on 2019-04-23 04:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_auto_20190420_1809'),
    ]

    operations = [
        migrations.AddField(
            model_name='simuser',
            name='lfg',
            field=models.IntegerField(default=0),
        ),
    ]
