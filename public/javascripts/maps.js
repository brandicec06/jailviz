  var height, path, projection, states, svg, width;

  states = d3.select('body').append('svg').append("svg").attr("id", "states");

  width = parseInt(window.innerWidth);
  height = parseInt(window.innerHeight);

  svg = d3.select('svg')
    .attr("width", width)
    .attr("height",height);

  projection = d3.geoAlbers()
    .center([-10, 44])//-25
    .scale(1000)
    .translate([width / 2, height / 2]);

  console.log(projection.scale());

  path = d3.geoPath().projection(projection);

  d3.json("./source/nstates.json", function(collection) {

    console.log(collection.features);
    return states.selectAll("path").data(collection.features).enter().append("svg:path")
    .attr("d", path)
    .append("svg:title")
    .text(function(d) {
      return d.properties.name;
    });

  });


/*var width = 960,
    height = 1160;

var projection = d3.geoAlbers()
    .center([0, 55.4])
    .rotate([4.4, 0])
    .parallels([50, 60])
    .scale(1200 * 5)
    .translate([width / 2, height / 2]);

var path = d3.geoPath()
    .projection(projection);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

d3.json("./source/nstates.json", function(error, us) {
  svg.append("path")
      .datum(topojson.feature(us, us.object.geometry))
      .attr("d", path);
});*/
