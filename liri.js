// sewing together the various parts of the app
require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var fs = require("fs")
var axios = require("axios");
var moment = require("moment");

//call for the bands in town api
var bandsInTown = function (band) {
    var queryURL = "https://rest.bandsintown.com/artists/" + band + "/events?app_id=codingbootcamp";
    console.log("in bands");
    axios.get(queryURL).then(
        function (response) {
            var res = response.data;
            for (var i = 0; i < res.length; i++) {
                var concert = res[i];
                console.log(concert.venue.name);
                console.log(concert.venue.city);
                console.log(moment(concert.datetime).format("MM/DD/YYYY"))
            }
        })
};

//call for the spotify api
var spotifyThis = function (song) {
    if (song == undefined) {
        song = "The Sign"
    }
    console.log("inside spotify");
    spotify.search(
        {
            type: "track",
            query: song
        },
        function (err, data) {
            if (err) throw err;
            var res = data.tracks.items;
            for (var i = 0; i < res.length; i++) {
                console.log("artist: " + res[i].artists);
                console.log("song: " + res[i].name);
                console.log("url: " + res[i].preview_url);
                console.log("album: " + res[i].album.name);
            }
        }
    );
};

//call for omdb api
var omdb = function (movie) {
    if (movie == undefined) {
        movie = "Mr Nobody";
    };
    var omdbQuery = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=full&tomatoes=true&apikey=trilogy";
    axios.get(omdbQuery).then(
        function (response) {
            var res = response.data;
            console.log("Title: " + res.Title);
            console.log("Year: " + res.Year);
            console.log("Rated: " + res.Rated);
            console.log("IMDB Rating: " + res.imdbRating);
            console.log("Country: " + res.Country);
            console.log("Language: " + res.Language);
            console.log("Plot: " + res.Plot);
            console.log("Actors: " + res.Actors);
            console.log("Rotten Tomatoes: " + res.Ratings[1].Value);
        }
    );
};

//function for the filesystem call
var fileSystem = function () {
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) throw err;
        console.log(data);
        var randomSong = data.split(",");
        spotifyThis(randomSong[1])
    });
};



//switch to take user input
var uCom = process.argv[2];
var uDam = process.argv[3];
switch (uCom) {
    case "concert-this":
        bandsInTown(uDam);
        break;
    case "spotify-this-song":
        spotifyThis(uDam);
        break;
    case "movie-this":
        omdb(uDam);
        break;
    case "do":
        fileSystem();
        break;
};
