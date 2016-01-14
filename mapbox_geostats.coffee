L.mapbox.accessToken = 'pk.eyJ1IjoiY2lyY2xlaW50ZXJhY3RpdmUiLCJhIjoiMVZBTDdFbyJ9.z7kRz5-PyqZQM4H8lIuNYA'

currentLayer = null

layers =

    '1995-blind-male':   L.mapbox.tileLayer('circleinteractive.2x09hpvi') # 1995 Blind Male
    '1995-blind-female': L.mapbox.tileLayer('circleinteractive.25jexw29') # 1995 Blind Female
    '1995-blind-both':   L.mapbox.tileLayer('circleinteractive.wcc2qpvi') # 1995 Blind Both
    '1995-msvi-male':    L.mapbox.tileLayer('circleinteractive.49a1nhfr') # 1995 MSVI Male
    '1995-msvi-male-grid':  L.mapbox.gridLayer('circleinteractive.wd841jor') # 1995 MSVI Female GridLayer
    '1995-msvi-female':  L.mapbox.tileLayer('circleinteractive.fa1w0zfr') # 1995 MSVI Female
    '1995-msvi-female-grid':  L.mapbox.gridLayer('circleinteractive.jqb8olxr') # 1995 MSVI Female GridLayer
    '1995-msvi-both':    L.mapbox.tileLayer('circleinteractive.befry66r') # 1995 MSVI Both
    '1995-msvi-both-grid':    L.mapbox.tileLayer('circleinteractive.tqp5vcxr') # 1995 MSVI Both
    'country-base':      L.mapbox.tileLayer('circleinteractive.2na02j4i') # country names

addLayer = (layer) -> 
    layer.addTo map
         .setZIndex 5

addGrid = (layer) -> 
    layer.addTo map

removeLayer = (layer) -> map.removeLayer layer

toggleLayer = ->

    year   = 1995 # for now
    level  = jQuery('input[name="level"]:checked').val()
    gender = jQuery('input[name="gender"]:checked').val()
    
    layerName = "#{year}-#{level}-#{gender}"
    
    if currentLayer
        currentLayer.setZIndex 4
        # todo: want to remove the layer entirely after the new one has loaded
        # something like this ..
        #setTimeout(
        #    (layer) -> removeLayer(layer),
        #    currentLayer
        #)

    if not layers[layerName]?
        return console.log 'No layer found for ' + layerName 

    currentLayer = layers[layerName]
    addLayer currentLayer

map = L.mapbox.map 'map', 'circleinteractive.j73657fb',
    minZoom: 2,
    maxZoom: 6

# initialize location and zoom level
map.setView [51.45, 2.5], 4

L.control.fullscreen()
    .addTo map

# dragdealer plugin
new Dragdealer('timeline-map-slider',
    animationCallback: (x, y) ->
        jQuery('#timeline-map-slider .value').text Math.round(x * 3) * 5 + 1995
)

# attach radio button event handlers
jQuery('input[name="gender"]').change ->
    toggleLayer()

jQuery('input[name="level"]').change ->
    toggleLayer()

toggleLayer()

# add country name layer to high z-index
layers['country-base'].addTo map
    .setZIndex 10

jQuery('input[type=radio]').each -> 
    # add wrapper div and label after checkbox
    jQuery(@).wrap('<div class="styled-radio"></div>')
        .after('<label for="' + jQuery(@).attr('id') + '"></label>');

    preyear   = 1995 # for now
    prelevel  = jQuery('input[name="level"]:checked').val()
    pregender = jQuery('input[name="gender"]:checked').val()

    prelayerName = "#{preyear}-#{prelevel}-#{pregender}"
    console.log prelayerName

toggleLayer = ->
    year   = 1995 # for now
    level  = jQuery('input[name="level"]:checked').val()
    gender = jQuery('input[name="gender"]:checked').val()
    
    gridName = "#{year}-#{level}-#{gender}-grid"
    layerName = "#{year}-#{level}-#{gender}"
    currentGrid = layers[gridName]

    if currentLayer
        currentLayer.setZIndex 4

    currentLayer = layers[layerName]
    addLayer currentLayer
    addGrid currentGrid

    currentGrid.on("mousemove", (o) ->
      if o.data
        count.innerHTML = "<strong>" + o.data.ADMIN + "</strong><br><strong>" + o.data.iapb_msv10 + "%</strong>"
      else
        #console.log o
        count.innerHTML = ""
      return
    ).on "mouseout", (o) ->
      count.innerHTML = ""
      return
