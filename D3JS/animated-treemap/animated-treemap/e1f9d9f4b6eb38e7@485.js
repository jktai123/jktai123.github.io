// https://observablehq.com/@d3/animated-treemap@485
import define1 from "./450051d7f1174df8@252.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["census-regions.csv",new URL("./files/5b9c7bae66b39d0cf633607b7e984064ba0f5300b74a157724fc5c5393268927d667bb69319dc7122f660786411b6599167101662fcd0ddf90895814707e6608",import.meta.url)],["population.tsv",new URL("./files/2917384d5b3890d62715d46d1ce13c242b26c4b78ac2300859112842c1e251af820a09d160a4b7cfa323dc82b863e738bdf58e08eb4cffe640c7b4bbc3e25a85",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`# Animated Treemap

This [treemap](/@d3/treemap) of U.S. population uses [d3.treemapResquarify](https://github.com/d3/d3-hierarchy/blob/master/README.md#treemapResquarify) for a stable layout with changing node values. Data: [U.S. Census Bureau](https://www.census.gov/population/www/censusdata/pop1790-1990.html)`
)});
  main.variable(observer("viewof index")).define("viewof index", ["Scrubber","d3","data","duration"], function(Scrubber,d3,data,duration){return(
Scrubber(d3.range(data.keys.length), {
  delay: duration,
  loop: false,
  format: i => data.keys[i]
})
)});
  main.variable(observer("index")).define("index", ["Generators", "viewof index"], (G, _) => G.input(_));
  main.variable(observer("chart")).define("chart", ["d3","width","height","data","max","viewof index","formatNumber","DOM","color","duration","parseNumber"], function(d3,width,height,data,max,$0,formatNumber,DOM,color,duration,parseNumber)
{
  const treemap = d3.treemap()
      .tile(d3.treemapResquarify)
      .size([width, height])
      .padding(d => d.height === 1 ? 1 : 0)
      .round(true);

  // Compute the structure using the average value.
  const root = treemap(d3.hierarchy(data.group)
      .sum(d => Array.isArray(d.values) ? d3.sum(d.values) : 0)
      .sort((a, b) => b.value - a.value));

  const svg = d3.create("svg")
      .attr("viewBox", `0 -20 ${width} ${height + 20}`)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .style("overflow", "visible");

  const box = svg.append("g")
    .selectAll("g")
    .data(data.keys.map((key, i) => {
      const value = root.sum(d => d.values[i]).value;
      return {key, value, i, k: Math.sqrt(value / max)};
    }).reverse())
    .join("g")
      .attr("transform", ({k}) => `translate(${(1 - k) / 2 * width},${(1 - k) / 2 * height})`)
      .attr("opacity", ({i}) => i >= $0.value ? 1 : 0)
      .call(g => g.append("text")
          .attr("y", -6)
          .attr("fill", "#777")
        .selectAll("tspan")
        .data(({key, value}) => [key, ` ${formatNumber(value)}`])
        .join("tspan")
          .attr("font-weight", (d, i) => i === 0 ? "bold" : null)
          .text(d => d))
      .call(g => g.append("rect")
          .attr("fill", "none")
          .attr("stroke", "#ccc")
          .attr("width", ({k}) => k * width)
          .attr("height", ({k}) => k * height));

  const leaf = svg.append("g")
    .selectAll("g")
    .data(layout($0.value))
    .join("g")
      .attr("transform", d => `translate(${d.x0},${d.y0})`);

  leaf.append("rect")
      .attr("id", d => (d.leafUid = DOM.uid("leaf")).id)
      .attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d.data[0]); })
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0);

  leaf.append("clipPath")
      .attr("id", d => (d.clipUid = DOM.uid("clip")).id)
    .append("use")
      .attr("xlink:href", d => d.leafUid.href);

  leaf.append("text")
      .attr("clip-path", d => d.clipUid)
    .selectAll("tspan")
    .data(d => [d.data.name, formatNumber(d.value)])
    .join("tspan")
      .attr("x", 3)
      .attr("y", (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`)
      .attr("fill-opacity", (d, i, nodes) => i === nodes.length - 1 ? 0.7 : null)
      .text(d => d);

  leaf.append("title")
      .text(d => d.data.name);

  function layout(index) {
    const k = Math.sqrt(root.sum(d => d.values[index]).value / max);
    const x = (1 - k) / 2 * width;
    const y = (1 - k) / 2 * height;
    return treemap.size([width * k, height * k])(root)
      .each(d => (d.x0 += x, d.x1 += x, d.y0 += y, d.y1 += y))
      .leaves();
  }

  return Object.assign(svg.node(), {
    update(index) {
      box.transition()
          .duration(duration)
          .attr("opacity", ({i}) => i >= index ? 1 : 0);

      leaf.data(layout(index)).transition()
          .duration(duration)
          .ease(d3.easeLinear)
          .attr("transform", d => `translate(${d.x0},${d.y0})`)
          .call(leaf => leaf.select("rect")
              .attr("width", d => d.x1 - d.x0)
              .attr("height", d => d.y1 - d.y0))
          .call(leaf => leaf.select("text tspan:last-child")
              .tween("text", function(d) {
                const i = d3.interpolate(parseNumber(this.textContent), d.value);
                return function(t) { this.textContent = formatNumber(i(t)); };
              }));
    }
  });
}
);
  main.variable(observer("update")).define("update", ["chart","index"], function(chart,index){return(
chart.update(index)
)});
  main.variable(observer("duration")).define("duration", function(){return(
2500
)});
  main.variable(observer("parseNumber")).define("parseNumber", function(){return(
string => +string.replace(/,/g, "")
)});
  main.variable(observer("formatNumber")).define("formatNumber", ["d3"], function(d3){return(
d3.format(",d")
)});
  main.variable(observer("sums")).define("sums", ["data","d3"], function(data,d3){return(
data.keys.map((d, i) => d3.hierarchy(data.group).sum(d => d.values[i]).value)
)});
  main.variable(observer("max")).define("max", ["d3","sums"], function(d3,sums){return(
d3.max(sums)
)});
  main.variable(observer("color")).define("color", ["d3","data"], function(d3,data){return(
d3.scaleOrdinal(data.group.keys(), d3.schemeCategory10.map(d => d3.interpolateRgb(d, "white")(0.5)))
)});
  main.variable(observer("data")).define("data", ["d3","FileAttachment"], async function(d3,FileAttachment)
{
  const keys = d3.range(1790, 2000, 10);
  const [regions, states] = await Promise.all([
    FileAttachment("census-regions.csv").text(),
    FileAttachment("population.tsv").text()
  ]).then(([regions, states]) => [
    d3.csvParse(regions),
    d3.tsvParse(states, (d, i) => i === 0 ? null : ({name: d[""], values: keys.map(key => +d[key].replace(/,/g, ""))}))
  ]);
  const regionByState = new Map(regions.map(d => [d.State, d.Region]));
  const divisionByState = new Map(regions.map(d => [d.State, d.Division]));
  return {keys, group: d3.group(states, d => regionByState.get(d.name), d => divisionByState.get(d.name))};
}
);
  main.variable(observer("width")).define("width", function(){return(
954
)});
  main.variable(observer("height")).define("height", ["width"], function(width){return(
width
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@6")
)});
  const child1 = runtime.module(define1);
  main.import("Scrubber", child1);
  return main;
}
