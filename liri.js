const request = require("request");
const Spotify = require("node-spotify-api");
const moment = require("moment");
const fs = require("fs");

require("dotenv").config();
const spotifyKeys = require("./keys.js");
const spotify = new Spotify(spotifyKeys.spotify);

const command = process.argv[2];
const searchQuery = process.argv.slice(3).join(' ');

const append_log_txt = txt => {
    fs.appendFile('log.txt', txt, function(err){
        if(err){
            console.log(err);
            return false;
        }
    });
}
const concert_this = searchQuery => {//rest.bandsintown api
    // Name of the venue
    // Venue location
    // Date of the Event (use moment to format this as "MM/DD/YYYY")
    if(!searchQuery){return console.log("Please enter <artist/band name>");}
    console.log(`
    concert-this ${searchQuery}
    =========================================================`);
    
    //WRITE LOG
    append_log_txt('concert-this ' + searchQuery + '\n=========================================================\n');
    
    var queryUrl = "https://rest.bandsintown.com/artists/" + searchQuery + "/events?app_id=codingbootcamp";
    request(queryUrl, function(err, response, body) {
        if (err) {return console.log(err);}
        if (!err && response.statusCode === 200) {
            body = JSON.parse(body);
            //console.log(body);
            body.forEach(item => {
                console.log(`
                Name: ${item.venue.name}
                Location: ${item.venue.city}, ${item.venue.region}, ${item.venue.country}
                Date: ${moment(item.datetime).format('MM/DD/YYYY')}
                `);

                //WRITE LOG
                let log_txt = 'Name: ' + item.venue.name + '\n';
                log_txt += 'Location: ' + item.venue.city + ', ' + item.venue.region + ', ' + item.venue.country + '\n';
                log_txt += 'Date: ' + moment(item.datetime).format('MM/DD/YYYY') + '\n\n';
                append_log_txt(log_txt);
            })
        }
    });
}
const spotify_this_song = searchQuery => {
    // Artist
    // The song's name
    // A preview link of the song from Spotify
    // The album that the song is from
    if(!searchQuery){return console.log("Please enter <song name>");}
    console.log(`
    spotify-this-song ${searchQuery}
    =========================================================`);
    
    //WRITE LOG
    append_log_txt('spotify-this-song ' + searchQuery + '\n=========================================================\n');
    
    spotify
    .search({ type: 'track', query: searchQuery })
    .then(function(response) {
        response.tracks.items.forEach(item => {
            //console.log(item);
            console.log(`
            Artist: ${item.artists[0].name}
            Song Name: ${item.name}
            Preview Link: ${item.preview_url}
            Album Name: ${item.album.name}
            `);

            //WRITE LOG
            let log_txt = 'Artist: ' + item.artists[0].name + '\n';
            log_txt += 'Song Name: ' + item.name + '\n';
            log_txt += 'Preview Link: ' + item.preview_url + '\n';
            log_txt += 'Album Name: ' + item.album.name + '\n\n';
            append_log_txt(log_txt);
        });
    })
    .catch(function(err) {
        console.log(err);
    });
}
const movie_this = searchQuery => {
    //   * Title of the movie.
    //   * Year the movie came out.
    //   * IMDB Rating of the movie.
    //   * Rotten Tomatoes Rating of the movie.
    //   * Country where the movie was produced.
    //   * Language of the movie.
    //   * Plot of the movie.
    //   * Actors in the movie.
    //   * Default: Mr. Nobody.
    if(!searchQuery){searchQuery = "Mr. Nobody";}
    console.log(`
    movie-this ${searchQuery}
    =========================================================`);
   
    //WRITE LOG
    append_log_txt('movie-this ' + searchQuery + '\n=========================================================\n');
    
    var queryUrl = "http://www.omdbapi.com/?t=" + searchQuery + "&y=&plot=short&apikey=trilogy";
    request(queryUrl, function(err, response, body) {
        if (err) {return console.log(err);}
        if (!err && response.statusCode === 200) {
            item = JSON.parse(body);
            //console.log(body);
            console.log(`
            Title: ${item.Title}
            Year: ${item.Year}
            IMDB Rating: ${item.imdbRating}
            Rotten Tomatoes Rating: ${item.tomatoRating}
            Country: ${item.Country}
            Language: ${item.Language}
            Plot: ${item.Plot}
            Actors: ${item.Actors}
            `);

            //WRITE LOG
            let log_txt = 'Title: ' + item.Title + '\n';
            log_txt += 'Year: ' + item.Year + '\n';
            log_txt += 'IMDB Rating: ' + item.imdbRating + '\n';
            log_txt += 'Rotten Tomatoes Rating: ' + item.tomatoRating + '\n';
            log_txt += 'Country: ' + item.Country + '\n';
            log_txt += 'Language: ' + item.Language + '\n';
            log_txt += 'plot: ' + item.Plot + '\n';
            log_txt += 'Preview Link: ' + item.Actors + '\n\n';
            append_log_txt(log_txt);
        }
    });
}
const do_what_it_says = () => {
    console.log(`
    do-what-it-says
    =========================================================`);
    
    //WRITE LOG
    append_log_txt('do-what-it-says => ');
    
    fs.readFile('random.txt', 'utf8', function(err, data){
        if (err) {return console.log(err);}
        var dataArr = data.split(",");
        if(dataArr[0] === "concer-this"){
            concert_this(dataArr[1]);
        }else if(dataArr[0] === "spotify-this-song"){
            spotify_this_song(dataArr[1]);
        }else if(dataArra[0] === "movie-this"){
            movie_this(dataArr[1]);
        }else{

        }
    })
}

switch( command ){
    case "concert-this":
        concert_this(searchQuery);
    break;

    case "spotify-this-song":
        spotify_this_song(searchQuery);
    break;

    case "movie-this":
        movie_this(searchQuery);
    break;

    case "do-what-it-says":
        do_what_it_says();
    break;

    default:
        console.log("You can use four commands : concert-this, spotify-this-song, movie-this, do-what-it-says.");
    break;
}


