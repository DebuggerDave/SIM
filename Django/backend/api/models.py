from django.db import models
from django.core.validators import int_list_validator

# Create your models here.
class SimUser(models.Model):
    username = models.TextField(max_length=20,unique=True)
    email = models.EmailField(unique=True)
    password = models.TextField(max_length=32)
    lfg = models.IntegerField(default=0)
    wins = models.IntegerField(default=0)
    losses = models.IntegerField(default=0)
class Game(models.Model):
    player_one = models.TextField(max_length=20,unique=True)
    player_two = models.TextField(max_length=20,unique=True)
    line_owner = models.CharField(validators=[int_list_validator],max_length=50)
    current_player = models.TextField(max_length=30, default="/user/1/")
    player_one_lines = models.CharField(validators=[int_list_validator],max_length=50,default =[])
    player_two_lines = models.CharField(validators=[int_list_validator],max_length=50,default = [])

    