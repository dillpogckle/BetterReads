from django.shortcuts import render
from django.conf  import settings
import json
import os
import requests
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from .models import UserProfile, Book

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
    url = f"https://openlibrary.org/search.json?q={query}"
    res = requests.get(url)

    if res.status_code == 200:
        data = res.json()
        return JsonResponse(data)
    else:
        return JsonResponse({"error": "Failed to fetch data from Open Library"}, status=res.status_code)



def get_book(req, work_num):
    url = f"https://openlibrary.org/works/{work_num}.json"

    res = requests.get(url)

    if res.status_code == 200:
        data = res.json()
        return JsonResponse(data)
    else:
        return JsonResponse({"error": "Failed to fetch data from Open Library"}, status=res.status_code)


def get_author(req, author_key):
    if not author_key:
        return JsonResponse({"error": "Missing authorKey"}, status=400)

    res = requests.get(f"https://openlibrary.org/authors/{author_key}.json")

    if res.ok:
        return JsonResponse(res.json())
    else:
        return JsonResponse({"error": "Failed to fetch data from Open Library"}, status=res.status_code)

@login_required
def add_want_to_read(request, work_num):
    if request.method == "POST":
        try:
            data = json.loads(request.body)


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
            user_profile.to_read.add(book)

            return JsonResponse({"message": "Book added to your 'want to read' list."}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format."}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method."}, status=405)