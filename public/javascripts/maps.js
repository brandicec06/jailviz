  var height, path, projection, states, svg, width, pl;
  var gsvg;

  var rsvg;

  var coord = [];
  var extentsx;
  var extentsy;
  var r = 3;
  var rMin = 3;
  var rMax = 30;

  var sgw = 250;
  var sgh = 550;

  var sgwb = 15;
  var sghb =50;
/////Circle Chart variables
var leftBord = 100;
var rightBord = 950;
var botBord = 600;
var topBord = 50;

var dNum = 50;

var stateMax;

var carr = ["#fed9a6","#b3cde3","#fccde5","#ccebc5","ffffcc","e5d8bd","#decbe4","#fbb4ae"];
  //['#8dd3c7','#ffffb3','#bebada','#80b1d3','#b3de69','#fccde5','#d9d9d9','#bc80bd','#ccebc5','#ffed6f','#fb8072','#fdb462']

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

  //lw = 900;
  //lh = 550;

  jails = [];
  njails = [];

  svg = d3.select('svg')
  .attr("width", width)
  .attr("height", height)
  .append("g");

  rsvg = d3.select(".c")
  .append("svg")
  .attr("width", sgw)
  .attr("height",sgh);

  /*lsvg = d3.select('svg')
    .append('svg')
    .attr("width",lw)
    .attr("height",lh)*/



    projection = d3.geoAlbers()
    .center([-4, 37])//-25
    .scale(1200)
    .translate([width / 3, height / 2]);

    extentsx = projection.invert([0,0]);
    extentsy = projection.invert([width,height]);

    path = d3.geoPath().projection(projection)

    var gpts = [];
    var gXp = 10;
    var gYp = 10;

    //Secondary Chart Scales
    var gridScaleX = d3.scaleLinear()
    .domain([0,dNum])
    .range([leftBord,rightBord]);


    //State Graph Scale
    function stateScaleX (m,d){
      var temp = d3.scaleLinear()
      .domain([0,m])
      .range([sgwb,sgw-sgwb]);
      var dataMax = temp(d);

      return dataMax;
    };


    d3.json("./source/nstates.json", function(collection) { 


      for( var p in collection.features){
       var x = collection.features[p].properties.longitude;
       var y = collection.features[p].properties.latitude;

       coord.push({x,y});

     }  

     states.selectAll("path").data(collection.features).enter().append("svg:path")
     .attr("d", path)
     .append("svg:title")
     /*.text(function(d) {
      return d.properties.name;
    })*/;

  });



    function coordScale(pts){
      for(i in pts){
        njails.push(projection([pts[i].jx,pts[i].jy]));
      } 
    }

    function yMap(num,bounds){

      var gridScaleY = d3.scaleLinear()
      .domain(bounds)
      .range([botBord,topBord]);

      var y = gridScaleY(num);

      return y;
    }


    function rMap(num,bounds, key,chart){
      var sNum;

      if(key == "NCONPOP" || key == "UNCONV" || key == "BLACK"){
        var nBound = [0,20000];
        bounds = nBound;
      }

      var dScale = d3.scaleLinear()
      .domain(bounds)
      .range([rMin, rMax])

      if(chart){
        sNum = yMap(num,bounds);
      }else{
        sNum = dScale(num);
      }

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


  function stateDataX(){
  /*var sdX = d3.scaleLinear().
  domain([]).*/
}


function update(key,chart){
  d3.csv("./source/survey.csv", function(error,data){
    if(error) throw error;

    for( p in data){
      var jx = data[p].LON;
      var jy = data[p].LAT;

      jails.push({jx,jy});

    }

      //sorted object according to current key
      ldata = _.sortBy(data, key);

      coordScale(jails);


      //Get State totals for currently selected data title
      var stateDataSet = _.countBy(data,"STATE");
      for(v in stateDataSet){
        stateDataSet[v] = 0;
      }

      var stateDataKeys = _.pluck(data, "STATE");
      var statePopKeys = _.pluck(data, key);
      var stateData = [];
      for(var i =0; i<stateDataKeys.length;i++){
        var s =stateDataKeys[i];
        var n = statePopKeys[i];
        var obj = {s,n};

        stateData.push(obj);
      }
      for(var i =0; i<stateDataKeys.length; i++){
        stateDataSet[stateData[i].s]+=(+stateData[i].n);
      }

      stateMax = _.max(stateDataSet);
      //duplicate local function
      var stateScale = d3.scaleLinear()
      .domain([0,stateMax])
      .range([sgwb,sgw-sgwb]);

      var stateXAxis = d3.axisBottom(stateScale)
      .ticks(4);

      ////////////////////


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


//Create SVG rectangles for state graph element

var barPadding = 1;
var barHeight = 6;

stateDataSorted = Object.keys(stateDataSet).sort(function(a,b){return stateDataSet[b]-stateDataSet[a]})



var rects = rsvg.selectAll("rect").data(stateDataSorted);

rects.enter()
.append("rect")
.attr("x", sgwb)
.attr("y", function(d, i) {
  return i * ((sgh-sghb) / stateDataSorted.length);
})
.attr("width", 0)
.attr("height", barHeight)


rsvg.selectAll("rect").transition().duration(1000)
.attr("width", function(d,i){
  return stateScaleX(stateMax,stateDataSet[stateDataSorted[i]]);
})
.attr("height", barHeight)
.style("fill","#EDC9AF")
.style("opacity", .5);

rects.exit().remove();

rsvg.append("g")
.attr("class","axis")
.attr("transform", "translate(0,500)")
.call(stateXAxis);

rsvg.selectAll(".axis").call(stateXAxis);



/////
var points;
var pr;
var circles = svg.selectAll("circle").data(data);
var c;

var ppts =[];
var Gpoint = [];
if(chart == true){
  states.selectAll("path").transition().duration(1000)
  .style("stroke-opacity", "0");
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
            d["color"] = colorMap(t);

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
          div .html(d[key]+ "<br/>"  + d["FACILITY"])  
          .style("left", (d3.event.pageX + 30) +"px")   
          .style("top", (d3.event.pageY - 28) + "px")
          d3.selectAll("circle")
          .style('opacity',function(r,j){
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
              if(chart){
                return 4
              }else{
               return rMap(data[i][key], dRange,key);
             }
           })
         .attr("cx", function (d,i){ 
          var xc;

        //**** Circle Graph Code
        if(chart){

          if(i <dNum){
            xc = gridScaleX(i);
          }else{
            xc = -dNum;
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
            if(i <dNum){
              yc= rMap(data[i][key], dRange, key,chart);
                //console.log(points);
              }else{
                yc = -dNum;
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
              if(i<dNum){
               return .5;
             }else{
              return 0;
            }
          }else {
            return .5;
          }
        });



          /*if(chart && key == "CONFPOP"){

            var series = []
            var keyS1 = "CONV";
            var convP = _.pluck(data,keyS1);
            var convPts = [];
            for(var i =0; i<dNum; i++){
              convPts.push({"x":gridScaleX(i),"y":rMap(convP[i], extents(data,key), keyS1,chart)});
            }

            var keyS2 = "UNCONV"
            var unconvP = _.pluck(data,keyS2);
            var unconvPts = [];
            for(var i =0; i<dNum; i++){
              //unconvPts.push({"x":gridScaleX(i),"y":rMap(data[i][key], dRange, key,chart)});
              unconvPts.push({"x":gridScaleX(i),"y":rMap(unconvP[i], extents(data,key), keyS2,chart)});
            }

            series.push(convPts);
            series.push(unconvPts);
            //console.log(series);

            var graphX = d3.scaleLinear()
            .range([leftBord,rightBord]);

            var graphY = d3.scaleLinear()
            .range([botBord,topBord]);

            //var f = d3.scaleOrdinal(d3.schemeCategory10);

            //graphX.domain(d3.extent(d3.merge(series), function(d) { return d.x; }));
            //graphY.domain(d3.extent(d3.merge(series), function(d) { return d.y; }));

            var colours = ["red","green"];
            svg.selectAll(".series")
            .data(series)
            .enter().append("g")
            .attr("class", "series")
            .style("fill", function(d, i) { return colours[i]; })
            .selectAll(".point")
            .data(function(d) { console.log(d);return d; })
            .enter().append("circle")
            .attr("class", "point")
            .attr("r", 2.5)
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; })      

            svg.selectAll(".series")
            .style("fill", function(d, i) { return colours[i]; })
            .selectAll(".point")
            .data(function(d) { console.log(d);return d; })
            .enter().append("circle")
            .attr("class", "point")
            .attr("r", 2.5)
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
          }else{
            svg.selectAll(".series")
            .style("fill", function(d, i) { return 0 })
            .selectAll(".point")
            .data(function(d) { console.log(d);return d; })
            .enter().append("circle")
            .attr("class", "point")
            .attr("r", 2.5)
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
          }*/

          circles.exit().remove();

/*******Circle + Line Graph*****//////




});
 // return key;



} 



function updateData(name,bool){
  update(name,bool);
 // console.log(h);
}

