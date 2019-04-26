# Project-1: Local Muse Application Flow

## Overview

This application allows a user to use a location and date range to discover 
local music entertainment, and reserve a seat for a future show. The site 
should be a subscription site. It requires a user name and password, as well
as other identifying information if reservations are to be made. Anyone can
browse the site to discover local events. 

## Second Thought's

I think we should probably start simple, get it running, and then add features
that we can't live without.

## On application open

The web page should be fully operational, displaying events, looking up music, 
etc. with the exception of reserving seats which will require a user 
account. 

So anyone opening the web page can use location below to check out the events. 
**However, seat reservations cannot be made by someone just browsing.**

## Webpage Layout (conceptual)

### Header Content (See Stubhub as a good example)

####Logo

Logo - to be decided. It's just decoration. Should house a link to the home
page from other pages.

#### Search Artist/Band

Input field to search for artist with a submit button, so a click or Enter will
trigger the search. Once running, maybe we add search for an event, and/or 
a venue.

#### My Reservations

Link **My Reservations** - Disable until sign-in. After sign-in, link will be
active if any reservations exist, and display existing reservations in a modal 
window if clicked.

#### Sign In

Link **Sign In** - Clicking on the link will display a modal window to allow
sign-in with email and password. If not a subscriber, the sign-in modal window
will contain a form to enter user information along with a link to **Create 
Account**.

#### Location

Drop input field **Location**. Initial display will display the city/state 
determined by a Google API, i.e. Denver, CO. When clicked the drop down will
allow entry of a new city/state. 

Once running, maybe we add a "your location" choice that will use Google Maps 
to obtain the current location of the user.

#### Time Frame

After doing some research, using a calendar to pick dates can be done in 
Javascript, but it can become complex, and consume a lot of development time.

I suggest we use the current month plus the following month or a 60 to 90 day 
window from the current date as default searches. 

Once running, we might add entered from and to dates. If we get that running, 
then we might try to generate a calendar for selection.

### Home Page Content

#### Initial Content

On initial page load, the default location is the only criteria for a search
of events, and should display individual images of upcoming events with the 
artist's name as a subtitle (see StubHub's initial page). The initial events 
displayed should just be all upcoming events with no other criteria than 
location. The initial events should also be limited by a specified number of 
events (i.e. 10 - 15).

Similar to StubHub, we should add a more button to display more events. The 
prior events could be displayed by using the back button, or providing a back
link.

Each event displayed should be contain a link that will return more detail if 
clicked (See artist's page).

#### Clicking on an Event or Entering an Artist to Search

Either should result in opening a new **Artist** page.

### Artist Page (New Window or New Tab?)

#### Header

Same as original page

#### Section at the top for event(s) information

If an event was clicked, then only that event will be displayed. If a search by
artist was used, then multiple events will be displayed, limited by city, time,
and a specified limit. If there are too many events to display, we might add
a more button.

Contents of an individual event is to be determined, but should include:
    Artist or group
    Venue for the event
    Number of tickets left
    Cost of a ticket
The individual event should consume one row.

#### Section below for Display of Artist or Group

The contents for an artist or group is to be determined, but should
include:
    Artist or Group image
    Top albums
    Top tracks
    brief summary or history of artist or group if available
    Streaming audio of one of the top tracks
    Possibly youtube video
    Link to artist/group web site if available

The addition of Youtube, and even the streaming audio can be added
incrementally based on our progress and time remaining.

Audio controls should be displayed for track or album playing to pause,
play, stop, maybe volume control.

After the artist page is running, we might add links for each track and/or 
album which will play that track or begin playing tracks on a selected album.

## Seat Reservations

We can either do a bogus purchase of tickets, or do seat reservations. Either
approach seems about the same level of complexity.

Ability to do either is dependent on the user having an account and signing
in or having created an account. The reservations are only available from an 
event link on the Artist Page.

Thoughts on seat reservation:
    Use firebase, so multiple users can reserve seats concurrently, and 
    remaining tickets are decremented.

    NOTE: THIS WILL NOT DECREMENT THE NUMBER OF TICKETS OBTAINED THROUGH
    THE EVENT SOURCE, SO AN EVENT/REMAINING TICKETS VARIABLE WILL HAVE TO
    BE KEPT ON FIREBASE AT LEAST THROUGH A SESSION IF NOT LONGER.

    Seats can be reserved/purchased as long as there are tickets available,
    and the event isn't history. 
    
    Conflicts should be avoided with multiple events for the same user.

When a **Make Reservation** is clicked, the gathering of data, establishing
the reservation, etc. will be done in a modal window.

## Create User Account

No information will be verified, so John Doe can create a single account with
unverified address, credit card, etc.

Information will be collected in a modal window. After creating an account,
and signing in, information about upcoming reservations, etc. will be kept in 
a data base.
# Project-1