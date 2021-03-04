let movieGenreMap = new Map();
let tvGenreMap = new Map();

function loadPage() {
    // hot movies on home page
    var xmlHttpHotMovies = new XMLHttpRequest();
    xmlHttpHotMovies.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var hotMovies = JSON.parse(this.responseText)["results"];
            var movieSlidesShow = document.getElementsByClassName("moviesmySlides");
            for (var i = 0; i < 5; i++) {
                if (hotMovies[i]["title"] != null && hotMovies[i]["title"].length > 0 && hotMovies[i]["release_date"] != null) {
                    if (hotMovies[i]["backdrop_path"] == null || hotMovies[i]["backdrop_path"].length == 0) {
                        movieSlidesShow[i].getElementsByClassName("movie_slides_img")[0].src = "/static/img/movie_placeholder.jpg";
                    } else {
                        movieSlidesShow[i].getElementsByClassName("movie_slides_img")[0].src = "https://image.tmdb.org/t/p/w780" + hotMovies[i]["backdrop_path"];
                    }
                    movieSlidesShow[i].getElementsByClassName("trending_movie_title")[0].innerHTML = hotMovies[i]["title"];
                    movieSlidesShow[i].getElementsByClassName("trending_movie_year")[0].innerHTML = hotMovies[i]["release_date"].substr(0, 4);

                }
            }
        }
    };
    xmlHttpHotMovies.open("GET", "/hot-movies", true);
    xmlHttpHotMovies.send();

    // hot TVs on home page
    var xmlHttpAiringTV = new XMLHttpRequest();
    xmlHttpAiringTV.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var hotTVs = JSON.parse(this.responseText)["results"];
            var movieSlidesShow = document.getElementsByClassName("tvshowsmySlides");
            for (var i = 0; i < 5; i++) {
                if (hotTVs[i]["name"] != null && hotTVs[i]["name"].length > 0  && hotTVs[i]["first_air_date"] != null) {
                    if (hotTVs[i]["backdrop_path"] == null || hotTVs[i]["backdrop_path"].length == 0) {
                        movieSlidesShow[i].getElementsByClassName("tvshow_slides_img")[0].src = "/static/img/movie_placeholder.jpg";
                    } else {
                        movieSlidesShow[i].getElementsByClassName("tvshow_slides_img")[0].src = "https://image.tmdb.org/t/p/w780" + hotTVs[i][ "backdrop_path"];
                    }

                    movieSlidesShow[i].getElementsByClassName("airing_tv_title")[0].innerHTML = hotTVs[i]["name"];
                    movieSlidesShow[i].getElementsByClassName("airing_tv_year")[0].innerHTML = hotTVs[i]["first_air_date"].substr(0, 4);
                }
            }
        }
    };
    xmlHttpAiringTV.open("GET", "/hot-tvs", true);
    xmlHttpAiringTV.send();


    // get movie genre list
    // ============================================================
    var xmlHttpMovieGenreList = new XMLHttpRequest();
    xmlHttpMovieGenreList.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var movieGenreResult = JSON.parse(this.responseText)["genres"];


            for (var i = 0; i < movieGenreResult.length; i++) {
                movieGenreMap.set(movieGenreResult[i]["id"], movieGenreResult[i]["name"]);
            }
        }
    };
    xmlHttpMovieGenreList.open("GET", "/movie-genre-list", true);
    xmlHttpMovieGenreList.send();


    // get tv genre list
    // ============================================================
    var xmlHttpTvGenreList = new XMLHttpRequest();
    xmlHttpTvGenreList.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var tvGenreResult = JSON.parse(this.responseText)["genres"];

            for (var i = 0; i < tvGenreResult.length; i++) {
                tvGenreMap.set(tvGenreResult[i]["id"], tvGenreResult[i]["name"]);
            }
        }
    };
    xmlHttpTvGenreList.open("GET", "/tv-genre-list", true);
    xmlHttpTvGenreList.send();
}


