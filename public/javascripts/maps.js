  var height, path, projection, states, svg, width, pl;
  var gsvg;

  var rsvg;

  var coord = [];
  var extentsx;
  var extentsy;
  var r = 3;
  var rMin = 2;
  var rMax = 20;

  var sgy = 100;
  var sgw = 250;
  var sgh = 600;

  var sgwb = 5;
  var sghb =50;
  var stY = [];

/////Circle Chart variables
var leftBord = 100;
var rightBord = 950;
var botBord = 650;
var topBord = 100;

var gshift =50;
var dNum = 100;

var stateMax;

var carr = ["#ffffcc","#ffeda0","#fc4e2a","#e31a1c","#b10026"];
//["#fed9a6","#b3cde3","#fccde5","#ccebc5","ffffcc","e5d8bd","#decbe4","#fbb4ae"];
  //['#8dd3c7','#ffffb3','#bebada','#80b1d3','#b3de69','#fccde5','#d9d9d9','#bc80bd','#ccebc5','#ffed6f','#fb8072','#fdb462']

///Legend Varibales
var legendCircles = [];

  cl = 10;
  for (var i =0; i<5; i++){
    if(i ==0){
      legendCircles.push(cl);
    }else{
      legendCircles.push(cl);
    }
    cl+=18;
  }

  tShift2 = 10;
  tShift1 = 10;

