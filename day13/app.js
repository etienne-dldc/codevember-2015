var totalHeight = 500;
var totalWidth = d3.select("body")[0][0].clientWidth;
var waveSize = totalWidth / 15;
var speed = 500;
var rectWidth = waveSize*0.8;
var pointSize = 13;

var margin = {top: 0, right: 40, bottom: 0, left: 40},
    width =  totalWidth - margin.left - margin.right,
    height = totalHeight - margin.top - margin.bottom;

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var pointCounter = 3;
function newData () {
  var result = {
    line: random()*0.7 + 0.3,
    line2: random()*0.5 - 0.25,
    bar: Math.random()*0.8 + 0.2,
    point: false
  };
  if (result.line > 0.4) {
    pointCounter++;
    if (pointCounter > 3) {
      pointCounter = 0;
      result.point = true;
    }
  }
  return result;
}

var n = Math.floor(width / waveSize),
    random = d3.random.normal(0, .2),
    data = d3.range(n).map( function () { return newData() } );

var x = d3.scale.linear()
    .domain([0, n + 1])
    .range([0, width]);

var y = d3.scale.linear()
    .domain([-1, 1])
    .range([height, 0]);

var line = d3.svg.line()
    .x(function(d, i) { return x(i); })
    .y(function(d, i) { 
      return y(-0.5);
      return y(d.line);
    } )
    //.interpolate("basis");

svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

// Translate Group

  var translateGroup = svg.append("g")
        //.attr('clip-path', "url(#clip)")
        .append('g')
        .attr("transform", "translate(" + x(-0.5) + ",0)")

// Points

  var points = translateGroup.append('g').attr('class', "points").selectAll('circle').data(data);

  points.enter().append('circle')
      .interrupt()
      .attr('cx', function(d, i) { return x(i+0.5); } )
      .attr('cy', function(d, i) { return y(d.line); } )
      .attr('r', 0)
      .transition().duration(speed).ease('linear')
        .attr('r', function (d, i) {
          if (d.point == true) { return pointSize }
          return 0;
        });


// Rects
  var rects = translateGroup.append('g').selectAll('rect').data(data);

  rects.enter().append('rect')
      .interrupt()
      .attr('x', function(d, i) { return x(i); } )
      .attr('width', function(d, i) { return rectWidth; } )
      .attr('height', function (d, i) { return 0 })
      .attr('y', function(d, i) { return y(-0.5); })
      .style('fill', '#fff')
      .style('opacity', '0.5')
      .interrupt()
      .transition().duration(speed).ease('linear')
        .attr('y', function(d, i) { return y(-0.5) - y(d.bar); })
        .attr('height', function (d, i) { return y(d.bar) })
        .style('opacity', '0.5');

// Line 1

  var lineZero = d3.svg.line()
        .x(function(d, i) {
          return x(i+0.5);
        })
        .y(function(d, i) {
          return y(-0.5);
        })

  var lineStart = d3.svg.line()
        .x(function(d, i) {
          if (i == data.length-1) { return x(i-1+0.5) }
          return x(i+0.5);
        })
        .y(function(d, i) {
          if (i == data.length-1) { return y(data[i-1].line) }
          return y(d.line);
        })

  var lineEnd = d3.svg.line()
        .x(function(d, i) {
          if (i == 0) { return x(i+1+0.5) }
          return x(i+0.5);
        })
        .y(function(d, i) {
          if (i == 0) { return y(data[i+1].line) }
          return y(d.line);
        })
        
  var lines = translateGroup
        .append('path')
        .attr('stroke-width', '3px')
        .datum(data)

  lines
        .interrupt()
        .attr("d", lineZero )
        .transition()
        .attr("d", lineStart );

// Line 2

  var lineZero2 = d3.svg.line()
        .x(function(d, i) {
          return x(i+0.5);
        })
        .y(function(d, i) {
          return y(-0.5);
        })
        .interpolate('basis');

  var lineStart2 = d3.svg.line()
        .x(function(d, i) {
          if (i == data.length-1) { return x(i-1+0.5) }
          return x(i+0.5);
        })
        .y(function(d, i) {
          if (i == data.length-1) { return y(data[i-1].line2) }
          return y(d.line2);
        })
        .interpolate('basis');

  var lineEnd2 = d3.svg.line()
        .x(function(d, i) {
          if (i == 0) { return x(i+1+0.5) }
          return x(i+0.5);
        })
        .y(function(d, i) {
          if (i == 0) { return y(data[i+1].line2) }
          return y(d.line2);
        })
        .interpolate('basis');
      
  var lines2 = translateGroup
        .append('path')
        .attr('stroke-width', '2px')
        .datum(data);
  lines2
        .interrupt()
        .attr("d", lineZero2 )
        .transition().duration(speed).ease('linear')
        .attr("d", lineStart2 );


// Functions

function renderElems () {

  // Rects

  rects.data(data);
  
  rects
      .attr('width', function(d, i) { return rectWidth; } )
      .attr('height', function (d, i) { return y(d.bar) })
      .attr('y', function(d, i) { return y(-0.5) - y(d.bar); });

  rects.each(function(d,i){
    if (i == 0) {
      d3.select(this)
        .interrupt()
        .transition().duration(speed).ease('linear')
        .attr('height', function (d, i) { return y(1) })
        .attr('y', function(d, i) { return y(-0.5); });
    }
    if (i == rects.size()-1 ) {
      d3.select(this)
        .interrupt()
        .attr('height', function (d, i) { return y(1) })
        .attr('y', function(d, i) { return y(-0.5); })
        .transition().duration(speed).ease('linear')
        .attr('height', function (d, i) { return y(d.bar) })
        .attr('y', function(d, i) { return y(-0.5) - y(d.bar); });
    }
  });

  // Points

  points.data(data);
  
  points
      .attr('cx', function(d, i) { return x(i+0.5); } )
      .attr('cy', function(d, i) { return y(d.line); } )
      .attr('r', function (d, i) {
        if (d.point === true) { return pointSize; }
        return 0;
      });

  points.each(function(d,i){
    if (d.point == false) {
      return true;
    }
    if (i == 0) {
      d3.select(this)
        .interrupt()
        .transition().duration(speed).ease('linear')
        .attr('r', 0);
    }
    if (i == points.size()-1 ) {
      d3.select(this)
        .interrupt()
        .attr('r', 0)
        .transition().duration(speed).ease('linear')
        .attr('r', pointSize);
    }
  });

}



function renderLines () {

  lines
    .interrupt()
      .attr("d", lineStart )
    .transition().duration(speed).ease('linear')
      .attr("d", lineEnd );

  lines2
    .interrupt()
      .attr("d", lineStart2 )
    .transition()
    .duration(speed)
    .ease("linear")
      .attr("d", lineEnd2 );

}


function loop() {

  // pop the old data point off the front
  data.shift();
  // push a new data point onto the back
  data.push( newData() );

  renderElems();

  renderLines();

  translateGroup
    .interrupt()
      .attr("transform", "translate(" + x(0.5) + ",0)")
    .transition().duration(speed).ease('linear')
      .attr("transform", "translate(" + x(-0.5) + ",0)");

  window.setTimeout(function () {
    loop();
  }, speed+10);

}

window.setTimeout(function () {
  loop();
}, speed*1.5);
  
