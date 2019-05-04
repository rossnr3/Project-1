/*******************************************************************************
 * Local Muse Application
 * Script for Project-1 Assignment
*******************************************************************************/

$(document).ready(function() {                  // Wait on document to load

    /************************************************************************
     * Application Global Variables
    ************************************************************************/
    
    //
    // HTML Element IDs
    //
    const LOCATION_INPUT = "#location-input";   // text input field
    const EVENT_BTN = "#event-button";          // Event search button clicked    
    const EVENT_TABLE = "#event-table";         // Event display table   
    const MORE_BTN = "#more-events-button";     // Display more events   
    const SEARCH_ARTIST = "#search-artist";     // Search for an artist
    const BUY_TICKETS = "#buy-tickets";         // Buy tickets       

    //
    // SeatGeek Variables
    //
    const DEFAULT_LOCATION = "Denver";          // SeatGeek location default
    const DEFAULT_PRICE = "Sold Out";           // SeatGeek default price
    const eventsURL = "https://api.seatgeek.com/2/events?";
    const cityOption = "venue.city=";
    const stateOption = "&venue.state=";
    const concertOption = "&type=concert";
    const apiID = "&client_id=MTYzODc2MTJ8MTU1NjI0NTEzOC44NA";
    let queryLocation = "";
    let queryPage = 0;

    //
    // Internal Venue Object
    //
    class Venue {
        constructor(id, location, theater) {
            this.venueID = id;
            this.location = location;
            this.theater = theater;
        }
    }

    //
    // Internal Artist Object
    //
    class Artist {                              // Artist object
        constructor(id, name, image) {
            this.artistID = id;                 // unique artist key
            this.name = name;                   // name of artist or group
            this.image = image;                 // URL for image
        }
    }

    //
    // Internal Event Object
    //
    const events = [];                          // Array of events
    let eventsIndex = -1;                       // Current index clicked
    let eventPages = 0;                         // Number of events avail
    let lastRow = undefined;                    // Last event row clicked
    let currentRow = undefined;                 // Current row clicked
    let previousBackground = undefined;         // Row's prior background color
    class Event {                               // Event object
        constructor(id, title, localDate, venue, price, tickets, url,
            artistArr=[]) {
            this.eventID = id;                  // unique event key                                                
            this.title = title;                 // concert title
            this.artists = artistArr;           // Performers
            this.eventDate = localDate;         // date of event
            this.venue = venue;                 // location
            this.price = price;                 // average price
            this.tickets = tickets;             // ticket listings
            this.ticketURL = url;
        }
        toString() {                            // Debuggging method
            let result = "Event Object:";
            result += `\n\tID: ${this.eventID} Title: ${this.title}`;
            result += "\n\tArtists:";
            this.artists.forEach(function(artist) {
                result += "\n\t\t" + artist.name;
            });
            result += `\n\tVenue: ${this.venue.theater}`;
            result += `\n\tDate: ${this.eventDate}`;
            result += `\n\tTicket Listings: ${this.tickets}`;
            result += `\n\tAverage Price: ${this.price}`;
            result += `\n\tTicket URL: ${this.ticketURL}`;
            return result;
        }
        print() {                               // Debugging method
            console.log(this.toString());
        }
    }

    /***************************************************************************
     * Helper Functions
    ***************************************************************************/
    // Process user location entry.
    // The location for a search may be entered as 'city' or as 'city, ST'.
    // Invalid formats will be discarded, and the default location used.
    //      inputVal: string, value entered by user
    //      return: string, 'city=...' or 'city=...state=...'
    function processLocation(inputVal) {
        let tempArray = inputVal.trim().split(",");     // Split location

        // Return default for blank input
        if (tempArray.length === 1 && tempArray[0].length === 0) {  
            return cityOption + DEFAULT_LOCATION;
        }

        for (let i = 0; i < tempArray.length; i++) {    // ...remove whitespace
            tempArray[i] = tempArray[i].trim();
        }

        let result = "";
        switch (tempArray.length) {
            case 1:                                     // Only city entered
                result = cityOption + tempArray[0];
            break;
            case 2:                                     // city, state entered
                result = cityOption + tempArray[0];
                if (tempArray[1].length === 2) {
                    result += stateOption + tempArray[1];
                }
            break;
            default:                                    // use default location
                result = cityOption + DEFAULT_LOCATION;
            break;
        }
        return result;                                  // location options
    }
    
    // Validate and format the average ticket price and the ticket listings
    // The object argument is modified with the result.
    function validatePrice(fmtObject) {
        if (!fmtObject.price || !fmtObject.tickets) {
            fmtObject.price = DEFAULT_PRICE;
            fmtObject.tickets = 0;
        } else {
            fmtObject.price = fmtObject.price.toLocaleString(undefined,
                {style: "currency", currency: "USD"});
            fmtObject.tickets = fmtObject.tickets.toString();
        }
    }

    /***************************************************************************
     * Handle Event Functions
    ***************************************************************************/

    // Append event table data to the table row element
    function appendData(tableRow, tableData) {
        let td = $("<td>");
        td.text(tableData);
        tableRow.append(td);
    }

    // Render the Event objects as HTML table rows
    function renderEvents() {
        eventsIndex = -1;                       // Initialize index
        $(SEARCH_ARTIST).prop("disabled", true); // Disable buttons
        $(BUY_TICKETS).prop("disabled", true);

        $(EVENT_TABLE).empty();                 // Clear table entries
        let eventTable = $(EVENT_TABLE);        // Ref to table
        events.forEach(function(event) {        // Loop thru event array
            let tr = $("<tr>");                 // Create tr element

            let td = $("<td>");                 // Create td element
            td.text(event.title);               // Add event title
            tr.append(td);                      // Add td to tr

            appendData(tr, event.eventDate);    // Add date and time
            appendData(tr, event.venue.theater  // Add theater & city, st
                + ", " + event.venue.location);

            let eventArtists = "";              // Add artists array
            event.artists.forEach(function(artist) {
                eventArtists += artist.name + " + ";
            });
            if (eventArtists.length > 2) {      // remove last ' + '
                eventArtists = eventArtists.substr(0, eventArtists.length - 3);
            }
            appendData(tr, eventArtists);       // add artist

            appendData(tr,                      // ticket listings & price
                `${event.tickets} / ${event.price}`);
            eventTable.append(tr);              // Add row to table
        });
    }

    // Extract the SeatGeek data & create an array of Event objects
    // Loop thru SeatGeek events object, creating Event objects. Only use 
    // 'concert' events. Create a Venue object and Artist objects.
    //      eventARR: array, SeatGeek events result
    function getEvents(eventArr=[]) {
        events.length = 0;                      // Empty existing array
        // Loop thru SeatGeek Event objects
        eventArr.forEach(function(sgEvent) {    // Loop thru seatgeek events
            if (sgEvent.type === "concert") {   // Concert?
                                                // Yes - Create Venue object
                let venueObj = new Venue(sgEvent.venue.id, 
                    sgEvent.venue.display_location, sgEvent.venue.name);
                                                
                let artists = [];               // Create array Artist objects
                sgEvent.performers.forEach(function(sgPerformer) {
                    let artistObj = new Artist(sgPerformer.id, 
                        sgPerformer.name, sgPerformer.image);
                    artists.push(artistObj);
                });
                                                
                let fmtPriceTickets = {         // Format price / tickets listings
                    price: sgEvent.stats.average_price,
                    tickets: sgEvent.stats.listing_count
                };
                validatePrice(fmtPriceTickets);
                                                // Create Event object, add to array
                let concert = new Event(sgEvent.id, sgEvent.title, moment(
                    sgEvent.datetime_local).format("dddd, MMMM Do YYYY, h:mm:ss a"),
                    venueObj, fmtPriceTickets.price, fmtPriceTickets.tickets,
                    sgEvent.url, artists);
                events.push(concert);
            }
        });
    }

    /***************************************************************************
     * UI Event Handlers
    ***************************************************************************/

    // Table Row Clicked Event Handler
    $(document).on("click", "tr", function() {
        // Update table row highlighting
        if (typeof currentRow === "undefined") {
            currentRow = $(this);
            previousBackground = currentRow.css("background-color");
        } else {
            currentRow.css("background-color", previousBackground);
            currentRow = $(this);
        }
        currentRow.css("background-color", "darkgrey");

        let idx = this.rowIndex;                        // Get table row clicked
        if (idx >= 1) {
            eventsIndex = idx - 1;              // Set index relative to 1st row
            $(SEARCH_ARTIST).prop("disabled", false);    // Enable buttons
            $(BUY_TICKETS).prop("disabled", false);
            }
    });

    // Buy tickets
    // Use event object ticketURL to link to SeatGeek
    function buyTickets() {
        let event = events[eventsIndex];
        window.open(event.ticketURL, '_blank');
    }

    // Event Button has been clicked, or ENTER used.
    // Search for events by location. Location can be City or City, ST or blank.
    function searchEvents(event) {
        event.preventDefault();                 // Prevent Submit propagation

        // Extract query location and build URL
        queryLocation = processLocation($(LOCATION_INPUT).val());
        let queryURL = eventsURL + queryLocation + concertOption + apiID;

        // NOTE: This code is kept inline to avoid timing issues.
        let xhr = new XMLHttpRequest();         // Set up HTTP request
        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) { // Request Succeeded?
                                                         // ...Yes
                let sgEvents = JSON.parse(xhr.response); // SeatGeek events
                
                let totalPg = sgEvents.meta.total;      // total pages
                let pgPerQry = sgEvents.meta.per_page; // pages/query
                eventPages = (totalPg % pgPerQry === 0) ? // Pages to display
                    totalPg / pgPerQry : Math.floor(totalPg / pgPerQry) + 1;
                queryPage = sgEvents.meta.page;         // Save current page

                getEvents(sgEvents.events);             // Extract event objects
                renderEvents();                         // Display upcoming events
                if (queryPage >= eventPages) {          // Enable/disable MORE
                    $(MORE_BTN).prop("disabled", true);
                } else {
                    $(MORE_BTN).prop("disabled", false);
                }
            } else {                                    // Request Failed
                console.log("Request Failed!");
            }
            $(LOCATION_INPUT).val("");                  // Clear input field
        };
        // Generate request
        xhr.open("GET", queryURL);
        xhr.send();
    }

    // Get Artist from selected row and query API for artist details 
    function searchArtist (event) {
        event.preventDefault();
        // Extract artist name
        let searchArtist = events[eventsIndex].artists[0].name
        // Build query URL
        let queryArtistURL = 
            "https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist="
            + searchArtist 
            + "&api_key=568f44e6089a6a0cf9def6d576559c73&format=json";
        // Query LastFM for artist
        $.ajax({
            url: queryArtistURL,
            method: "POST"
            }).then(function(response) {
                if (response.error!=6) {
                $('#band-name').css('textTransform', 'capitalize');
                $("#band-name").text(response.artist.name);  
                $("#band-summary").html(response.artist.bio.summary);  
                } else {
                    console.log("The artist could not be found.");
                    $("#band-name").text("The artist could not be found.");
                }
            });
        }

    // More Button has been clicked
    // Display the next page of events for the current location
    function moreEvents(event) {
        queryPage++;                                    // Create next page option
        let pageNo = "&page=" + queryPage;
        let queryURL = eventsURL + queryLocation + concertOption + pageNo + apiID;

        // NOTE: This code is kept inline to avoid timing issues.
        let xhr = new XMLHttpRequest();
        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) { // Request Succeeded?
                                                         //...Yes
                let sgEvents = JSON.parse(xhr.response); // SeatGeek events

                queryPage = sgEvents.meta.page;          // Save current page

                getEvents(sgEvents.events);              // Extract event objects
                renderEvents();                          // Display upcoming events

                if (queryPage >= eventPages) {          // Enable/disable MORE
                    $(MORE_BTN).prop("disabled", true);
                } else {
                    $(MORE_BTN).prop("disabled", false);
                }
            } else {
                console.log("Request Failed!");
            }
            // Code here runs either way
        };
        // Generate request
        xhr.open("GET", queryURL);
        xhr.send();
    }

    /***************************************************************************
     * Firebase Interface
    ***************************************************************************/
   
    var config = {
        apiKey: "AIzaSyBj6ftpfNhikXm0QJLs8fmHKeerGLuRp3E",
        authDomain: "project01-artistlove.firebaseapp.com",
        databaseURL: "https://project01-artistlove.firebaseio.com",
        projectId: "project01-artistlove",
        storageBucket: "project01-artistlove.appspot.com",
        messagingSenderId: "338853202244"
    };
   
    firebase.initializeApp(config);             // Initialize firebase &
    database = firebase.database();             // ...save ref to database

    let loveCounter = 0;                        // Initialize counters
    let hateCounter = 0;

    database.ref().on("value", function(snapshot) {
        // Update the clickCounter variable with data from the database.
        hateCounter = snapshot.val().hateCount.hateCount;
        loveCounter = snapshot.val().loveCount.loveCount;
        // Then we change the html associated with the number.
        $("#hate-button").text(snapshot.val().hateCount.hateCount);
        $("#love-button").text(snapshot.val().loveCount.loveCount);
    });

    $("#love-button").on("click", function(event) {
        event.preventDefault();
        loveCounter++;
        database.ref('loveCount').set({
            loveCount: loveCounter
        });  
    });
    
    $("#hate-button").on("click", function(event) {
        event.preventDefault();
        hateCounter++;
        database.ref("hateCount").set({
            hateCount: hateCounter
        });          
    });
    
    /***************************************************************************
     * Set Event Handlers - Initialize Buttons
    ***************************************************************************/
    $(EVENT_BTN).on("click", searchEvents);     // submit button event handler  
    $(SEARCH_ARTIST).prop("disabled", true);    // Disable Search Artist button
    $(SEARCH_ARTIST).on("click", searchArtist); // search artist button event handler
    $(MORE_BTN).prop("disabled", true);         // Disable More button
    $(MORE_BTN).on("click", moreEvents);        // next page button event handler  
    $(BUY_TICKETS).prop("disabled", true);      // Disable Buy Tickets button
    $(BUY_TICKETS).on("click", buyTickets);     // Buy tickets clicked 

//pushing NEW
});