from django.shortcuts import render
from django.conf  import settings
import json
import os
import requests
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required

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