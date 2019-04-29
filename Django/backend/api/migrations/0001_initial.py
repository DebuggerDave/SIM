# Generated by Django 2.2 on 2019-04-20 17:53

import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='SimUser',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.TextField(max_length=20, unique=True)),
                ('password', models.TextField(max_length=32)),
            ],
        ),
        migrations.CreateModel(
            name='Game',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('game_state', models.CharField(max_length=50, validators=[django.core.validators.int_list_validator])),
                ('player_one', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='player_one', to='api.SimUser')),
                ('player_two', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='player_two', to='api.SimUser')),
            ],
        ),
    ]