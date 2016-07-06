$(document).ready(function(){

    var width = 600;
    var height = 600;

    var myArrayOfObjects = [
      { x: 100, y: 100},
      { x: 130, y: 120},
      { x: 80 , y: 180},
      { x: 180, y: 80 },
      { x: 180, y: 40 }
    ];


    var scale = d3.scaleLinear()
      .domain([0,180])
      .range([0,width]);

    var svg = d3.select("body").append("svg")
          .attr("width",  width)
          .attr("height", height);

    function render(data){
          // Bind data
          var circles = svg.selectAll("circle").data(data);

          // Enter
            circles.enter().append("circle")
            .attr("r", 10).attr("cx", function (d,i){ return d.x; })
            .attr("cy", function (d,i){ return d.y; });

            // Exit
            circles.exit().remove();
    };

    $('#b').on('click',function update(myArrayOfObjects){
      var circles = svg.selectAll("circle").data(myArrayOfObjects);

      // Enter
        circles.enter().append("circle")
        .attr("r", 10).attr("cx", function (d,i){ return scale(d.x); })
        .attr("cy", function (d,i){ return scale(d.y); });

        // Exit
        circles.exit().remove();
    });


    render(myArrayOfObjects);

});