var resultIdArray = [];
var resultMediaTypeArray = [];
function search() {
//    if (empty search input)
    var keywordInput = document.getElementById("keyword_input").value;
    var categoryInput = document.getElementById("category_dropdown").value;
    console.log("keyword is: " + keywordInput);
    console.log("category is: " + categoryInput);
    if (keywordInput == null || keywordInput.length == 0 || categoryInput == null || categoryInput.length == 0) {
        alert("Please fill out this field");
        return;
    }

//    else if (valid search input)
    document.getElementById("searchpage_placeholder").style.display = "none";
    // clear previous search results
    document.getElementById("showingResultMessage").style.display = "none";
    document.getElementById("noResultMessage").style.display = "none";

    // document.getElementById("modal_img").style.display = "none";


    var result = document.getElementsByClassName("singlesearch");
    for (var index = 1; index < result.length; index++) {
        result[index].getElementsByTagName("h4")[0].innerHTML = "";
        result[index].getElementsByTagName("img")[0].src = "/static/img/movie_poster_placeholder.png"
        result[index].getElementsByClassName("date")[0].innerHTML = "";
        result[index].getElementsByClassName("genre")[0].innerHTML = "";
        result[index].getElementsByClassName("reviewscore")[0].innerHTML = "";
        result[index].getElementsByClassName("reviewcount")[0].innerHTML = "";
        result[index].getElementsByClassName("details")[0].innerHTML = "";

        result[index].style.display = "none";
    }



    // search_results

    resultIdArray = [];
    resultMediaTypeArray = [];
    var url = "/search?keyword=" + keywordInput + "&category=" + categoryInput;
    var xmlHttpSearch = new XMLHttpRequest();
    xmlHttpSearch.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

            var resultArray = JSON.parse(this.responseText)["results"];
            var resultLength = resultArray.length;
            console.log("result length: " + resultLength);
            // invalid input
            if (resultArray == null || resultLength == 0) {
                document.getElementById("noResultMessage").style.display = "block";
                return;
            }

            var searchResults =[];
            var index = 0;
            if (categoryInput == "movies" || categoryInput == "tvshows") {
                while (index < 10 && index < resultLength) {
                    resultIdArray.push(resultArray[index]["id"]);
                    if (categoryInput == "movies") {
                        resultMediaTypeArray.push("movie");
                    } else if (categoryInput == "tvshows") {
                        resultMediaTypeArray.push("tv");
                    }

                    searchResults.push(resultArray[index]);
                    index++;
                }
            } else if (categoryInput == "movesandtvshows") {
                var mediaType = resultArray[index]["media_type"];
                while (index < 10 && index < resultLength) {
                    if (mediaType != "person") {
                        resultIdArray.push(resultArray[index]["id"]);
                        resultMediaTypeArray.push(resultArray[index]["media_type"]);
                        searchResults.push(resultArray[index]);
                    }
                    index++;
                }
            }
            console.log(searchResults.length);
            console.log("id array: " + resultIdArray);

            // working
            document.getElementById("showingResultMessage").style.display = "block";
            document.getElementById("search_results").children[0].style.display = "flex";
            document.getElementsByClassName("singlesearch")[0].style.display = "flex";

            // empty
            // console.log(document.getElementById("search_results").children[0]);
            // empty space
            // console.log(document.getElementsByClassName("singlesearch")[0]);
            // // first result


            for (var i = 0; i < searchResults.length; i++) {

                var fullSearch = document.getElementById("search_results");
                var testChild = document.getElementById("search_results").children[0];
                // document.getElementById("search_results").children[0].style.display = "none";


                // not working
                // var fullSearch = document.getElementById("search_results")[0];
                // console.log(fullSearch);
                // var testChild = fullSearch.childNodes[1];
                var cloneChild = testChild.cloneNode(true);

                cloneChild.id = cloneChild.id + i.toString();
                // cloneChild.getElementsByClassName("searchcontent")[i].style.removeProperty("display");
                // cloneChild.getElementsByClassName("searchimg")[i].style.removeProperty("display");


                if (searchResults[i]["poster_path"] == null || searchResults[i]["poster_path"].length == 0) {
                    cloneChild.getElementsByTagName("img")[0].src = "/static/img/movie_poster_placeholder.png"
                } else {
                    cloneChild.getElementsByTagName("img")[0].src = "https://image.tmdb.org/t/p/w185" + searchResults[i]["poster_path"];
                }



                var mediaType = searchResults[i]["media_type"];
                if (categoryInput == "movies") {
                    cloneChild.getElementsByTagName("h4")[0].innerHTML = searchResults[i]["title"];
                    if (searchResults[i]["release_date"] != null) {
                        cloneChild.getElementsByClassName("date")[0].innerHTML = searchResults[i]["release_date"].substr(0, 4);
                    }

                } else if (categoryInput == "tvshows") {
                    cloneChild.getElementsByTagName("h4")[0].innerHTML = searchResults[i]["name"];
                    if (searchResults[i]["first_air_date"] != null) {
                        cloneChild.getElementsByClassName("date")[0].innerHTML = searchResults[i]["first_air_date"].substr(0, 4);
                    }
                } else if (categoryInput == "movesandtvshows") {
                    if (mediaType == "movie") {
                        cloneChild.getElementsByTagName("h4")[0].innerHTML = searchResults[i]["title"];
                        if (searchResults[i]["release_date"] != null) {
                            cloneChild.getElementsByClassName("date")[0].innerHTML = searchResults[i]["release_date"].substr(0, 4);
                        }
                    } else if (mediaType == "tv") {
                        cloneChild.getElementsByTagName("h4")[0].innerHTML = searchResults[i]["name"];
                        if (searchResults[i]["first_air_date"] != null) {
                            cloneChild.getElementsByClassName("date")[0].innerHTML = searchResults[i]["first_air_date"].substr(0, 4);
                        }
                    }
                }

                var genreString = " | ";
                var genreArray = searchResults[i]["genre_ids"];
                // console.log("id: " + genreArray[0]);
                // console.log("genre: " + movieGenreMap.get(genreArray[0]));

                for (var j = 0; j < genreArray.length; j++) {
                    if (categoryInput == "movies") {
                        genreString += movieGenreMap.get(genreArray[j]);
                    } else if (categoryInput == "tvshows") {
                        genreString += tvGenreMap.get(genreArray[j]);
                    } else if (categoryInput == "movesandtvshows") {
                        if (mediaType == "movie") {
                            genreString += movieGenreMap.get(genreArray[j]);
                        } else if (mediaType == "tv") {
                            genreString += tvGenreMap.get(genreArray[j]);
                        }
                    }
                    if (j != genreArray.length - 1) {
                        genreString += ", ";
                    }
                }
                cloneChild.getElementsByClassName("genre")[0].innerHTML = genreString;

                if (searchResults[i]["vote_average"] != null) {
                    cloneChild.getElementsByClassName("reviewscore")[0].innerHTML = (parseFloat(searchResults[i]["vote_average"]) / 2.00).toFixed(2) + "/5";
                }
                cloneChild.getElementsByClassName("reviewcount")[0].innerHTML = searchResults[i]["vote_count"] + " votes";
                cloneChild.getElementsByClassName("details")[0].innerHTML = searchResults[i]["overview"];


                fullSearch.appendChild(cloneChild);
            }

            // empty space
            // console.log(document.getElementById("search_results").children[0]);
            document.getElementById("search_results").children[0].style.display = "none";

            document.getElementsByClassName("singlesearch")[0].style.display = "none";
            // empty space
            // console.log(document.getElementsByClassName("singlesearch")[0]);
        }
    };
    xmlHttpSearch.open("GET", url, true);
    xmlHttpSearch.send();
}


