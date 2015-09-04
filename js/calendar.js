var calURL = "https://www.googleapis.com/calendar/v3/calendars/2o02frdlq63bi8rjipiuijq1l4%40group.calendar.google.com/events?&key=AIzaSyAHODXhRYNXD_rXz3ZclKNNrWLQzMkgfcw";
var mapURL = "https://maps.google.com/maps?hl=en&q=";
var timeOptions = {
  weekday: "short", month: "long", day: "numeric", year: "numeric",
  hour: "numeric", minute: "numeric"
}
var getCalendar = function() {
  $.ajax({
    dataType: "json",
    url: calURL,
    success: function(data) {
      var events = data.items;
      addShows(events);
    }
  })
}

var addShows = function(items) {
  var cutoff = new Date() - 7200000;
  for (i = 0; i < items.length; i++) {
    var item = items[i];
    var itemTime = new Date(item.start.dateTime);
    item['startTime'] = itemTime;
  }
  var sorted = items.sort(function(a,b) {
    return a['startTime'] - b['startTime'];
  })
  for (i = 0; i < sorted.length; i++) {
    var item = sorted[i];
    if (cutoff > item['startTime']) {continue; }
    var row = toRow(item);
    $("#shows").append(row);
  };
}

var toRow = function(item) {
  var showDate = new Date(item.start.dateTime);
  var dateString = showDate.toLocaleString('en-US', timeOptions);
  var title = item.summary;
  var showObject = toShowObject(item);



  var newRow = $("<tr>");
  newRow.append("<td>" + dateString + "</td>");
  newRow.append(titleString(showObject, title));
  newRow.append(whereString(item, showObject))
  return newRow;
}

var whereString = function(item, showObject) {
  var venue = setAttribute(showObject, "venue");
  var venueLink = setAttribute(showObject, "venue_link");

  var mapString = mapLink(item, venue);
  var venueURL = venuePageString(venueLink);

  var city = setAttribute(showObject, "city");
  city = (city == "TBD" ? "" : ", " + city);
  var state = setAttribute(showObject, "state");
  state = (state = "TBD" ? "" : ", " + state);

  if (venue == "TBD") {
    return "<td>" + mapString + "</td>"
  } else {
    return "<td>" + venue + city + state + " (" + venueURL + mapString + ")</td>"
  }
}

var mapLink = function(item, venue) {
  var mapLink = mapURL + item.location;
  var locString = item.location.replace(", United States", "");
  if (venue == "TBD") {
    return "<a href='" + mapLink + "' target='_blank'>" + locString + "</a>"
  } else {
    return "<a href='" + mapLink + "' target='_blank'>map</a>"
  }
}

var venuePageString = function(venueLink) {
  if (venueLink == "TBD") {
    return "";
  } else {
    return "<a href='" + venueLink + "' target='_blank'>site</a>, ";
  }
}

var toShowObject = function(item) {
  var description = !!item.description ? item.description : "";
  var chunks = description.split("\n");
  var show = {};
  chunks.forEach(function(chunk){
    var separate = chunk.search(":");
    var key = chunk.slice(0, separate);
    var object = chunk.slice(separate+2);
    show[key] = object;
  });
  return show;
}

var locationString = function(showObject) {

}

var setAttribute = function(showObject, attr) {
  if (!!showObject[attr]) {
    return showObject[attr];
  } else {
    return "TBD";
  }
}

var titleString = function(showObject, title) {
  var middle;
  var link = setAttribute(showObject, "link");
  if (!!showObject.link) {
    middle = "<a href='" + showObject.link + "' target='_blank'>" + title + "</a>";
  } else {
    middle = title;
  }
  return "<td>" + middle + "</td>"
}



$(document).ready(function() {
  getCalendar();
});
