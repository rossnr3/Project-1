/*******************************************************************************
 * Script for Project-1 Assignment - Local Muse
*******************************************************************************/

$(document).ready(function() {                  // Wait on document to load

    // /***************************************************************************
    //  * Application Global Variables
    // ***************************************************************************/
    
    // HTML Variables
    const LOCATION_INPUT = "#location-input";   // Location input field
    const EVENT_BTN = "#event-button";          // Event search button clicked    
    const EVENT_TABLE = "tbody";                // Event display table             

    // Firebase Variables
    const CHILD_ADDED = "child_added";          // Firebase events

    const config = {                            // Firebase configuration
        apiKey: "AIzaSyAmDwJPp9snbM6xBXdXBbTNUVoJNAP3bsI",
        authDomain: "local-muse.firebaseapp.com",
        databaseURL: "https://local-muse.firebaseio.com",
        projectId: "local-muse",
        storageBucket: "local-muse.appspot.com",
        messagingSenderId: "252827947960"
    };
    let databaseRef = null;                     // Ref to Firebase database

    // SeatGeek Variables
    const DEFAULT_LOCATION = "Denver";          // SeatGeek location default
    const DEFAULT_PRICE = 45;                   // SeatGeek default price
    let location = DEFAULT_LOCATION;            // SeatGeek search location
    let queryURL = "https://api.seatgeek.com/2/events?venue.city=" // URL
                   + location
                   + "&type=concert"
                   + "&client_id=MTYzODc2MTJ8MTU1NjI0NTEzOC44NA";

    class User {                                // Subscribed user object
        constructor(name, email, password, card) {
            // unique key of email + password
            this.userID = email.toLowerCase() + password.toLowerCase();                     
            this.name = name;                   // User's name
            this.email = email;
            this.password = password;           // User's password
            this.creditCard = card;             // Credit card number
            this.reservations = [];             // Current reservations
        }
    }

    class Venue {
        constructor(id, location, theater) {
            this.venueID = id;
            this.location = location;
            this.theater = theater;
        }
    }

    class Artist {                              // Artist object
        constructor(id, name, image) {
            this.artistID = id;                 // unique artist key
            this.name = name;                   // name of artist or group
            this.image = image;                 // URL for image
        }
    }

    const events = [];                          // Array of events
    class Event {                               // Event object
        constructor(id, title, localDate, venue, price, artistArr=[]) {
            this.eventID = id;                  // unique event key                                                
            this.title = title;                 // concert title
            this.artists = artistArr;           // Performers
            this.eventDate = localDate;              // date of event
            this.venue = venue;                 // location
            if (price) {                        // Ticket price
                this.price = price;
            } else {
                this.price = DEFAULT_PRICE;
            }
        }
    }

    let errors = [];                            // validation errors 

    /***************************************************************************
     * General Helper Functions
    ***************************************************************************/

    /***************************************************************************
     * Event Functions
    ***************************************************************************/

    // Append event data to the table row element
    function appendData(tableRow, tableData) {
        let td = $("<td>");
        td.text(tableData);
        tableRow.append(td);
    }
    // Render the Event objects as HTML table rows
    function renderEvents() {
        $(EVENT_TABLE).empty();                 // Clear table entries
        let tbody = $(EVENT_TABLE);
        events.forEach(function(eventObj) {     // Loop thru event array
            let tr = $("<tr>");
            appendData(tr, eventObj.title);
            appendData(tr, eventObj.eventDate);
            appendData(tr, eventObj.venue.theater + "; " 
                + eventObj.venue.location);
            let eventArtists = "";
            eventObj.artists.forEach(function(artist) {
                eventArtists += artist.name + "; ";
            });
            if (eventArtists.length > 2) {
                eventArtists = eventArtists.substr(0, eventArtists.length - 2);
            }
            appendData(tr, eventArtists);
            tbody.append(tr);            
        });
    }

    // Extract the SeatGeek data and create Event objects, adding them to
    // an array.
    function getEvents(eventArr=[]) {
        events.length = 0;
        for (let i=0; i < eventArr.length; i++) {
            if (eventArr[i].type === "concert") {
                let venueObj = new Venue(eventArr[i].venue.id, 
                    eventArr[i].venue.display_location, eventArr[i].venue.name);
                let artists = [];
                eventArr[i].performers.forEach(function(performerObj) {
                    let artistObj = new Artist(performerObj.id, 
                        performerObj.name, performerObj.image);
                    artists.push(artistObj);
                });
                let concert = new Event(eventArr[i].id, eventArr[i].title,
                    eventArr[i].datetime_local, venueObj, 
                    eventArr[i].stats.average_price, artists);
                events.push(concert);
            }
        }
    }

    // Get Artist from selected row and query API for artist details - jimmyg
    $(document).on("click", ".event-row", function() {  //click on row;  ***need rows to have a class; can be defined when row is created
        let searchArtist = $(this).attr(artist.name);
        let queryArtistURL = "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist="  // query URL for last.fm
                            + searchArtist 
                            + "&api_key=568f44e6089a6a0cf9def6d576559c73&format=json";
        
        $("#displayed-artist").remove(); // removes any previous artist displayed  ***need id defined for artist display div

        $.ajax({
            url: queryArtistURL,
            method: "POST"
            }).then(function(response) {
                console.log("your query string: " + queryArtistURL);  //console logs to verify calls and return
                console.log(response);
                console.log(response.artist.name);
                console.log(response.artist.url);
                console.log(response.artist.image[2]["#text"]);
                console.log(response.artist.bio.summary);

                if (response.error!=6) {
                $('#band-name').css('textTransform', 'capitalize');
                $("#band-name").text(response.artist.name);  
                $("#band-url").attr("href", response.artist.url);  // ***requires <p><a href=" " id="band-url">Band URL</a></p>
                $("#band-image").attr("src", response.artist.image[2]["#text"]);  // ***requires <img id="band-image"></img>
                $("#band-summary").html(response.artist.bio.summary);  
                } else {
                    console.log("The artist could not be found.");
                    $("#band-name").text("The artist could not be found.");
                }
            });
    });


    /***************************************************************************
     * Timing/Date Functions
    ***************************************************************************/

    /***************************************************************************
     * Firebase Event Handlers
    ***************************************************************************/
    // Child Added Event Handler
    // Called once for each child on initial load of data, and each time a new
    // child is added.
    function childAdded(snapshot) {

    }

    /***************************************************************************
     * UI Event Handlers
    ***************************************************************************/
    // Search for events
    function searchEvents(event) {
        event.preventDefault();                 // Prevent Submit propagation

        let inputVal = $(LOCATION_INPUT).val().trim(); // Save entered data
        if (inputVal.length === 0) {            // If no location entered, use
            location = DEFAULT_LOCATION;        // ...default location
        } else {
            location = inputVal;
        }

        let xhr = new XMLHttpRequest();         // Set up HTTP request
        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {
                let jsonObj = JSON.parse(xhr.response);
                getEvents(jsonObj.events);
                renderEvents();
            } else {
                console.log("Request Failed!");
            }
            // Code here runs either way
        };

        xhr.open("GET", queryURL);
        xhr.send();

        // TODO search for artist
        // TODO Not Found
            // TODO Notify user
            // TODO focus on input field
            // TODO exit
        // TODO Found
            // TODO clear input field
            // TODO Create Artist object
            // TODO In artists array?
                // TODO No - Add to artists array
            // TODO Link to Artist page & create content from array
            // TODO exit
    }

    /***************************************************************************
     * Application Entry Point - Begin Application Logic
    ***************************************************************************/
    firebase.initializeApp(config);             // Initialize firebase &
    databaseRef = firebase.database();          // ...save ref to database

    databaseRef.ref().on(CHILD_ADDED, childAdded); // child added event handler 

    $(EVENT_BTN).on("click", searchEvents);     // submit button event handler       

});