///

  var dRange=[];
  var interval= [];

  cLeft = 300;
  cTop = 75;
  cBot = 20;

  var name = "CONFPOP";

  states = d3.select('#map').append('svg').append("svg").attr("id", "states")
  .style("stroke","white")
  .style("stroke-width", ".5")
  .style("stroke-opacity", "0.4")
  .style("fill","#191716");


  width = parseInt(window.innerWidth);
  height = parseInt(window.innerHeight);

  //lw = 900;
  //lh = 550;

  jails = [];
  njails = [];

  svg = d3.select('svg')
  .attr("width", width)
  .attr("height", height);
 
  svg.append("g")
    .attr("transform", "translate(0,0)");

  rsvg = d3.select(".c")
  .append("svg")
  .attr("width", sgw)
  .attr("height",sgh)
  .style("overflow", "visible")
  .style("background-color","transparent");

    projection = d3.geoAlbers()
    .center([-3, 38.5])//-25
    .scale(1150)
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


    for(var i =0; i<45; i++){
      var t = d3.scaleLinear()
        .domain([0,45])
        .range([0,sgh-sghb])

      stY.push(t(i));
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

      if(key == "NCONPOP" || key == "UNCONV" ){
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

  function colorMap(color){//,dr){

    /*var normalize = d3.scaleLinear()
      .domain(dr)
      .range([0,1]);

      //console.log(normalize(color));

    var cscale = d3.interpolateYlOrRd(normalize(color));

    return cscale;*/
    var index = 0;
      while(index<carr.length){
        //console.log(interval+ "  " + color); 
        if(color<=interval[index]){
          c =index;
          //console.log(c);
        return carr[c];
       }
       if(color>interval[interval.length-1]){
        return carr[interval.length-1];
       }
       index++;
    }
}


var lsvg = d3.select(".l").append('svg')
      .attr("width",300)
      .attr("height", 30)
      .style("overflow", "visible")
      .style("background-color","transparent");


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
      .ticks(4)
      .tickSizeInner(-(sgh-sghb),0,0)
      .tickPadding(10);

      ////////////////////


      dRange = extents(data,key);
      //intervals of data to map colors to full range
      //console.log(dRange);
      interval = _.range(dRange[0],dRange[1], dRange[1]/carr.length);
  //console.log(dRange);

      var jailY = d3.scaleLinear()
        .domain(dRange)
        .range([botBord,topBord]);

      var jailsYAxis = d3.axisLeft(jailY)
      .ticks(20)
      .tickSizeInner(-rightBord+leftBord,0,0)
      .tickPadding([10]);

      /* Graph Axis information*/
      var jailX = d3.scaleLinear()
        .domain([0,10])
        .range([leftBord,rightBord])

      var jailsXAxis = d3.axisBottom(jailX)
      .ticks(0)

    if(chart){
        d3.selectAll('g.tick').remove().exit();
      svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + leftBord+ ",0)")
      .style("stroke", "#736F6E")
      .call(jailsYAxis);

      d3.selectAll('g.tick')
      .filter(function(d){ return d} )
      .select("line")
      .style("stroke","#736F6E")
      .style("opacity", .4);



      svg.selectAll(".axis")
      .style("stroke", "#736F6E")
      .call(jailsYAxis);

      svg.append("g")
      .attr("class", "axisx")
      .style("stroke","none")
      .attr("transform", "translate(0," + botBord+ ")")
      .call(jailsXAxis);

    }else{
      svg.selectAll(".axis")
      .style("stroke", "none");


      d3.selectAll('g.tick')
      .filter(function(d){ return d} )
      .style("opacity", 0);

      svg.selectAll(".axisx")
      .style("stroke", "none")
      .style("opacity",0);

    }


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

  d3.select(".statesTitle").transition().duration(1000)
    .style("opacity",1);

    var barPadding = 1;
    var barHeight = 6;
    var art = [0,30,40,70];

    //State Data ordered by current selection, by values
    //stateDataSorted = Object.keys(stateDataSet).sort(function(a,b){return stateDataSet[b]-stateDataSet[a]})
    
    //state Datta ordered by alphabetical order of states
    stateDataSorted = Object.keys(stateDataSet).sort();
    var statesY = d3.scaleOrdinal()
      .domain(stateDataSorted)
      .range(stY);

    var stateYAxis = d3.axisLeft(statesY)
        .ticks(45);


    var rects = rsvg.selectAll("rect").data(stateDataSorted);

    rects.enter()
    .append("rect")
    .attr("x", sgwb)
    .attr("y", function(d, i) {
      return i * ((sgh-sghb) / stateDataSorted.length);
    })
    .attr("width", 0)
    .attr("height", barHeight)
    .on("mouseover",function(d,i) {   
          div.transition()    
          .duration(200)    
          .style("opacity", .9)
    
          div.html( d+ "<br/>"  +stateDataSet[d] )  
          .style("left", (d3.event.pageX + 30) +"px")   
          .style("top", (d3.event.pageY - 28) + "px");
          
    });


    rsvg.selectAll("rect").transition().duration(1000)
    .attr("width", function(d,i){
      return stateScaleX(stateMax,stateDataSet[stateDataSorted[i]]);
    })
    .attr("height", barHeight)
    .style("fill","#EDC9AF")
    .style("opacity", .5);

    rects.exit().remove();

    rsvg.append("g")
    .attr("class","axisS")
    .attr("transform", "translate(0,"+ (botBord-sgy-5)+" )")
    .call(stateXAxis);

    rsvg.selectAll(".axisS")
    .style("stroke-width",.5)
    .call(stateXAxis);

    rsvg.append("g")
    .attr("class","axisSy")
    .style("stroke", "#736F6E")
    .attr("transform", "translate(0,3)")
    .call(stateYAxis);

    d3.selectAll('g.tick')
    .filter(function (d) { return d === 0;  })
    .remove();


      d3.selectAll('g.tick')
      .filter(function(d){ return d} )
      .select("line")
      .style("stroke",function(d,i){
        return "#736F6E";
      })
      .style("opacity", .5);

    rsvg.selectAll(".axisSy")
    .style("stroke","#736F6E")
    .style("stroke-width",.75)
    .call(stateYAxis);


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

             var t = d[name];
             //console.log(interval)
            d["color"] = colorMap(t);

            return d.color;
             //return (colorMap(t,dRange));

          })
        .style("opacity",.9)
         // .on("mouseover",over)
         .on("mouseout",out);


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
         
                console.log(rMap(data[i][key], dRange,key)+"   "+ data[i][key] +"  "+dRange);
               return rMap(data[i][key], dRange,key);
             }
           })
         .attr("cx", function (d,i){ 
          var xc;

        //**** Circle Graph Code
        if(chart){

          if(i <dNum){
            xc = gridScaleX(i)/*-gshift*/;
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
            var t = d[name];
             //console.log(interval)
            d["color"] = colorMap(t);

            return d.color;
          })
          .style("opacity",function(d,i){
            if(chart ){
              if(i<dNum){
               return .5;
             }else{
              return 0;
            }
          }else {
            return .9;
          }
        }).style("stroke","none")
          .style("z-index", 1);

        circles.exit().remove();

    d3.select("statesTitle")
    .style("color","#999999")
    .style("opacity", 1);





      var legend = lsvg.selectAll("circle").data(legendCircles);

        legend.enter().append("circle")
        .attr("r", 5)
        .attr("cy", 50)
        .attr("cx", function(d,i){
          return d;
        })
        .style("fill", function(d,i){

          var f = d3.scaleLinear()
            .domain([0,legendCircles.length])
            .range([0,1])


          var lc = d3.interpolateYlOrRd(f(i));

          return lc;
        }).style("stroke", "4px");
            //   stroke:#736F6E;
            
        if(!chart){

        d3.select(".lp")
          .style("opacity",1);

        lsvg.style('opacity',1);


        lsvg.selectAll('text').data(legendCircles)
          .enter().append('text')
          .attr("y", 70)
          .attr('x', function(d,i){
             
            if(i ==0){
              return (d-tShift1)
            }
            if(i == legendCircles.length-1){

              return (d-tShift2);
            }
          })
          .text(function(d,i){
             
            if(i ==0){
              return "Min";
            }
            if(i == legendCircles.length-1){

              return "Max";
            }
          })
          .style("fill","white")

          
        }else{
          lsvg.style('opacity',0);

          d3.select(".lp")
          .style("opacity",0);

        }
          
           

          /*}else{
            svg.select("axis")
              .stylye("opacity",0);
          }*/



/*
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

            var f = d3.scaleOrdinal(d3.schemeCategory10);

            graphX.domain(d3.extent(d3.merge(series), function(d) { return d.x; }));
            graphY.domain(d3.extent(d3.merge(series), function(d) { return d.y; }));

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
          if(chart){
    

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
          }
*/

/*******Circle + Line Graph*****//////

});
 // return key;



} 



function updateData(name,bool){
  update(name,bool);
 // console.log(h);
}

