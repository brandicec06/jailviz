  var height, path, projection, states, svg, width, pl;

  states = d3.select('body').append('svg').append("svg").attr("id", "states")
      .style("stroke","white")
      .style("stroke-width", ".5")
      .style("stroke-opacity", "0.4");;

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



  //console.log(projection.scale());


  path = d3.geoPath().projection(projection)

  //console.log(projection.invert([0,0]));
  // console.log(projection.invert([width,height]));

  var coord = [];
  var ncoord = [];
  var extentsx = projection.invert([0,0]);
  var extentsy = projection.invert([width,height]);
  var r = 3;



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
  //console.log(extentsx);
  //console.log(njails);

  var rScale = d3.scaleLinear()
    .domain([0,20000])
    .range([3, 50])


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
          .attr("r", function(d,i){
            return rScale(data[i].CONFPOP);
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
          })
          .style("fill", function(d,i){
            //console.log(d.CONFPOP)
            
            var t = d.CONFPOP;
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
          .on("mouseout",out);


  });

