// https://observablehq.com/@d3/double-click-brush-clear@103
export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# Double-Click to Brush

Double-click below to clear the brush, or if nothing is selected, to select everything.`
)});
  main.variable(observer("chart")).define("chart", ["d3","width","height","margin","rx","x","ry","xAxis"], function(d3,width,height,margin,rx,x,ry,xAxis)
{
  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height]);

  const brush = d3.brushX()
      .extent([[margin.left, margin.top], [width - margin.right, height - margin.bottom]])
      .on("start brush end", brushed);

  const circle = svg.append("g")
      .attr("fill-opacity", 0.2)
    .selectAll("circle")
    .data(Float64Array.from({length: 800}, rx))
    .join("circle")
      .attr("transform", d => `translate(${x(d)},${ry()})`)
      .attr("r", 3.5);

  svg.append("g")
      .call(xAxis);

  svg.append("g")
      .call(brush)
      .call(brush.move, [3, 5].map(x))
      .on("dblclick", dblclicked);

  function dblclicked() {
    const selection = d3.brushSelection(this) ? null : x.range();
    d3.select(this).call(brush.move, selection);
  }

  function brushed() {
    const selection = d3.event.selection;
    if (selection === null) {
      circle.attr("stroke", null);
    } else {
      const [x0, x1] = selection.map(x.invert);
      circle.attr("stroke", d => x0 <= d && d <= x1 ? "red" : null);
    }
  }

  return svg.node();
}
);
  main.variable(observer("xAxis")).define("xAxis", ["height","margin","d3","x"], function(height,margin,d3,x){return(
g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x))
)});
  main.variable(observer("x")).define("x", ["d3","margin","width"], function(d3,margin,width){return(
d3.scaleLinear([0, 10], [margin.left, width - margin.right])
)});
  main.variable(observer("rx")).define("rx", ["d3","x"], function(d3,x){return(
d3.randomUniform(...x.domain())
)});
  main.variable(observer("ry")).define("ry", ["d3","height"], function(d3,height){return(
d3.randomNormal(height / 2, height / 12)
)});
  main.variable(observer("margin")).define("margin", function(){return(
{top: 10, right: 20, bottom: 20, left: 20}
)});
  main.variable(observer("height")).define("height", function(){return(
120
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5")
)});
  return main;
}
