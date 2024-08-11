// Wrap all code in an Immediately Invoked Function Expression (IIFE)
(function($) { // Pass jQuery as a parameter to ensure $ refers to jQuery
    // Wait for the DOM to be fully loaded before running our code
    $(document).ready(function() {
      // Store API URL
      var apiBaseUrl = 'https://api.tvmaze.com';
  
      // Function to load all shows
      function loadAllShows() {
        $.ajax({
          url: apiBaseUrl + '/shows',
          method: 'GET',
          success: function(shows) {
            displayShows(shows);
          },
          error: function(xhr, status, error) {
            console.error('Error loading shows:', error);
            $('#showList').html('<li>Error loading shows. Please try again later.</li>');
          }
        });
      }
  
      // Function to display shows in the list
      function displayShows(shows) {
        var showList = $('#showList');
        showList.empty();
  
        shows.forEach(function(show) {
          var listItem = $('<li>');
          var link = $('<a>')
            .attr('href', '#')
            .text(show.name)
            .click(function(e) {
              e.preventDefault();
              loadShowDetails(show.id);
            });
  
          listItem.append(link);
          showList.append(listItem);
        });
  
        showList.show();
        $('#show').hide();
        $('#homeLink').show();
      }
  
      // Function to load show details
      function loadShowDetails(showId) {
        $.ajax({
          url: apiBaseUrl + '/shows/' + showId,
          method: 'GET',
          success: function(show) {
            displayShowDetails(show);
          },
          error: function(xhr, status, error) {
            console.error('Error loading show details:', error);
            $('#show').html('<p>Error loading show details. Please try again later.</p>');
          }
        });
      }
  
      // Function to display show details
      function displayShowDetails(show) {
        var showDiv = $('#show');
        showDiv.empty();
  
        var title = $('<h1>').text(show.name);
        var image = $('<img>')
          .attr('src', show.image ? show.image.medium : '/images/no_image.png')
          .attr('alt', show.name);
        
        var detailsList = $('<dl>');
        
        addDetailItem(detailsList, 'Language', show.language);
        addDetailItem(detailsList, 'Genres', show.genres.join(', ') || 'N/A');
        addDetailItem(detailsList, 'Average Rating', show.rating.average || 'N/A');
        addDetailItem(detailsList, 'Network', show.network ? show.network.name : 'N/A');
        addDetailItem(detailsList, 'Summary', $('<div>').html(show.summary).text() || 'N/A');
  
        showDiv.append(title, image, detailsList);
        $('#showList').hide();
        showDiv.show();
      }
  
      // Helper function to add detail items
      function addDetailItem(list, term, definition) {
        list.append($('<dt>').text(term), $('<dd>').text(definition));
      }
  
      // Function to handle search
      function handleSearch(searchTerm) {
        $.ajax({
          url: apiBaseUrl + '/search/shows?q=' + searchTerm,
          method: 'GET',
          success: function(results) {
            var shows = results.map(function(result) {
              return result.show;
            });
            displayShows(shows);
          },
          error: function(xhr, status, error) {
            console.error('Error performing search:', error);
            $('#showList').html('<li>Error performing search. Please try again later.</li>');
          }
        });
      }
  
      // Event listener for search form submission
      $('#searchForm').submit(function(e) {
        e.preventDefault();
        var searchTerm = $('#search_term').val().trim();
        if (searchTerm) {
          handleSearch(searchTerm);
        } else {
          alert('Please enter a search term');
        }
      });
  
      // Event listener for home link
      $('#homeLink').click(function(e) {
        e.preventDefault();
        $('#search_term').val('');
        loadAllShows();
      });
  
      // Load all shows when the page first loads
      loadAllShows();
    });
  })(window.jQuery); // Pass jQuery to the IIFE
/* 
All of the functionality will be done in this client-side JS file.  
You will make client - side AJAX requests to the API and use jQuery to target and create elements on the page.
*/
/*
$(document).ready(function () {
    // Load all shows on page load
    $.ajax({
      url: 'http://api.tvmaze.com/shows',
      method: 'GET',
      success: function (data) {
        let showList = $('#showList');
        data.forEach(show => {
          let listItem = $('<li>');
          let link = $('<a>')
            .attr('href', show._links.self.href)
            .text(show.name)
            .on('click', function (event) {
              event.preventDefault();
              loadShowDetails(show.id);
            });
          listItem.append(link);
          showList.append(listItem);
        });
        showList.show();
      },
      error: function (xhr, status, error) {
          console.error('Error fetching shows:', error);
          $('#showList').html('<li>Error loading shows. Please try again later.</li>').show();
        }
    });
  
    // Form submission for search
    $('#searchForm').on('submit', function (event) {
      event.preventDefault();
      let searchTerm = $('#search_term').val().trim();
      if (!searchTerm) {
        alert('Please enter a search term');
        return;
      }
  
      $('#showList').empty();
      $('#show').hide();
  
      $.ajax({
        url: `http://api.tvmaze.com/search/shows?q=${searchTerm}`,
        method: 'GET',
        success: function (data) {
          let showList = $('#showList');
          data.forEach(result => {
            let show = result.show;
            let listItem = $('<li>');
            let link = $('<a>')
              .attr('href', show._links.self.href)
              .text(show.name)
              .on('click', function (event) {
                event.preventDefault();
                loadShowDetails(show.id);
              });
            listItem.append(link);
            showList.append(listItem);
          });
          $('#homeLink').show();
          showList.show();
        },
        error: function (xhr, status, error) {
            console.error('Error fetching shows:', error);
            $('#showList').html('<li>Error loading shows. Please try again later.</li>').show();
          }
      });
    });
  
    function loadShowDetails(showId) {
      $('#showList').hide();
      $('#show').empty();
  
      $.ajax({
        url: `http://api.tvmaze.com/shows/${showId}`,
        method: 'GET',
        success: function (data) {
          let showDiv = $('#show');
  
          let h1 = $('<h1>').text(data.name);
          showDiv.append(h1);
  
          let img = $('<img>').attr('src', data.image ? data.image.medium : '/public/images/noimage.png');
          showDiv.append(img);
  
          let dl = $('<dl>');
  
          dl.append($('<dt>').text('Language'));
          dl.append($('<dd>').text(data.language || 'N/A'));
  
          dl.append($('<dt>').text('Genres'));
          let genreList = $('<ul>');
          (data.genres || []).forEach(genre => genreList.append($('<li>').text(genre)));
          dl.append($('<dd>').append(genreList));
  
          dl.append($('<dt>').text('Average Rating'));
          dl.append($('<dd>').text(data.rating.average || 'N/A'));
  
          dl.append($('<dt>').text('Network'));
          dl.append($('<dd>').text(data.network ? data.network.name : 'N/A'));
  
          dl.append($('<dt>').text('Summary'));
          dl.append($('<dd>').html(data.summary || 'N/A'));
  
          showDiv.append(dl);
          $('#homeLink').show();
          showDiv.show();
        },
        error: function (xhr, status, error) {
            console.error('Error fetching shows:', error);
            $('#showList').html('<li>Error loading shows. Please try again later.</li>').show();
          }
      });
    }
  });
  */