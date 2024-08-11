// Wrap all code in an Immediately Invoked Function Expression (IIFE)
/* 
All of the functionality will be done in this client-side JS file.  
You will make client - side AJAX requests to the API and use jQuery to target and create elements on the page.
*/

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
  