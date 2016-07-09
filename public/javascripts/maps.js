  var height, path, projection, states, svg, width, pl;

  var coord = [];
  var extentsx;
  var extentsy;
  var r = 3;
  var rMin = 3;
  var rMax = 30;

  var carr = ["#fed9a6","#b3cde3","#fccde5","#ccebc5","ffffcc","e5d8bd","#decbe4","#fbb4ae"];
  var dRange=[];
  var interval= [];

  cLeft = 300;
  cTop = 75;
  cBot = 20;

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

    path = d3.geoPath().projection(projection)

    var gpts = [];
    var gXp = 10;
    var gYp = 10;

    var gridScaleX = d3.scaleLinear()
    .domain([0,10])
    .range([cLeft,width-cLeft/2])

    var gridScaleY = d3.scaleLinear()
    .domain([0,10])
    .range([cTop,height-cBot]);


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
      .range([rMin, rMax])

      var sNum = dScale(num);

      return sNum;
    }

    rScale = d3.scaleLinear()
      .domain()


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

  function colorMap(color){

    if(color<interval[1]){
      c =0;
    }else if( color< interval[2]){
      c =1;
    }else if( color< interval[3]){
      c =2;
    }else if( color< interval[4]){
      c =3;
    }else if( color< interval[5]){
      c =4;
    }else if( color< interval[6]){
      c =5;
    }else{
      c=6;
    }
    return carr[c];
  }



  function update(key,chart){
    d3.csv("./source/survey.csv", function(error,data){
      if(error) throw error;

      for( p in data){
        var jx = data[p].LON;
        var jy = data[p].LAT;

        jails.push({jx,jy});
        
      }

      coordScale(jails);

      dRange = extents(data,key);
      interval = _.range(dRange[0],dRange[1], dRange[1]/carr.length);
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

      var ppts =[];
      var Gpoint = [];
      if(chart == true){
        states.selectAll("path").transition().duration(1000)
        .style("stroke-opacity", "0");
        gridPoints();
      }else{
        states.selectAll("path").transition().duration(1000)
        .style("stroke-opacity", "0.4");
      }

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
         // .on("mouseover",over)
         .on("mouseout",out)

         svg.selectAll("circle").on("mouseover",function(d,i) {   
          div.transition()    
          .duration(200)    
          .style("opacity", .9)
          div .html(d[key]+ "<br/>"  + d["CITY"])  
          .style("left", (d3.event.pageX + 30) +"px")   
          .style("top", (d3.event.pageY - 28) + "px")
          d3.selectAll("circle")
          .style('opacity',function(r,i){
               // console.log(match + '__' + colorMap(r[key],true))
               if(d.color != r.color){
                return .1;
              }else{
                return .6;
              }
            })

        })
         .on("mouseout", function(d) {   
          div.transition()    
          .duration(500)    
          .style("opacity", 0); 
          d3.selectAll("circle"). transition().duration(800)
          .style('opacity',function(d){
            return .5;
          })
        })
         .transition()
         .duration(2000);

         svg.selectAll("circle").transition().duration(1000)
         .attr("r", function(d,i){

              //console.log(rMap(data[i][key], dRange));
              return rMap(data[i][key], dRange,key);
            })
         .attr("cx", function (d,i){ 
          var xc;
          if(chart){
            if(i <100){
              points = [gpts[i]["x"],gpts[i]["y"]];
              xc = points[0]
            }else{
              xc = -100;
            }
          }else{
            points = projection([data[i].LON,data[i].LAT]);
            xc = points[0];
          }
            //console.log(points[0]);

            return xc;
          })
         .attr("cy", function (d,i){ 

          if(chart){
            var yc;
            if(i <100){
              points = [gpts[i]["x"],gpts[i]["y"]];
              yc = points[1]
                //console.log(points);
              }else{
                yc = -100;
              }
            }else{
              points = projection([data[i].LON,data[i].LAT]);
              yc = points[1]
            }
            return yc;
          }).style("fill", function(d,i){
            //console.log(d.name)
            var t = d[key];
            d["color"] = colorMap(t);
            return colorMap(t);
          })
          .style("opacity",function(d,i){
            if(chart ){
              if(i<100){
               return .5;
             }else{
              return 0;
            }
          }else {
            return .5;
          }
        });
          circles.exit().remove();
        });
  return key;
} 


function updateData(name,bool){
  update(name,bool);
 // console.log(h);
}

