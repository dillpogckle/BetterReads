from django.urls import path
from . import views

urlpatterns = [
    path('', view=views.index, name="index"),
    path('search/<query>/', view=views.search, name="search"),
    path('works/<work_num>/', view=views.get_book, name="get_book"),
    path('authors/<author_key>/', view=views.get_author, name="get_author"),
    path('add_want_to_read/<work_num>/', view=views.add_want_to_read, name="add_want_to_read"),
]