<?php

    drupal_add_html_head(array(
        '#type'   => 'markup',
        '#markup' => "<meta name='viewport' content='initial-scale=1,maximum-scale=1,user-scalable=no' />"
    ), 'iapb-map-meta');

    drupal_add_js('https://api.tiles.mapbox.com/mapbox.js/v2.1.0/mapbox.js', array('type' => 'external'));
    drupal_add_css('https://api.tiles.mapbox.com/mapbox.js/v2.1.0/mapbox.css', array('type' => 'external'));

    drupal_add_js(array('mapboxDataDir' => drupal_get_path('module', 'mapbox_json')), array('type' => 'setting'));

    # add dragdealer plugin
    drupal_add_css(drupal_get_path('module', 'mapbox_geostats') . '/assets/dragdealer/dragdealer.css', 'file');
    drupal_add_js(drupal_get_path('module', 'mapbox_geostats') . '/assets/dragdealer/dragdealer.js', 'file');

    # add map css
    drupal_add_css(drupal_get_path('module', 'mapbox_geostats') . '/assets/map.css', 'file');

?>

<script src='https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-fullscreen/v0.0.3/Leaflet.fullscreen.min.js'></script>
<link href='https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-fullscreen/v0.0.3/leaflet.fullscreen.css' rel='stylesheet' />

<div id="container">
  <div id="map">
  <div id="controls">
    <div class="control-section first">
      <h5>Filter by Sex</h5>
      <input id="gender-male" type="radio" name="gender" value="male"><span class="label">Male</span><br>
      <input id="gender-female" type="radio" name="gender" value="female"><span class="label">Female</span><br>
      <input id="gender-both" type="radio" name="gender" value="both" checked><span class="label">Both</span>
    </div>
    <div class="control-section">
      <h5>Filter by Condition</h5>
      <input id="level-blind" type="radio" name="level" value="b"><span class="label">Blind</span><br>
      <input id="level-msvi" type="radio" name="level" value="msvi" checked><span class="label">Vision Impaired</span><br>
    </div>
    <div class="control-section viewport-age">
      <a class="age-display" href="/adults-over-50-map">&raquo; Switch to Adults (Over 50)</a>
      <div style="display:none;">
        <input id="level-all-ages" type="radio" name="age" value="all_age" checked><span class="label">All Ages</span>
      </div>
    </div>
    <div class="control-section last">
      <h5>Key</h5>
      <div class="key-container">
        <div class="key level0"></div>
        <div class="key-label">0% - 0.3%</div>
        <div class="key level1"></div>
        <div class="key-label">0.3% - 0.8%</div>
        <div class="key level2"></div>
        <div class="key-label">0.8% - 1.1%</div>
        <div class="key level3"></div>
        <div class="key-label">1.1% - 1.5%</div>
        <div class="key level4"></div>
        <div class="key-label">1.5% - 1.9%</div>
        <div class="key level5"></div>
        <div class="key-label">1.9% - 2.2%</div>
        <div class="key level6"></div>
        <div class="key-label">2.2% - 2.6%</div>
        <div class="key level7"></div>
        <div class="key-label">2.6% - 3.0%</div>
        <div class="key level8"></div>
        <div class="key-label">3.0% - 3.5%</div>
        <div class="key level9"></div>
        <div class="key-label"> &gt; 5.0%</div>
        <div style="clear:both"></div>
      </div>
    </div>
  </div>

  <!-- Layer-based Timeline -->
  <div id="timeline-map-slider" class="dragdealer">
    <div class="handle slider-bar">
      <span class="value">0</span>
    </div>
  </div>
</div> <!-- /#map -->

<input id="timeline-play" type="submit" value="&#8635; Play"/>

<h3>Key</h3>
<ul>
    <li>Blindness: Visual acuity <3/60 in the better eye.</li>
    <li>Vision Impairment: Moderate &amp; Severe Visual Impairment with visual acuity &gt;6/18 to &ge;3/60.</li>
    <li>Prevalence: the percentage of a population that is affected with vision impairment or blindness.</li>
    <li>Prevalence Rate: Prevalence at a specified point in time, or over a specified period of time.</li>
</ul>
<h3>How to use the maps</h3>
<p>The GVD dataset provides us with several data-points to access it. The current map lets you toggle between the following aspects:</p>
<ul>
    <li>Condition (Blindness and/or Vision Impairment)</li>
    <li>Gender (Male and/or Female)</li>
    <li>Age (All ages or Adults (50 years and above))</li>
    <li>Country</li>
    <li>Year (arranged for 1990, 1995, 2000, 2005, 2010)</li>
</ul>
<h3>By Condition</h3>
<p>Selecting either ‘Blind’ or ‘Vision Impaired’ on the navigation panel (to the right) toggles between these two conditions. At the bottom of the navigation panel is a key matching the intensity of colour with prevalence of the condition (lighter is lower, darker is higher prevalence). This gives us a global perspective on prevalence. By running the pointer/mouse over each country will give you the name of the country, the prevalence rate and the population affected. As the GVD dataset has been prepared for different years (1990-2010), the MouseOver shows you the year under consideration. The prevalence rate given is the age-standardised prevalence which accounts for the difference in age structure between populations.</p>
<p>The ‘population affected’ figure represents the number of people according to the condition, sex, age, and year that you selected. This figure multiplies the ‘crude prevalence’ (not age-standardised) by number of population, to give the number of population affected by vision impairment or blindness.</p>
<p><strong>Do note:</strong> One of the key aspects of the GVD dataset is the ability to compare prevalence of changes over time. You will note that by default, the data is at ‘2010’. You can run the time-lapse feature or toggle the years by dragging the red bar around the year left, to take you back in time.</p>
<h3>By Sex</h3>
<p>Once you have chosen the condition, you can now choose to look at prevalence in men, women or both sexes combined. This is also a powerful, new aspect, hitherto unavailable with existing datasets. We now know, for example, that women represent 60% of blindness and 57% of vision impairment. Again, you get country-wise information by running the mouse/pointer over each country.
Do note the time aspect as you toggle through these options.</p>
<h3>By Age</h3>
<p>The GBD dataset allows us to look at two separate age categories – all ages and those aged 50 years and older. This becomes helpful because older populations account for a higher proportion of vision impairment and blindness. By running the mouse/pointer over each country these variations stand out.</p>
<p><strong>Note:</strong> the ‘population’ figure on MouseOver refers to the total population by age category. For example, the total population of France is 62 million (All ages) and 22.6 million (Adults aged 50 years and older).</p>
<h3>Time-Lapse</h3>
<p>The prevalence of Blindness and Vision Impairment have been in decline over the past couple of decades. The time option, from 1990-2010, makes this evident in a powerful and graphical manner.</p>
<br>
<p>This data visualisation project has been made possible with support from the <a href="http://www.brienholdenvision.org/">Brien Holden Vision Institute.</a></p>
<img src="<?php echo drupal_get_path('module', 'mapbox_geostats') . '/assets/brien-holden-logo.png'; ?>" alt="Brien Holden Vision Institute" />
</div>


<!--<script src='//cdnjs.cloudflare.com/ajax/libs/coffee-script/1.7.1/coffee-script.min.js'></script>-->
<!--<script type="text/coffeescript" src="/<?php echo drupal_get_path('module', 'mapbox_geostats'); ?>/mapbox_geostats.coffee"></script>-->
<script type="text/javascript" src="/<?php echo drupal_get_path('module', 'mapbox_geostats'); ?>/mapbox_geostats.js"></script>
