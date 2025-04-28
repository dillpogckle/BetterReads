from django.shortcuts import render
from django.conf  import settings
import json
import os
import requests
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from .models import UserProfile, Book, Review
from django.contrib.auth.models import User

# Load manifest when server launches
MANIFEST = {}
if not settings.DEBUG:
    f = open(f"{settings.BASE_DIR}/core/static/manifest.json")
    MANIFEST = json.load(f)


# Create your views here.
def index(req):
    context = {
        "asset_url": os.environ.get("ASSET_URL", ""),
        "debug": settings.DEBUG,
        "manifest": MANIFEST,
        "js_file": "" if settings.DEBUG else MANIFEST["src/main.ts"]["file"],
        "css_file": "" if settings.DEBUG else MANIFEST["src/main.ts"]["css"][0]
    }
    return render(req, "core/index.html", context)

def search(req, query):
    if req.method != "GET":
        return JsonResponse({"error": "Invalid request method."}, status=405)
    try:
        url = f"https://openlibrary.org/search.json?q={query}"
        res = requests.get(url)

        res.raise_for_status()  # Will raise an HTTPError for bad responses (4xx, 5xx)

        data = res.json()
        return JsonResponse(data)
    except requests.exceptions.HTTPError as http_err:
        return JsonResponse({"error": f"HTTP error occurred: {http_err}"}, status=res.status_code)
    except requests.exceptions.RequestException as req_err:
        return JsonResponse({"error": f"Request error occurred: {req_err}"}, status=500)
    except ValueError:
        return JsonResponse({"error": "Failed to parse JSON response."}, status=500)
    except Exception as e:
        return JsonResponse({"error": f"An unexpected error occurred: {str(e)}"}, status=500)


def get_book(req, work_num):
    if req.method != "GET":
        return JsonResponse({"error": "Invalid request method."}, status=405)
    try:
        url = f"https://openlibrary.org/works/{work_num}.json"
        res = requests.get(url)

        res.raise_for_status()  # Will raise an HTTPError for bad responses (4xx, 5xx)

        data = res.json()
        return JsonResponse(data)
    except requests.exceptions.HTTPError as http_err:
        return JsonResponse({"error": f"HTTP error occurred: {http_err}"}, status=res.status_code)
    except requests.exceptions.RequestException as req_err:
        return JsonResponse({"error": f"Request error occurred: {req_err}"}, status=500)
    except ValueError:
        return JsonResponse({"error": "Failed to parse JSON response."}, status=500)
    except Exception as e:
        return JsonResponse({"error": f"An unexpected error occurred: {str(e)}"}, status=500)


def get_author(req, author_key):
    if req.method != "GET":
        return JsonResponse({"error": "Invalid request method."}, status=405)

    if not author_key:
        return JsonResponse({"error": "Missing authorKey"}, status=400)

    try:
        res = requests.get(f"https://openlibrary.org/authors/{author_key}.json")

        res.raise_for_status()  # Will raise an HTTPError for bad responses (4xx, 5xx)

        return JsonResponse(res.json())
    except requests.exceptions.HTTPError as http_err:
        return JsonResponse({"error": f"HTTP error occurred: {http_err}"}, status=res.status_code)
    except requests.exceptions.RequestException as req_err:
        return JsonResponse({"error": f"Request error occurred: {req_err}"}, status=500)
    except ValueError:
        return JsonResponse({"error": "Failed to parse JSON response."}, status=500)
    except Exception as e:
        return JsonResponse({"error": f"An unexpected error occurred: {str(e)}"}, status=500)


@login_required
def add_to_list(request, work_num):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            list= data.get("list")
            title = data.get("title")
            author = data.get("author")
            cover_image = data.get("coverImage")
            description = data.get("description")

            book, created = Book.objects.get_or_create(
                work_num=work_num,  # assuming `work_num` is a unique identifier
                defaults={
                    "title": title,
                    "author": author,
                    "cover_image": cover_image,
                    "description": description,
                },
            )

            # Get the user profile and add the book to the "to_read" list
            user_profile = UserProfile.objects.get(user=request.user)

            if list == "to_read":
                user_profile.to_read.add(book)
            elif list == "reading":
                user_profile.to_read.remove(book)
                user_profile.reading.add(book)
            elif list == "read":
                user_profile.reading.remove(book)
                user_profile.to_read.remove(book)
                user_profile.read.add(book)
            else:
                return JsonResponse({"error": "Invalid list specified."}, status=400)

            return JsonResponse({"message": "Book added to your 'want to read' list."}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format."}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method."}, status=405)

