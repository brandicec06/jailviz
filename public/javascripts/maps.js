  var height, path, projection, states, svg, width, pl;

  var coord = [];
  var extentsx;
  var extentsy;
  var r = 3;

  cLeft = 150;
  cTop = 50;

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

  // circle grid chart functionality


  var gpts = [];
  var gXp = 10;
  var gYp = 10;

  var gridScaleX = d3.scaleLinear()
    .domain([0,10])
    .range([cLeft,width-cLeft/2])

  var gridScaleY = d3.scaleLinear()
    .domain([0,10])
    .range([cTop,height-cTop]);


  function gridPoints(){
      for(var i =0; i<10; i++){
        var x = gridScaleX(i);
        for(var j =0; j<10; j++){
          var y = gridScaleY(j);
            gpts.push({x,y});
        }
      }

      return gpts;
  }

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

    if(key == "NCONPOP" || key == "UNCONV" || key == "BLACK"){
      var nBound = [0,20000];
      bounds = nBound;
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
  //adds div for tool tip 
  var div = d3.select("body").append("div") 
    .attr("class", "tooltip")       
    .style("opacity", 0);


function update(key,chart){
  d3.csv("./source/survey.csv", function(error,data){
      if(error) throw error;

      for( p in data){
        var jx = data[p].LON;
        var jy = data[p].LAT;

        jails.push({jx,jy});
        
      }

  coordScale(jails);

  var dRange = extents(data,key);
  //console.log(dRange);

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
          .style("opacity",.5)
          .on("mouseover",over)
          .on("mouseout",out)

          svg.selectAll("circle").on("mouseover",function(d) {   
            div.transition()    
                .duration(200)    
                .style("opacity", .9)
            div .html(d[key]+ "<br/>"  + d["CITY"])  
                .style("left", (d3.event.pageX) + "px")   
                .style("top", (d3.event.pageY - 28) + "px")
            })
          .on("mouseout", function(d) {   
            div.transition()    
                .duration(500)    
                .style("opacity", 0); 
           })
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
          })
          .style("opacity",function(){
            if(chart ){
              return 0;
            }else {
              return .5;
            }
          });

          console.log(chart);

          var ppts =[];
          var Gpoint = [];
          if(chart == true){
              states.selectAll("path").transition().duration(1000)
                .style("stroke-opacity", "0");
              ppts = gridPoints();

              /*d3.selct("svg").selectAll("*").remove();

              svg.selectAll("circle").data(gpts)//.transition().duration(1000)
                .enter().append("circle")
                .attr("cx", function (d,i){ 
                  console.log(gpts[i])
                  Gpoint = gpts[i];
                  return Gpoint[0];
                })
                .attr("cx", function (d,i){ 
                  Gpoint = gpts[i];
                  return Gpoint[1];
                })
                .style("opacity", .5);*/

          }else{
              states.selectAll("path").transition().duration(1000)
                .style("stroke-opacity", "0.4");
          }

        circles.exit().remove();



    });
    console.log(key);
    return key;
 } 


function updateData(name,bool){
  update(name,bool);
 // console.log(h);
}

