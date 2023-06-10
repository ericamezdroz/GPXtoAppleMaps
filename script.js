$(document).ready(function() {
    $("#uploadBtn").change(function(e) {
      var file = e.target.files[0];
      var reader = new FileReader();
      reader.onload = function(e) {
        var gpxData = e.target.result;
        convertGPXToAppleMaps(gpxData);
      };
      reader.readAsText(file);
    });
  
    function convertGPXToAppleMaps(gpxData) {
      var parser = new DOMParser();
      var gpxXml = parser.parseFromString(gpxData, "text/xml");
  
      var trackPoints = gpxXml.getElementsByTagName("trkpt");
      var locations = [];
  
      for (var i = 0; i < trackPoints.length; i++) {
        if (i % 100 === 0) {
          var trackPoint = trackPoints[i];
          var lat = trackPoint.getAttribute("lat");
          var lon = trackPoint.getAttribute("lon");
  
          locations.push({ lat: lat, lon: lon });
        }
      }
  
      if (locations.length > 1) {
        var appleMapsLink = createAppleMapsLink(locations);
        $("#appleMapsLink").html('<a href="' + appleMapsLink + '">Open in Apple Maps</a>');
      } else {
        $("#appleMapsLink").html('Not enough waypoints available.');
      }
    }
  
    function createAppleMapsLink(locations) {
      var link = 'https://maps.apple.com/?';
  
      if (locations.length > 1) {
        var waypointsParam = '';
  
        for (var i = 0; i < locations.length - 1; i++) {
          var waypoint = locations[i];
          waypointsParam += 'daddr=' + waypoint.lat + ',' + waypoint.lon + '&';
        }
  
        var destination = locations[locations.length - 1];
        link += waypointsParam + 'daddr=' + destination.lat + ',' + destination.lon;
      }
  
      return link;
    }
  });
  