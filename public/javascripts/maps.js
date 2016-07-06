  var height, path, projection, states, svg, width, pl;

  states = d3.select('body').append('svg').append("svg").attr("id", "states");

  width = parseInt(window.innerWidth);
  height = parseInt(window.innerHeight);

  jails = [];
  njails = [];

  svg = d3.select('svg')
    .attr("width", width)
    .attr("height", height);

  projection = d3.geoAlbers()
    .center([-10, 39])//-25
    .scale(1500)
    .translate([width / 3, height / 2]);



  //console.log(projection.scale());


  path = d3.geoPath().projection(projection);
   // console.log(projection.invert([0,0]));
   // console.log(projection.invert([width,height]));

  var coord = [];
  var ncoord = [];

  d3.json("./source/nstates.json", function(collection) { 


    for( var p in collection.features){
       var x = collection.features[p].properties.longitude;
       var y = collection.features[p].properties.latitude;
       coord.push({x,y});
     
    }  

    for (i in coord){
      ncoord.push(projection([coord[i].x,coord[i].y]));
      //console.log(projection(coord[i]));
    }

    //console.log(ncoord[0][0]);

    states.selectAll("path").data(collection.features).enter().append("svg:path")
      .attr("d", path)
      .append("svg:title")
      .text(function(d) {
        return d.properties.name;
    });


      /*var circles = svg.selectAll("circle").data(ncoord);
        // Enter
          circles.enter().append("circle")
          .attr("r", 10).attr("cx", function (d,i){ return 500 })
          .attr("cx", function (d){ 
            return d[0]; 
          })
          .attr("cy", function (d){ return d[1]; })
          .style("fill","blue");
          */

  });

  function coordScale(pts){
    for(i in pts){
      njails.push(projection([pts[i].jx,pts[i].jy]));
    } 
  }

  d3.csv("./source/survey.csv", function(error,data){
      if(error) throw error;

      for( p in data){
        var jx = data[p].LON;
        var jy = data[p].LAT;

        jails.push({jx,jy});
        
      }

  coordScale(jails);

  console.log(njails);

  var circles = svg.selectAll("circle").data(njails);
        // Enter
          circles.enter().append("circle")
          .attr("r", 3)
          .attr("cx", function (d){ 
            return +d[0]; 
          })
          .attr("cy", function (d){ return +d[1]; })
          .style("fill", "blue")
          .style('opacity', .5);

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