@login_required
def book_status(req, work_num):
    if req.method == "GET":
        try:
            user_profile = UserProfile.objects.get(user=req.user)
            book = Book.objects.get(work_num=work_num)

            if book in user_profile.to_read.all():
                return JsonResponse({"status": "to_read"}, status=200)
            elif book in user_profile.reading.all():
                return JsonResponse({"status": "reading"}, status=200)
            elif book in user_profile.read.all():
                return JsonResponse({"status": "read"}, status=200)
            else:
                return JsonResponse({"status": "not_in_list"}, status=200)

        except Book.DoesNotExist:
            return JsonResponse({"error": "Book not found."}, status=404)
        except UserProfile.DoesNotExist:
            return JsonResponse({"error": "User profile not found."}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method."}, status=405)


@login_required
def book_lists(req):
    if req.method == "GET":
        try:
            user_profile = UserProfile.objects.get(user=req.user)

            to_read_books = user_profile.to_read.all()
            reading_books = user_profile.reading.all()
            read_books = user_profile.read.all()

            to_read_list = [{"work_num": book.work_num, "title": book.title, "author": book.author, "cover_image": book.cover_image} for book in to_read_books]
            reading_list = [{"work_num": book.work_num, "title": book.title, "author": book.author, "cover_image": book.cover_image} for book in reading_books]
            read_list = [{"work_num": book.work_num, "title": book.title, "author": book.author, "cover_image": book.cover_image} for book in read_books]

            return JsonResponse({
                "to_read": to_read_list,
                "reading": reading_list,
                "read": read_list
            }, status=200)

        except UserProfile.DoesNotExist:
            return JsonResponse({"error": "User profile not found."}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method."}, status=405)

@login_required
def add_friend(req):
    if req.method == "POST":
        try:
            data = json.loads(req.body)
            friend_key = data.get("friend_key")

            if not friend_key:
                return JsonResponse({"error": "Missing friend_key"}, status=400)

            user_profile = UserProfile.objects.get(user=req.user)

            if user_profile.add_friend_by_key(friend_key):
                # Fetch the friend_profile manually so you can return it
                friend_profile = UserProfile.objects.get(friend_key=friend_key)
                return JsonResponse({
                    "first_name": friend_profile.user.first_name,
                    "last_name": friend_profile.user.last_name,
                    "friend_key": friend_profile.friend_key
                }, status=200)
            else:
                return JsonResponse({"error": "Friend key not found."}, status=404)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format."}, status=400)
        except UserProfile.DoesNotExist:
            return JsonResponse({"error": "User profile not found."}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method."}, status=405)

@login_required
def profile_data(req):
    if req.method == "GET":
        try:
            user_profile = UserProfile.objects.get(user=req.user)

            profile_data = {
                "first_name": req.user.first_name,
                "last_name": req.user.last_name,
                "friend_key": user_profile.friend_key,
                "read_count": user_profile.read.count(),
                "friends_count": user_profile.friends.count(),
                "friends": [{
                    "first_name": friend.user.first_name,
                    "last_name": friend.user.last_name,
                    "friend_key": friend.friend_key
                } for friend in user_profile.friends.all()]
            }

            return JsonResponse(profile_data, status=200)

        except UserProfile.DoesNotExist:
            return JsonResponse({"error": "User profile not found."}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method."}, status=405)

@login_required
def get_friends(req):
    if req.method == "GET":
        try:
            user_profile = UserProfile.objects.get(user=req.user)
            friends = user_profile.friends.all()

            friend_list = [{
                "username": friend.user.username,
                "friend_key": friend.friend_key
            } for friend in friends]

            return JsonResponse({"friends": friend_list}, status=200)

        except UserProfile.DoesNotExist:
            return JsonResponse({"error": "User profile not found."}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method."}, status=405)


@login_required
def get_friend_code(req):
    if req.method == "GET":
        try:
            user_profile = UserProfile.objects.get(user=req.user)
            return JsonResponse({"friend_key": user_profile.friend_key}, status=200)

        except UserProfile.DoesNotExist:
            return JsonResponse({"error": "User profile not found."}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method."}, status=405)

@login_required
def write_review(req):
    if req.method == "POST":
        try:
            data = json.loads(req.body)

            work_num = data.get("work_num")
            content = data.get("content")
            rating = data.get("rating")

            if not work_num or not content:
                return JsonResponse({"error": "Missing required fields."}, status=400)

            book = Book.objects.get(work_num=work_num)
            user_profile = UserProfile.objects.get(user=req.user)

            # Check if a review already exists for this user and book
            review, created = Review.objects.get_or_create(
                user=user_profile.user,
                book=book,
                defaults={"content": content, "rating": rating}
            )

            if not created:
                # Update existing review
                review.content = content
                review.rating = rating
                review.save()

            return JsonResponse({"message": "Review saved successfully."}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format."}, status=400)
        except Book.DoesNotExist:
            return JsonResponse({"error": "Book not found."}, status=404)
        except UserProfile.DoesNotExist:
            return JsonResponse({"error": "User profile not found."}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method."}, status=405)

