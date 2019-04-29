from tastypie.resources import ModelResource, fields, ALL
from tastypie.authorization import Authorization
from api.models import SimUser, Game


class SimUserResource(ModelResource):
    class Meta:
        queryset = SimUser.objects.all()
        resource_name = 'user'
        authorization = Authorization()
        fields=['id','username','password','email']
        filtering={'username':ALL,'email':ALL,'id':ALL}
        
class GameResource(ModelResource):
    #player_one = fields.ForeignKey(SimUserResource,'SimUser')
    #player_two = fields.ForeignKey(SimUserResource,'SimUser')
    
    class Meta:
        queryset = Game.objects.all()
        resource_name = 'game'
        authorization = Authorization()
        always_return_data = True
