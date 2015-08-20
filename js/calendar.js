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
    if (cutoff > itemTime) {continue; }
    var row = toRow(item);

    $("#shows").append(row);
  }
  items.forEach(function(item){

  });
}

var toRow = function(item) {
  var showDate = new Date(item.start.dateTime);
  // var dateString = showDate.toDateString();
  var dateString = showDate.toLocaleString('en-US', timeOptions);
  var title = item.summary;
  var showObject = toShowObject(item);
  // var venue = setAttribute(showObject, "venue");
  // var price = setAttribute(showObject, "price");
  var locString = item.location.replace(", United States", "");
  var mapLink = mapURL + item.location;
  var newRow = $("<tr>");
  newRow.append("<td>" + dateString + "</td>");
  newRow.append(titleString(showObject, title));
  newRow.append("<td><a href='" + mapLink + "' target='_blank'>"
    + locString + "</a></td>");
  return newRow;
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
    middle = "<a href='" + showObject.link + "'>" + title + "</a>";
  } else {
    middle = title;
  }
  return "<td>" + middle + "</td>"
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

$(document).ready(function() {
  getCalendar();
});