// clear button
function clearall() {
    resultIdArray = [];
    resultMediaTypeArray = [];

    document.getElementById("keyword_input").value = "";
    document.getElementById("category_dropdown").value = "";
    document.getElementById("searchpage_placeholder").style.display = "block";
    document.getElementById("noResultMessage").style.display = "none";
    document.getElementById("showingResultMessage").style.display = "none";

    var result = document.getElementsByClassName("singlesearch");
    for (var index = 1; index < result.length; index++) {
        result[index].innerHTML = '';
        result[index].style.display = "none";
    }
}

function showMore(curr) {
    // var resultSize = resultIdArray.length;
    // "movie" or "tv"
    // console.log(resultMediaTypeArray);
    var myParentNode = curr.parentNode.parentNode;


    // must be id
    document.getElementById("movie_detail").style.display = 'block';
    document.getElementById("movie_detail").style.position = "relative;";



    // can display another modal, cast list need to be removed too
    var singlemodal = document.getElementsByClassName("modal_content");

    singlemodal[0].style.display = "block";
    // whole results div, not modal
    // var results = document.getElementById("search_results");
    // console.log(results);

    // var index = document.getElementById("singlesearch");

    var index = myParentNode.id.toString();
    var mediaType = resultMediaTypeArray[index];
    console.log("id is: " + resultIdArray[index] + " media type is: " + mediaType);

    var modalContent = document.getElementsByClassName("modal_content");



    // movie modal detail section
    // =========================================================
    var url = "/searchdetail?id=" + resultIdArray[index] + "&type=" + resultMediaTypeArray[index];
    var xmlHttpSearchDetail = new XMLHttpRequest();
    xmlHttpSearchDetail.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log("movie modal detail section");

            // document.getElementById("modal_img").style.display = "none";
            // document.getElementById("modal_img").style.display = "block";


            var description = document.getElementById("main_description");
            description.getElementsByClassName("movie_header")[0].innerHTML = "";
            description.getElementsByClassName("tmdbLink")[0].href = "";

            description.getElementsByClassName("date")[0].innerHTML = "";
            description.getElementsByClassName("genre")[0].innerHTML = "";
            description.getElementsByClassName("reviewscore")[0].innerHTML = "";
            description.getElementsByClassName("reviewcount")[0].innerHTML = "";

            description.getElementsByClassName("details")[0].innerHTML = "";
            description.getElementsByClassName("spoken_language")[0].innerHTML = "";

            var resultArray = JSON.parse(this.responseText);


            document.getElementsByClassName("modal_content")[0].getElementsByClassName("modalImg").src = "/static/img/movie_placeholder.jpg";
            if (resultArray["backdrop_path"] != null && resultArray["backdrop_path"].length > 0) {
                modalContent[0].getElementsByClassName("modalImg")[0].src = "https://image.tmdb.org/t/p/w780/" + resultArray["backdrop_path"];
            } else {
                modalContent[0].getElementsByClassName("modalImg").src = "/static/img/movie_placeholder.jpg";
            }



            if (mediaType == "movie") {
                description.getElementsByClassName("movie_header")[0].innerHTML = resultArray["title"];
                if (resultArray["release_date"] != null && resultArray["release_date"].length > 0) {
                    description.getElementsByClassName("date")[0].innerHTML = resultArray["release_date"].substr(0, 4);
                }
                description.getElementsByClassName("tmdbLink")[0].href = "https://www.themoviedb.org/movie/" + resultIdArray[index];
            } else if (mediaType == "tv") {
                description.getElementsByClassName("movie_header")[0].innerHTML = resultArray["name"];
                if (resultArray["first_air_date"] != null && resultArray["first_air_date"].length > 0) {
                    description.getElementsByClassName("date")[0].innerHTML = resultArray["first_air_date"].substr(0, 4);
                }
                description.getElementsByClassName("tmdbLink")[0].href = "https://www.themoviedb.org/tv/" + resultIdArray[index];
            }


            // genre
            var genresString = " | ";
            var genresArray = resultArray["genres"];
            for (var i = 0; i < genresArray.length; i++) {
                 genresString += genresArray[i]["name"];
                 if (i != genresArray.length - 1) {
                     genresString += ", "
                 }
            }
            description.getElementsByClassName("genre")[0].innerHTML = genresString;
            if (resultArray["vote_average"] != null) {
                description.getElementsByClassName("reviewscore")[0].innerHTML = (parseFloat(resultArray["vote_average"]) / 2.00).toFixed(2) + "/5";
            }


            if (resultArray["vote_count"] != null) {
                description.getElementsByClassName("reviewcount")[0].innerHTML = resultArray["vote_count"] + " votes";
            }

            if (resultArray["overview"] != null) {
                description.getElementsByClassName("details")[0].innerHTML = resultArray["overview"];
            }

            var languageString = "";
            var languageArray = resultArray["spoken_languages"];
            for (var j = 0; j < languageArray.length; j++) {
                languageString += languageArray[j]["english_name"];
                if (j != languageArray.length - 1) {
                    languageString += ", ";
                }
            }
            description.getElementsByClassName("spoken_language")[0].innerHTML = languageString;
        }
    };

    xmlHttpSearchDetail.open("GET", url, true);
    xmlHttpSearchDetail.send();


    // cast
    // ============================================ //
    var url = "/searchdetail_cast?id=" + resultIdArray[index] + "&type=" + resultMediaTypeArray[index];
    var xmlHttpSearchDetailCast = new XMLHttpRequest();
    xmlHttpSearchDetailCast.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

            var result = document.getElementsByClassName("person_column");
            for (var i = 1; i < result.length; i++) {
                result[i].style.display = "none";
                // console.log(result[i]);
            }

            if (JSON.parse(this.responseText)["id"] != resultIdArray[index]) {
                alert("id not matched");
            }
            var resultArray = JSON.parse(this.responseText)["cast"];

            var castArray = [];
            var count = 0;
            while (count < 8 && count < resultArray.length) {
                castArray.push(resultArray[count]);
                count++;
            }
            console.log("cast size: " + castArray.length);

            if (castArray.length > 4) {
                document.getElementsByClassName("row_one")[0].style.display = "flex";
                document.getElementsByClassName("row_one")[0].childNodes[1].style.display = "flex";
                // document.getElementsByClassName("row_two")[0].childNodes[1].style.display = "flex";
                for (var i = 0; i < 4; i++) {
                    var fullSearch = document.getElementsByClassName("row_one")[0];
                    var child = fullSearch.childNodes[1];

                    var cloneChild = child.cloneNode(true);
                    cloneChild.id = cloneChild.id + i.toString();

                    cloneChild.getElementsByClassName("personimg")[0].src = "/static/img/person_placeholder.png";
                    if (castArray[i]["profile_path"] != null && castArray[i]["profile_path"].length > 0) {
                        cloneChild.getElementsByClassName("personimg")[0].src = "https://image.tmdb.org/t/p/w185/" + castArray[i]["profile_path"];
                    } else {
                        cloneChild.getElementsByClassName("personimg")[0].src = "/static/img/person_placeholder.png";
                    }
                    cloneChild.getElementsByClassName("actual_name")[0].innerHTML = "<b>" + castArray[i]["name"] + "</b>";
                    cloneChild.getElementsByClassName("character_name")[0].innerHTML = castArray[i]["character"];

                    fullSearch.appendChild(cloneChild);
                }
                document.getElementsByClassName("row_one")[0].childNodes[1].style.display = "none";


                document.getElementsByClassName("row_two")[0].style.display = "flex";
                document.getElementsByClassName("row_two")[0].childNodes[1].style.display = "flex";
                for (var j = 4; j < 8; j++) {
                    var fullSearch = document.getElementsByClassName("row_two")[0];
                    var child = fullSearch.childNodes[1];

                    var cloneChild = child.cloneNode(true);
                    cloneChild.id = cloneChild.id + i.toString();

                    if (j < castArray.length) {
                        cloneChild.getElementsByClassName("personimg")[0].src = "/static/img/person_placeholder.png";
                        if (castArray[j]["profile_path"] != null && castArray[j]["profile_path"].length > 0) {
                            cloneChild.getElementsByClassName("personimg")[0].src = "https://image.tmdb.org/t/p/w185/" + castArray[j]["profile_path"];
                        } else {
                            cloneChild.getElementsByClassName("personimg")[0].src = "/static/img/person_placeholder.png";
                        }

                        cloneChild.getElementsByClassName("actual_name")[0].innerHTML = "<b>" + castArray[j]["name"] + "</b>";
                        cloneChild.getElementsByClassName("character_name")[0].innerHTML = castArray[j]["character"];
                    } else {
                        cloneChild.innerHTML = "";
                    }
                    fullSearch.appendChild(cloneChild);
                }
                document.getElementsByClassName("row_two")[0].childNodes[1].style.display = "none";
            } else if (castArray.length <= 4 && castArray.length > 0) {
                document.getElementsByClassName("row_one")[0].style.display = "flex";
                document.getElementsByClassName("row_two")[0].style.display = "none";
                document.getElementsByClassName("row_one")[0].childNodes[1].style.display = "flex";
                for (var i = 0; i < 4; i++) {
                    var fullSearch = document.getElementsByClassName("row_one")[0];
                    var child = fullSearch.childNodes[1];

                    var cloneChild = child.cloneNode(true);
                    cloneChild.id = cloneChild.id + i.toString();

                    if (i < castArray.length) {
                        cloneChild.getElementsByClassName("personimg")[0].src = "/static/img/person_placeholder.png";
                        if (castArray[i]["profile_path"] != null) {
                            cloneChild.getElementsByClassName("personimg")[0].src = "https://image.tmdb.org/t/p/w185/" + castArray[i]["profile_path"];
                        } else {
                            cloneChild.getElementsByClassName("personimg")[0].src = "/static/img/person_placeholder.png";
                        }
                        cloneChild.getElementsByClassName("actual_name")[0].innerHTML = "<b>" + castArray[i]["name"] + "</b>";
                        cloneChild.getElementsByClassName("character_name")[0].innerHTML = castArray[i]["character"];
                    } else {
                        cloneChild.innerHTML = "";
                    }


                    fullSearch.appendChild(cloneChild);
                }
                document.getElementsByClassName("row_one")[0].childNodes[1].style.display = "none";

            } else if (castArray.length == 0) {
                document.getElementsByClassName("row_one")[0].style.display = "none";
                document.getElementsByClassName("row_two")[0].style.display = "none";
            }


        }
    };
    xmlHttpSearchDetailCast.open("GET", url, true);
    xmlHttpSearchDetailCast.send();






    // review section
    // ============================================ //
    var url = "/searchdetail_reviews?id=" + resultIdArray[index] + "&type=" + resultMediaTypeArray[index];
    var xmlHttpSearchDetailReviews = new XMLHttpRequest();
    xmlHttpSearchDetailReviews.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

            var result = document.getElementsByClassName("single_review");
            for (var i = 1; i < result.length; i++) {
                result[i].innerHTML = "";
                result[i].style.display = "none";
                // console.log(result[i]);
            }
            var resultArray = JSON.parse(this.responseText)["results"];
            if (resultArray == null || resultArray.length == 0) {
                document.getElementsByClassName("reviews_container")[0].childNodes[1].style.display = "none";
                return;
            }
            var reviewArray = [];
            var count = 0;
            while (count < 5 && count < resultArray.length) {
                reviewArray.push(resultArray[count]);
                count++;
            }
            console.log("movie modal review count: " + resultArray.length);
            document.getElementsByClassName("reviws_container_outer")[0].getElementsByClassName("reviews_container")[0].childNodes[1].style.display = "block";

            for (var i = 0; i < reviewArray.length; i++) {
                var fullReview = document.getElementsByClassName("reviews_container")[0];
                // console.log(document.getElementsByClassName("reviews_container")[0]);
                var child = fullReview.childNodes[1];
                // console.log(fullReview.childNodes[1]);


                var cloneChild = child.cloneNode(true);
                cloneChild.id = cloneChild.id + i.toString();

                cloneChild.getElementsByClassName("review_author")[0].innerHTML = "<b>" + resultArray[i]["author_details"]["username"] + "</b>";

                if (resultArray[i]["created_at"] != null) {
                    var createdDate = resultArray[i]["created_at"];
                    cloneChild.getElementsByClassName("review_date")[0].innerHTML = createdDate.substr(5, 2) + "/" + createdDate.substr(8, 2) + "/" + createdDate.substr(0, 4);
                }
                var authorDetails = resultArray[i]["author_details"];
                if (authorDetails["rating"] != null) {
                    cloneChild.getElementsByClassName("reviewscore")[0].innerHTML = "&starf;" + parseFloat(authorDetails["rating"]) / 2.00 + "/5";
                }
                cloneChild.getElementsByClassName("review_content")[0].innerHTML = resultArray[i]["content"];

                fullReview.appendChild(cloneChild);
            }
            document.getElementsByClassName("reviews_container")[0].childNodes[1].style.display = "none";

        }
    };
    xmlHttpSearchDetailReviews.open("GET", url, true);
    xmlHttpSearchDetailReviews.send();

}

// works
function closeModal() {
    var mymodal = document.getElementById("movie_detail");
    document.getElementById("modal_img").src = "/static/img/movie_placeholder.jpg";
    var singlemodal = document.getElementsByClassName("modal_content");

    singlemodal[0].style.display = "none";

}
