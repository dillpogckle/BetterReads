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
    path('add_friend/', view=views.add_friend, name="add_friend"),
    path('profile_data/', view=views.profile_data, name="profile_data"),
    path('submit_review/', view=views.submit_review, name="submit_review"),
]