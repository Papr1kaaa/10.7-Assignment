'use strict';

// put your own value below!
const apiKey = 'DOBbOx2edSW7DeTBLLA7dITv3gZ89MtBAMK0khG6'; 
const searchURL = 'https://developer.nps.gov/api/v1/parks';


function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson) {
  // if there are previous results, remove them
  console.log(responseJson);
  $('#results-list').empty();
  // iterate through the items array
  let searchResults = responseJson.total;
  if (searchResults == 0) {
    $('#results-list').append(
      `<li><h3>No results found</h3></li>`
    )}
  else {
    for (let i = 0; i < responseJson.data.length; i++){
      // for each video object in the items 
      //array, add a list item to the results 
      //list with the video title, description,
      //and thumbnail
        $('#results-list').append(
        `<li><h3>${responseJson.data[i].name}</h3>
        <p>${responseJson.data[i].description}</p>
        <p>${responseJson.data[i].url}</p>
        </li>`
        )}
    }
  //display the results section  
  $('#results').removeClass('hidden');
};

function getYouTubeVideos(query, state, limit=10) {
  const params = {
    api_key: apiKey,
    q: query,
    stateCode: state,
    limit
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;

  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $(document).ready(function(event) {
  let max_fields = 5
  let wrapper = $(".input_fields_wrap");
  let add_button = $(".add_field_button");
  let x = 1
  $(add_button).click(function(event) {
    event.preventDefault();
    if (x<max_fields) {
      x++;
      $(wrapper).append(`<div><input type="text" name="search-state[]" class="js-search-state" placeholder="State (e.g. CA)" maxlength="2"><a href="#" class="remove_field">Remove</a></div>`);
    }
  });
  $(wrapper).on("click",".remove_field",function(event) {
    event.preventDefault();
    $(this).parent('div').remove();
  });
  });
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-search-term').val();
    let searchState = [];
    $(".js-search-state").each(function(index){
      searchState.push(this.value);
    });
    const limit = $('#js-max-results').val();
    getYouTubeVideos(searchTerm, searchState, limit);
  });
}

$(watchForm);