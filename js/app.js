
//declare my variables
var location, sort;
var search_terms, yelpListingArray = [];
var resultsAll = document.getElementById('results');  
var searchform = document.getElementById('search');
var fieldItems = searchform.querySelectorAll('.form-item');
var searchResultsData;

getSearchValues = function(form) {
  search_terms = [];

  for (var i = 0; i < fieldItems.length-1; i++) {
    if (fieldItems[i].value !== "") {
      var arr = [ fieldItems[i].id, fieldItems[i].value ];
      search_terms.push(arr);
    }
  } 
}

yelpSearch = function() {

  function allTheTacos(data) {        
    console.log("allTheTacos: " + JSON.stringify(data));
  }

  var auth = {
    // Yelp authentication key
    consumerKey: 'xsbNGhha5XhzqgInIgRk3w',
    consumerSecret: 'Ubi-QetM4w0XJAjPumGqL_LbY20',
    accessToken: 'KVVCpND1W_ZQ8Pg4pOz3O43_YrCI1r8o',
    accessTokenSecret: 'plstAOdDtitu7Oer8b546q9Zu_8',
    serviceProvider : {
        signatureMethod : "HMAC-SHA1"
    }
  };

  var accessor = {
      consumerSecret : auth.consumerSecret,
      tokenSecret : auth.accessTokenSecret
  };

  var parameters = [];
  for (var i = 0; i < search_terms.length; i++) {
    parameters.push(search_terms[i]);
    // console.log(search_terms[i]);
  }

  //I had to use OAuth
  parameters.push(['callback', 'allTheTacos']);
  parameters.push(['oauth_consumer_key', auth.consumerKey]);
  parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
  parameters.push(['oauth_token', auth.accessToken]);
  parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

  var message = {
    'action' : 'https://api.yelp.com/v2/search?term=taco+truck',
    'method' : 'GET',
    'parameters' : parameters
  };

  OAuth.setTimestampAndNonce(message);
  OAuth.SignatureMethod.sign(message, accessor);

  var parameterMap = OAuth.getParameterMap(message.parameters);
      
  $.ajax({
      'url' : message.action,
      'data' : parameterMap,
      'dataType' : 'jsonp',
      'jsonpCallback' : 'allTheTacos',
      'cache': true
  })
  .done(function(data, textStatus, jqXHR) {
      searchResultsData = JSON.stringify(jqXHR);

      console.log('success[' + data + '], status[' + textStatus + '], jqXHR[' + searchResultsData + ']');

      parseSearchResults(JSON.parse(searchResultsData)["responseJSON"]);
    }
  )
  .fail(function(jqXHR, textStatus, errorThrown) {
      console.log('error[' + errorThrown + '], status[' + textStatus + '], jqXHR[' + JSON.stringify(jqXHR) + ']');
      }
  );

}

function parseSearchResults(object) {
  var businesses = object.businesses;

  var yelpListing = function(business) {
    var item = document.createElement('div');
      item.setAttribute('class', 'item');
      item.innerHTML = (
        '<h5 class="header"><a class="yelp-listing-link" href="' + business.url +'">' + business.name + '</a></h5>' +
        '<img class="image" src="' + business.rating_img_url_small + '" />' +            
        '<img class="thumbnail" src="' + business.image_url + '" />'       
      );
    return item;
  }
  if (yelpListingArray.length > 0) { 
    yelpListingArray = [];
    resultsAll.innerHTML = ''; 
  }
  for (var i = 0; i < businesses.length; i++) {
    yelpListingArray.push(new yelpListing(businesses[i]));
    resultsAll.append(yelpListingArray[i]);
  }

  setTimeout(function() {
    resultsAll.classList.add('active');
  }, 500);    
};

searchform.addEventListener('submit', function(e) {
  e.preventDefault();
  resultsAll.classList.remove('active');      
  getSearchValues(this);
  yelpSearch();
});
