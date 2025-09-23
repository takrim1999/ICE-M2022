from fastapi import FastAPI
from starlette.responses import JSONResponse

app = FastAPI()

BOOKS = [
    {'title': "First Book", 'author' : "First Author", 'category' : "Zoology"},
    {'title': "Second Book", 'author': "Second Author", 'category': "Chemistry"},
    {'title': "Third Book", 'author': "Third Author", 'category': "Physics"},
    {'title': "Fifth Book", 'author': "Fifth Author", 'category': "Math"},
    {'title': "Sixth Book", 'author': "Sixth Author", 'category': "History"},
]

@app.get("/")
def index():
    return {"Message":"Book Project Initialized"}

@app.get("/books")
def books():
    return JSONResponse(BOOKS)

@app.get("/books/")
def books(title=None,author=None,category=None):
    out = None
    if title:
        for i in BOOKS:
            if i['title'].lower() == title:
                out = i
    if author:
        for i in BOOKS:
            if i['author'].lower() == author:
                out = i
    if category:
        for i in BOOKS:
            if i['category'].lower() == category:
                out = i
    if out:
        return JSONResponse(out)
    else:
        return JSONResponse(BOOKS)

@app.get("/books/{parameter}")
def books(parameter):
    data = " ".join(parameter.split())
    for i in BOOKS:
        if i['title'].lower() == data:
            out = i
    return JSONResponse(out)

@app.get("/search/")
def search(q):
    return JSONResponse({"Message" : f"Search result for your query {q}"})