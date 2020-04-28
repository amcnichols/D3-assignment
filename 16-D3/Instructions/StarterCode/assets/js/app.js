var svgWidth = 750;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("../assets/data/data.csv").then(function(importData){
  
            
    importData.forEach(function (importData){
        importData.healthcare= +importData.healthcare;
        importData.poverty= +importData.poverty;
    })
var xLinearScale = d3.scaleLinear()
      .domain([0, d3.max(importData, d => d.poverty)])
      .range([0, width]);

var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(importData, d => d.healthcare)])
      .range([height, 0]);

var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);
  
chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

chartGroup.append("g")
      .call(leftAxis);
    
      var circlesGroup = chartGroup.selectAll("circle")
      .data(importData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("r", "15")
      .attr("fill", "blue")
      .attr("opacity", ".5")
      .classed("stateCircle", true);

      var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 40})`);

  var povertyLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "povertyLabel") 
    .classed("active", true)
    .text("Poverty ");
   
    var healthLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "num_albums") 
    .classed("inactive", true)
    .text("");
   
    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Healthcare");
    
    var circleLabels = chartGroup.selectAll(null).data(importData).enter().append("text");

    circleLabels
      .attr("x", function(d) {
        return xLinearScale(d.poverty);
      })
      .attr("y", function(d) {
        return yLinearScale(d.healthcare);
      })
      .text(function(d) {
        return d.abbr;
      })
      .attr("font-family", "sans-serif")
      .attr("font-size", "10px")
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .on("mouseover", function(d) {
          toolTip.show(d);
      })
      var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([-10, 30])
      .html(function(d) {
        return (`${d.abbr}<br>poverty (%): ${d.poverty}<br>healthcare: ${d.healthcare}`);
        
      });
      chartGroup.call(toolTip);
      circlesGroup.on("click", function(d) {
        toolTip.show(d);
    })
    .on("mouseout", function(d, i) {
        toolTip.hide(d);
        
      });

  });

    
