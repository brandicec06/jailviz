  var height, path, projection, states, svg, width, pl;

  var coord = [];
  var extentsx;
  var extentsy;
  var r = 3;

  var name = "CONFPOP";

  states = d3.select('#map').append('svg').append("svg").attr("id", "states")
      .style("stroke","white")
      .style("stroke-width", ".5")
      .style("stroke-opacity", "0.4");



  width = parseInt(window.innerWidth);
  height = parseInt(window.innerHeight);

  jails = [];
  njails = [];

  svg = d3.select('svg')
    .attr("width", width)
    .attr("height", height);

  projection = d3.geoAlbers()
    .center([-10, 39])//-25
    .scale(1400)
    .translate([width / 3, height / 2]);

  extentsx = projection.invert([0,0]);
  extentsy = projection.invert([width,height]);

  //console.log(projection.scale());


  path = d3.geoPath().projection(projection)

  //console.log(projection.invert([0,0]));
  // console.log(projection.invert([width,height]));

  d3.json("./source/nstates.json", function(collection) { 


    for( var p in collection.features){
       var x = collection.features[p].properties.longitude;
       var y = collection.features[p].properties.latitude;

       coord.push({x,y});
     
    }  

    states.selectAll("path").data(collection.features).enter().append("svg:path")
      .attr("d", path)
      .append("svg:title")
      .text(function(d) {
        return d.properties.name;
    });

  });

  function coordScale(pts){
    for(i in pts){
      njails.push(projection([pts[i].jx,pts[i].jy]));
    } 
  }

  function rMap(num,bounds, key){

    if(key == "NCONPOP" || key == "CONFPOP"){
      var nBound = [0,20000];
      bounds = nBound;
      console.log("this is pringing");
    }

    var dScale = d3.scaleLinear()
    .domain(bounds)
    .range([3, 50])

    var sNum = dScale(num);

    return sNum;
  }


  function extents(obj, k){
    var range = [];
    var arr = _.pluck(obj,k);
    arr = arr.map(Number);


    range.push(_.min(arr));
    range.push(_.max(arr));
    return range;
    //return range[rMax,rMin];
  }


function update(key){
  d3.csv("./source/survey.csv", function(error,data){
      if(error) throw error;

      for( p in data){
        var jx = data[p].LON;
        var jy = data[p].LAT;

        jails.push({jx,jy});
        
      }

  coordScale(jails);


  var dRange = extents(data,key);
  console.log(dRange);

  var over = function(){
    var circle = d3.select(this);
    pr = circle.attr("r");

    circle.transition().duration(500)
        .attr("r", circle.attr("r") * 1 + 10 );
        //.style("opacity","0.2"); 
  }

  var out = function(){
    var circle = d3.select(this);
    circle.transition().duration(500)
        .attr("r",pr)
  }

  var points;
  var pr;
  var circles = svg.selectAll("circle").data(data);
        var c;
   
        circles.enter().append("circle")
          .attr("r", 0)
          .attr("cx", function (d,i){ 

            points = projection([data[i].LON,data[i].LAT]);
            //console.log(points[0]);
            
            return points[0];
          })
          .attr("cy", function (d,i){ 
            //console.log(points[0)
            points = projection([data[i].LON,data[i].LAT]);
            //console.log(points[1]);
            return points[1];
          })
          .style("fill", function(d,i){
            //console.log(d.name)
            
            var t = d[name];
            var carr = ["#fed9a6","#b3cde3","#ccebc5","#decbe4","#fbb4ae"];

            if(t<100){
              c =0;
            }else if( t< 500){
              c =1;
            }else if( t< 5000){
              c =2;
            }else if( t< 10000){
              c =3;
            }else{
              c=4;
            }
            return carr[c];
          })
          .style('opacity', .5)
          .on("mouseover",over)
          .on("mouseout",out)
          .transition()
          .duration(2000);

        svg.selectAll("circle").transition().duration(1000)
          .attr("r", function(d,i){

              //console.log(rMap(data[i][key], dRange));
            return rMap(data[i][key], dRange,key);
          })
          .attr("cx", function (d,i){ 

            points = projection([data[i].LON,data[i].LAT]);
            //console.log(points[0]);
            
            return points[0];
          })
          .attr("cy", function (d,i){ 
            //console.log(points[0)
            points = projection([data[i].LON,data[i].LAT]);
            //console.log(points[1]);
            return points[1];
          }).style("fill", function(d,i){
            //console.log(d.name)
            
            var t = d[key];
            var carr = ["#fed9a6","#b3cde3","#ccebc5","#decbe4","#fbb4ae"];

            if(t<100){
              c =0;
            }else if( t< 500){
              c =1;
            }else if( t< 5000){
              c =2;
            }else if( t< 10000){
              c =3;
            }else{
              c=4;
            }
            return carr[c];
          });

        circles.exit().remove();

    });
    return key;
 } 


function updateData(name){
  var h = update(name,update);
  console.log(h);
}

