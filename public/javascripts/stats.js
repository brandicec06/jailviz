
var width = 500;
var height = 500;

var svg = d3.select(".stats").append("svg")
       .attr("width",  width)
       .attr("height", height);


      var dScale = d3.scaleLinear()
      .domain(bounds)
      .range([rMin, rMax])

d3.csv("./source/survey.csv", function(error,data){
    if(error) throw error;
	
	//var circles = d3.selectAll('circle').data(data)
	//circles.append('')

	var circles = svg.selectAll('circle').data([10,50,30]);

	circles.enter()
	.append('circle')
	.attr('cx', function(d){
		return d;
	})
	.attr('cy', function(d){
		return d;
	})
	.attr('r', function(d){
		return 10;
	})
	.style('fill',"red");

});