
$(document).ready(function() {

    var topics = ['Anchorman', 'Dumb and Dumber', 'American Psycho', 'Bridemaids', 'Step Brothers', 'The 40 Year Old Virgin', 'Mean Girls', 'Wedding Crashers', 'Napolean Dynamite', 'Office Space', 'Ace Ventura', 'The Other Guys', 'Jumanji' ];


    function alertinput() {
        var movieType = $(this).attr('movie-type');
        console.log(movieType);
    };

    function renderButtons() {

        $('#movie-buttons').empty();

        for (var i = 0; i < topics.length; i++) {

            var newBtn = $('<button>');

            newBtn.addClass('movieButtons');

            newBtn.attr('movie-type', topics[i]);

            newBtn.text(topics[i]);

            $('#movie-buttons').append(newBtn);

            
        };

    };

    $('#add-movie').on('click', function(event){
        
        event.preventDefault();

        var movie = $('#movies-input').val().trim();

        topics.push(movie);

        renderButtons();

        //displayGIFs();
        
    });

    
    function displayGIFs() {

        $('#movies-view').empty();

        var movieType = $(this).attr('movie-type');

        var queryURL = 'https://api.giphy.com/v1/gifs/search?q=' + movieType + '&api_key=00uWRx4TnyCKCEw4R1SIxdOM0hWjiqU5&limit=20';

        $.ajax ({
            url: queryURL, 
            method: 'GET'
        }).then(function(response){
            var results = response.data;

            for (var j = 0; j < results.length; j++) {
                var gifDiv = $('<div class="item">');

                var rating = results[j].rating;

                var p = $('<p>').text('Rating: ' + rating);

                var gifAnimated = results[j].images.fixed_height.url;

                var gifStill = results[j].images.fixed_height_still.url;

                var movieImage = $('<img>');

                movieImage.attr('src', gifStill);

                movieImage.attr('img-still', gifStill);

                movieImage.attr('img-animated', gifAnimated);

                movieImage.attr('data-state', 'still');

                movieImage.addClass('Gifs');

                gifDiv.append(p);

                gifDiv.append(movieImage);

                $('#movies-view').append(gifDiv);

                $('#movies-input').empty();

            };
        });
    };

    $(document).on('click', '.movieButtons', alertinput, displayGIFs);
    renderButtons();


    $(document).on('click', '.Gifs', function(){

        var state = $(this).attr("data-state");

        if (state === "still") {
            $(this).attr("src", $(this).attr("img-animated"));
            $(this).attr("data-state", "gifAnimated");
          } else {
            $(this).attr("src", $(this).attr('img-still'));
            $(this).attr("data-state", "gifStill");
          };

        
    });
});