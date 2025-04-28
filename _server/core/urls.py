from django.urls import path
from . import views

urlpatterns = [
    path('', view=views.index, name="index"),
    path('search/<query>/', view=views.search, name="search"),
    path('works/<work_num>/', view=views.get_book, name="get_book"),
    path('authors/<author_key>/', view=views.get_author, name="get_author"),
    path('add_to_list/<work_num>/', view=views.add_to_list, name="add_to_list"),
    path('book_status/<work_num>/', view=views.book_status, name="book_status"),
    path('book_lists/', view=views.book_lists, name="book_lists"),
]