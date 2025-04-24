from django.urls import path
from . import views

urlpatterns = [
    path('', view=views.index, name="index"),
    path('search/<query>/', view=views.search, name="search"),
    path('works/<work_num>/', view=views.get_book, name="get_book"),
]