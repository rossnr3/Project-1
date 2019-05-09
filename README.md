# Project-1: Local Muse Application Flow

## Overview

The **Local Muse** application allows a user to discover local music 
entertainment, to discover new artists, and to purchase tickets for upcoming 
concerts.  

The user enters a location to be searched for upcoming concerts. The location
can be specified as a city, a city, state combination, or if no location is
specified, the current location of the user becomes the default location. 

## Performing Event Searches

Using only a city name may result in broader searches than desired. If the city
name is not unique, the search will retrieve upcoming concerts across all 
states that have cities by the same name. If a city, state combination is used, 
only events scheduled for that city are shown.

Events are displayed with a table in chronological order. If there are more
events to be displayed, the **More Events** button is active. If not, the 
button is disabled. The table will be completely refreshed with a new search.

## Event Display

Each event is displayed with the following information: title of the event,
the date and time of the event, the event's venue (theater or club, city, and
state), the artist or a list of the artists performing at the event, the number
of ticket listings (Note, this is not the number of tickets available, it is
the number of listings available for ticket purchase.), and the average price
of tickets previously purchased.

## Selecting An Event

Clicking on an event within the table will highlight it, and provide access to
other functions, such as displaying artist information or buying tickets. 

Clicking an another event with the table, deselects the previous selection, and
highlights the new event.

## Displaying Artist Information

When an event displayed within the table is selected, the **Search Artists** 
button is activated. By clicking on the button, a modal window is opened,
displaying summary information about the artist or group. 

There is a link to additional artist information within the modal window, such
as albums, tracks, the artist's web page, additional scheduled performances, 
etc. The user should right click on the link to open the additional information
in a new tab.

At the bottom of the artist's summary window is a likes and dislikes count by
previous visitors to the site. The user can gauge the local sentiment for the
artist from these statistics.

## Purchasing Tickets

When an event displayed within the table is selected, the **Buy Tickets** 
button is activated. By clicking on the button, another window is opened to
enable the user to purchase tickets on **Seat Geek**.

The user should be aware that events sell out quickly, and if no ticket 
listings for the event are available, the event is indicated as **Sold Out**.
The more ticket listings shown, the higher the probability of finding a
ticket to purchase at a price closer to the average price. The fewer the
ticket listings, the higher the probability of not being able to find a ticket,
or finding only tickets at much higher prices.

### Link to the deployed game

[GitHub](https://rossnr3.github.io/Project-1/ "Local Muse")

