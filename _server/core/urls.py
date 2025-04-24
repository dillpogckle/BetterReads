from django.urls import path
from . import views

urlpatterns = [
    path('', view=views.index, name="index"),
    path('search/<query>/', view=views.search, name="search"),
]