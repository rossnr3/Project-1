/*******************************************************************************
 * Script for Project-1 Assignment - Local Muse
*******************************************************************************/

$(document).ready(function() {                  // Wait on document to load

    /***************************************************************************
     * Application Variables
    ***************************************************************************/
    // HTML Element IDs
    // If element ids change, change the const variable to update the code. No
    // literal values are contained in the code.
    const ARTIST_INPUT = "#artist-input";
    const SEARCH = "#search";                 

    const childAddEvent = "child_added";        // Firebase events

    // ************************************************************************
    // TODO - Replace the Firebase Configuration w/ one for Project-1
    // ************************************************************************
    const config = {                            // Firebase configuration
        apiKey: "AIzaSyDzpZckBMQaqDZudVSjFqYsf4DtXcM5V2I",
        authDomain: "train-scheduler-83ae9.firebaseapp.com",
        databaseURL: "https://train-scheduler-83ae9.firebaseio.com",
        projectId: "train-scheduler-83ae9",
        storageBucket: "train-scheduler-83ae9.appspot.com",
        messagingSenderId: "999079684652"
    };
    let databaseRef = null;                     // Ref to Firebase database

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

    class Reservation {                         // User reservation
        constructor(eventID, numTickets, ticketPrice) {
            this.event = eventID;               // Event
            this.tickets = numTickets;          // Tickets reserved
            this.price = ticketPrice;           // Ticket price
        }
    }

    const events = [];                          // Array of events
    class Event {                               // Event object
        constructor(artist, date, location, venue, tickets, price) {
            this.eventID = "";                  // unique event key
                                                // artist+location+venue+date??
            this.artist = artist;               // artist/band
            this.eventDate = date;              // date of event
            this.location = location;           // city, state of event
            this.venue = venue;                 // location
            this.ticketsLeft = tickets;         // remaining tickets
            this.price = price;                 // ticket price
        }
    }

    const artists = [];                         // Array of artists
    class Artist {                              // Artist object
        constructor(name, website) {
            this.artistID = "";                 // unique artist key
                                                // name+?
            this.name = name;                   // name of artist or group
            this.website = website;             // URL for website
            this.currentTrack = -1;             // Index of current track
            this.albums = [];                   // Albums
            this.tracks = [];                   // Top tracks
            this.summary = "";                  // Summary information
        }
    }

    class Album {
        constructor(title, date, image, tracks) {
            this.albumID = "";                  // unique album key
            this.title = title;                 // Album title
            this.date = date;                   // Date released
            this.coverImage = image;            // URL for cover image
            this.tracks = [];                   // Tracks
            tracks.forEach(function(track) {
                tracks.push(track);
            });
        }
    }

    class Track {
        constructor(title, date, source) {
            this.trackID = "";                  // unique track key
            this.date = date;                   // date released
            this.source = source;               // Audio URL
        }
    }

    let errors = [];                            // validation errors 

    /***************************************************************************
     * General Helper Functions
    ***************************************************************************/

    /***************************************************************************
     * Music Search Functions
    ***************************************************************************/


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
    // Search for an artist
    function searchMusic(event) {
        event.preventDefault();                 // Prevent Submit propagation

        let inputVal = $("ARTIST_INPUT").val().trim(); // Save entered data
        if (inputVal.length === 0) {
            //TODO handle no data entered error, set focus & exit
        }

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

    databaseRef.ref().on(childAddEvent, childAdded); // child added event handler 

    $(SEARCH).on("click", searchArtist);      // submit button event handler       

});