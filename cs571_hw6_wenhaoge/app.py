import flask
import requests
from flask import Flask
from flask import request
from tmdbv3api import TMDb

tmdb = TMDb()
tmdb.api_key = '090db10f0beb02147e9be8f250d5653e'
tmdb.language = 'en'
tmdb.debug = True

app = Flask(__name__)


@app.route('/')
def main():
    return app.send_static_file('index.html')


@app.route('/hot-movies')
def get_hot_movies():
    hot_movies = requests.get(
        'https://api.themoviedb.org/3/trending/movie/week?api_key=090db10f0beb02147e9be8f250d5653e').content
    return hot_movies


@app.route('/hot-tvs')
def get_hot_tvs():
    hot_tvs = requests.get(
        'https://api.themoviedb.org/3/tv/airing_today?api_key=090db10f0beb02147e9be8f250d5653e').content
    return hot_tvs


@app.route('/movie-genre-list')
def get_movie_genre_list():
    movie_genre_list = requests.get('https://api.themoviedb.org/3/genre/movie/list?api_key=090db10f0beb02147e9be8f250d5653e&language=en-US').content
    return movie_genre_list


@app.route('/tv-genre-list')
def get_tv_genre_list():
    tv_genre_list = requests.get('https://api.themoviedb.org/3/genre/tv/list?api_key=090db10f0beb02147e9be8f250d5653e&language=en-US').content
    return tv_genre_list


@app.route('/search')
def search_result():
    keyword = request.args.get('keyword');
    category = request.args.get('category');

    result = None
    if category == 'movies':
        result = requests.get(
            'https://api.themoviedb.org/3/search/movie?api_key=090db10f0beb02147e9be8f250d5653e&language=en-US&query=' + keyword + '&page=1&include_adult=false').content
    elif category == 'tvshows':
        result = requests.get(
            'https://api.themoviedb.org/3/search/tv?api_key=090db10f0beb02147e9be8f250d5653e&language=en-US&page=1&query=' + keyword + '&include_adult=false').content
    elif category == 'movesandtvshows':
        result = requests.get(
            'https://api.themoviedb.org/3/search/multi?api_key=090db10f0beb02147e9be8f250d5653e&language=en-US&query=' + keyword).content
    return result


@app.route('/searchdetail')
def result_detail():
    media_id = request.args.get('id')
    category = request.args.get('type')
    result = None
    if category == 'movie':
        result = requests.get(
            'https://api.themoviedb.org/3/movie/' + media_id + '?api_key=090db10f0beb02147e9be8f250d5653e&language=en-US').content
    elif category == 'tv':
        result = requests.get(
            'https://api.themoviedb.org/3/tv/' + media_id + '?api_key=090db10f0beb02147e9be8f250d5653e&language=en-US').content
    return result


@app.route('/searchdetail_cast')
def result_detail_cast():
    media_id = request.args.get('id')
    category = request.args.get('type')
    result = None
    if category == 'movie':
        result = requests.get(
            'https://api.themoviedb.org/3/movie/' + media_id + '/credits?api_key=090db10f0beb02147e9be8f250d5653e&language=en-US').content
    elif category == 'tv':
        result = requests.get(
            'https://api.themoviedb.org/3/tv/' + media_id + '/credits?api_key=090db10f0beb02147e9be8f250d5653e&language=en-US').content
    return result


@app.route('/searchdetail_reviews')
def result_detail_review():
    media_id = request.args.get('id')
    category = request.args.get('type')
    result = None
    if category == 'movie':
        result = requests.get(
            'https://api.themoviedb.org/3/movie/' + media_id + '/reviews?api_key=090db10f0beb02147e9be8f250d5653e&language=en-US&page=1').content
    elif category == 'tv':
        result = requests.get(
            'https://api.themoviedb.org/3/tv/' + media_id + '/reviews?api_key=090db10f0beb02147e9be8f250d5653e&language=en-US&page=1').content
    return result


if __name__ == '__main__':
    app.run()
