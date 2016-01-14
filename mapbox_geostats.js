(function($) {

L.mapbox.accessToken = 'pk.eyJ1IjoidGVqYWgiLCJhIjoiRW1yT3EzNCJ9._PWXvxjalbZi0cLXO01AJg';

var currentLayer = null;
var query;

// original layer based data from Mapbox use it just for the base layer
var layers = {
  'country-base': L.mapbox.tileLayer('tejah.a6a2lnmi')
};

// create map object
var map = L.mapbox.map('map', 'tejah.l28p8hm3', {
    minZoom: 2,
    maxZoom: 6,
    worldCopyJump: true
});

map.setView([51.45, 2.5], 4);

L.control.fullscreen().addTo(map);

/** geoJson data
 *
 * 1. get module path mapbox_json
 * 2. use radio buttons to filter JSON data
 *
 */

// <- create function to build query @nathan
function buildQuery(gender, level, year, age) {
  // query format -> "both_msvi_1990_all_age_mean_agx"
}


year = "2010"; // default for now
age = $('input[name="age"]:checked').val();
level = $('input[name="level"]:checked').val();
gender = $('input[name="gender"]:checked').val();

query = gender + "_" + level + "_" + year + "_" + age + "_mean_agx";

// query $.getJSON. on initial load
loadGeoJson(query);

 // geoJson part 2.
function toggleLayer() {
   var gender, level, year, age;
   year = $('#timeline-map-slider .value').text(); // default for now
   age = $('input[name="age"]:checked').val();
   level = $('input[name="level"]:checked').val();
   gender = $('input[name="gender"]:checked').val();

   query = gender + "_" + level + "_" + year + "_" + age + "_mean_agx";

   // query $.getJSON.
   loadGeoJson(query);
}

// highlight a country when you hover over the polygon
function highlightFeature(e) {
    var layer = e.target;
    layer.setStyle({
        weight: 1,
        fillOpacity: 1
    });

    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }
}
// reset the highlight style
function resetHighlight(e) {
    layer.resetStyle(e.target);
}

 // interactive features on layer hover
function onEachFeature(feature, layer) {
  var gender, level, year, age;

  // Added by GH - get year from query rather than slider
  var queryArray = query.split("_");
  year = queryArray[2];

  age = $('input[name="age"]:checked').val();
  level = $('input[name="level"]:checked').val();
  gender = $('input[name="gender"]:checked').val();

  // load the values from the json file
  mean = gender + "_" + level + "_" + year + "_" + age + "_mean_agx";
  population = gender + "_" + level + "_" + year + "_" + age + "_pop";
  affected_pop = gender + "_" + level + "_" + year + "_" + age + "_no_affected";

  var popupContent = "<p>" +
  "<strong>Year: </strong><em>" + year + "</em><br />" +
  "<strong>Country: </strong><em>" + feature.properties.name + "</em><br />" +
  "<strong>Prevalence: </strong><em>" + feature.properties[mean] + "&percnt;</em><br />" +
  "<strong>Population: </strong><em>" + feature.properties[population] + "</em><br />" +
  "<strong>Population affected: </strong><em>" + feature.properties[affected_pop] + "</em>" +
  "</p>";

  // custom popups found here http://palewi.re/posts/2012/03/26/leaflet-recipe-hover-events-features-and-polygons/
  layer.on("mouseover", function (e) {
    // create a popup with a unique ID linked to this record
    var popup = $("<div></div>", {
        id: "popup-" + feature.properties.iso_a3,
        css: {
            position: "absolute",
            bottom: "50px",
            left: "25px",
            zIndex: 1002,
            backgroundColor: "#2c3e50",
            padding: "8px",
            border: "1px solid #2c3e50",
            color: "#fff"
        }
    });
    // insert the HTML content into the popup
    var detail = $("<div></div>", {
        html: popupContent,
        css: {
          fontSize: "16px",
          marginBottom: "3px"
        }
    }).appendTo(popup);
    // add the popup to the map
    popup.appendTo("#map");
  });
  // create a mouseout event that undoes the mouseover changes
  layer.on("mouseout", function (e) {
    // destroy the popup from the dom
    $("#popup-" + feature.properties.iso_a3).remove();
  });

  if (feature.properties) {
     layer.bindPopup(popupContent);
  }
}


// conditional colours!!!
function getColour(mean, largest_mean) {
  // create dynamic filter values
  var filter_values = [0, 3, 8, 11, 15, 19, 22, 26, 30, 35, 50];
  var decimal_filters = [];
  if(largest_mean < 15) {
    var count = filter_values.length;
    for(var i=0;i<count;i++) {
      //console.log(i);
      var filter = filter_values[i];
      var decimal = filter / 10;
      // push decimal values into an array
      decimal_filters.push(decimal);
    }
    // destroy and then rebuild the array
    filter_values = [];
    filter_values = decimal_filters;
  }

   if(mean >= filter_values[0] && mean <= filter_values[1]) {
     return '#ffef44';
   }
   if(mean >= filter_values[1] && mean <= filter_values[2]) {
     return '#fed702';
   }
   if(mean >= filter_values[2] && mean <= filter_values[3]) {
     return '#fec204';
   }
   if(mean >= filter_values[3] && mean <= filter_values[4]) {
     return '#fda107';
   }
   if(mean >= filter_values[4] && mean <= filter_values[5]) {
     return '#fb7c0b';
   }
   if(mean >= filter_values[5] && mean <= filter_values[6]) {
     return '#fa680c';
   }
   if(mean >= filter_values[6] && mean <= filter_values[7]) {
     return '#fa4810';
   }
   if(mean >= filter_values[7] && mean <= filter_values[8]) {
     return '#f92d12';
   }
   if(mean >= filter_values[8] && mean <= filter_values[9]) {
     return '#f81714';
   }
   if(mean >= filter_values[9]) {
     return '#da1916';
   }
   if(!mean) {
     return '#f0f0f0'; //return blank polygon
   }
}

function loadGeoJson(query) {
  // geoJson part 1.
  var mapbox_json = Drupal.settings.mapboxDataDir + '/country.json';

  $.getJSON(mapbox_json, function(countries) {

	  var root = countries.features;
	  mean_length = root.length;
	  var max_mean = [];
	  for(var i=0;i<mean_length;i++) {
		  var properties = root[i].properties;
		    if(typeof properties[query] !== 'undefined') {
		      // return the max mean value
		      max_mean.push(properties[query]);
		    }
	  }

	  var largest_mean = Math.max.apply(Math, max_mean);

	  layer = L.geoJson(countries, {
		  // style each country polygon
		  style: function(feature) {
		    return {
		      fillColor: getColour(feature.properties[query], largest_mean),
		      fillOpacity: 1,
		      weight: 0.5,
		      color: '#226688',
		      title: feature.properties.name
		    };
		    },
		    // popup effects -> onEachFeature
		    onEachFeature: onEachFeature
		}).addTo(map); // add the layer to the map

  });

}

// dragdealer plugin, create new slider and set predefined options
var timeline = new Dragdealer('timeline-map-slider', {
    slide: true,
    steps: 5,
    //snap: true,
    x: 1,

    animationCallback: function(x, y) {
      return $('#timeline-map-slider .value').text(Math.round(x * 4) * 5 + 1990);
    },
    callback: function(x, y) {
      if($('#timeline-play').val() != "Playing..."){toggleLayer();}
    }
});

$('#timeline-play').click(function() {

	$('#timeline-play').attr('disabled','disabled');
	$('#timeline-play').val("Playing...");

	updateMapAnimation(5);

	var counter = 4;
	var playStats = setInterval(function(){

		updateMapAnimation(counter);
		counter--;

		if(counter === 0) {
			clearInterval(playStats);
			$('#timeline-play').removeAttr('disabled');
			$('#timeline-play').val("\u21BB Play");
		}

	}, 3000);
});

// this function supports the playing... feature of the map
function updateMapAnimation(i) {

	var newval = 0;
	var newYear = '1990';
	var newStep = 0;

	switch(i) {
		case 5:
			newval = 1;
			newStep = 4;
			newYear = '2010';
			break;
		case 4:
			newval = 0.75;
			newStep = 3;
			newYear = '2005';
			break;
		case 3:
			newval = 0.5;
			newStep = 2;
			newYear = '2000';
			break;
		case 2:
			newval = 0.25;
			newStep = 1;
			newYear = '1995';
			break;
		default:
			newval = 0;
			newStep = 0;
			newYear = '1990';
	}

	timeline.setValue(newval,0);
	timeline.setStep(i,0);

	age = $('input[name="age"]:checked').val();
	level = $('input[name="level"]:checked').val();
	gender = $('input[name="gender"]:checked').val();

	query = gender + "_" + level + "_" + newYear + "_" + age + "_mean_agx";

	//we need this to help with the slider flicker
        setTimeout(function(){loadGeoJson(query)},1325);

}

// filters to change the /query
$('input[name="level"]').change(function() {
  return toggleLayer();
});

$('input[name="gender"]').change(function() {
  return toggleLayer();
});

$('input[name="age"]').change(function() {
  return toggleLayer();
});

// make the map play.
$('div#timeline-map-slider').click(function() {
  //console.log('this will make the map move automatically (somehow). :s');
});

// workaround for base layer ordering.
var topPane = map._createPane('leaflet-top-pane', map.getPanes().mapPane);
var topLayer = L.mapbox.tileLayer('circleinteractive.2na02j4i').addTo(map);
topPane.appendChild(topLayer.getContainer());
topLayer.setZIndex(5);

})(jQuery);
