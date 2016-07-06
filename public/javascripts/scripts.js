$(document).ready(function(data){

  (function(d3) {
  'use strict';

    var margin = {
      top: 100,
      bottom: 100,
      left: 100,
      right: 100,
    },
    width= 960 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom,
    radius = Math.min(width,height)/2;

    var color = d3.scaleOrdinal(d3.schemeCategory20);


    var tooltip = d3.select('#layout')            // NEW
      .append('div')                             // NEW
      .attr('class', 'tooltip');                 // NEW

    tooltip.append('div')                        // NEW
      .attr('class', 'label');                   // NEW

    tooltip.append('div')                        // NEW
      .attr('class', 'count');                   // NEW

    tooltip.append('div')                        // NEW
      .attr('class', 'percent');                 // NEW


    var dset =[];
    d3.csv("source/survey.csv", function(error,data){
      if(error) throw error;


      for(var i =0; i<20; i++){
        dset.push(data[i]);
      }

    var dataset = dset;

    dataset.forEach(function(d){
      d.count = +d.CONFPOP;
      d.enabled = true;
    })

    var legendRectSize = 18;
    var legendSpacing = 4;

    var width = 600;
    var height = 600;
    var radius = Math.min(width, height) / 2;
    var donutWidth = 50;



    var sc = d3.scaleLinear()
      .domain([0,20000])
      .range([0,100]);

    var svg = d3.select('#layout')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(' + (width / 2) +
        ',' + (height / 2) + ')');

    var arc = d3.arc()
      .innerRadius(radius - donutWidth)             // NEW
      .outerRadius(radius);

    var pie = d3.pie()
      .value(function(d) { return sc(d.CONFPOP); })
      .sort(null);

    var path = svg.selectAll('path')
      .data(pie(dataset))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', function(d, i) {
        return color(d.data.COUNTY);
      })
      .each(function(d){this._current = d});

    path.on('mouseover',function(d){
      var total = d3.sum(dataset.map(function(d) {
        return (d.enabled) ? d.length : 0;
      }));
      var percent = Math.round(1000 * d.data.CONFPOP / total) / 10;
      tooltip.select('.label').html(d.data.COUNTY);
      tooltip.select('.count').html(d.data.CONFPOP);
      tooltip.select('.percent').html(percent + '%');
      tooltip.style('display', 'block');
    });

    path.on('mouseout',function(d){
      tooltip.style('display', 'none');
    });

    var legend = svg.selectAll('.legend')
      .data(color.domain())
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('transform', function(d, i) {
        var height = legendRectSize + legendSpacing;
        var offset =  height * color.domain().length / 2;
        var horz = -2 * legendRectSize;
        var vert = i * height - offset;
        return 'translate(' + horz + ',' + vert + ')';
      });

    legend.append('rect')
      .attr('width', legendRectSize)
      .attr('height', legendRectSize)
      .style('fill', color)
      .style('stroke', color)
      .on('click', function(label){
        var rect = d3.select(this);
        var enabled = true;
        var totalEnabled = d3.sum(dataset.map(function(d) {
          return (d.enabled) ? 1 : 0;
        }));

        if (rect.attr('class') === 'disabled') {
          rect.attr('class', '');
        } else {
          if (totalEnabled < 2) return;
          rect.attr('class', 'disabled');
          enabled = false;
        }

        pie.value(function(d) {
          if (d.COUNTY === label) d.enabled = enabled;
          return (d.enabled) ? d.count : 0;
        });

        path = path.data(pie(dataset));

        path.transition()
          .duration(750)
          .attrTween('d', function(d) {
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
              return arc(interpolate(t));
            };
          });
      });

    legend.append('text')
      .attr('x', legendRectSize + legendSpacing)
      .attr('y', legendRectSize - legendSpacing)
      .text(function(d) { return d; });

  });//end of csv import

  })(window.d3);

  /*  var sq = d3.select("body").append("rect")
      .attr("x",60)
      .attr("y",60)
      .attr("width",100)
      .attr("height",100)
      */

    function printData(d){
      for(var j in d){
        //console.log(d[j]["CONFPOP"]);
      }
    }

});
