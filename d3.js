import * as d3 from 'd3';

const data = [
  { age: "18–29", value: 41 },
  { age: "30–49", value: 46 },
  { age: "50–64", value: 25 },
  { age: "65+", value: 13 }
];

function drawChart() {
  const container = d3.select("#chart");
  container.selectAll("svg").remove(); // clear old chart

  // Clamp minimum width at 560px
  let width = container.node().getBoundingClientRect().width;
  if (width < 560) width = 560;

  const height = 320;
  const margin = { top: 50, right: 20, bottom: 40, left: 50 };

  const svg = container.append("svg")
    .attr("width", "100%")
    .attr("height", height)
    .attr("viewBox", `0 0 ${width} ${height}`)
    .style("background", "transparent");

  // --- Pattern for diagonal stripes ---
  const defs = svg.append("defs");
  defs.append("pattern")
    .attr("id", "diagonal-stripes")
    .attr("patternUnits", "userSpaceOnUse")
    .attr("width", 12)
    .attr("height", 12)
    .append("path")
    .attr("d", "M-3,3 l6,-6 M0,12 l12,-12 M9,15 l6,-6")
    .attr("stroke", "var(--lower-emphasis)")
    .attr("stroke-width", 3);

  // --- Scales ---
  const x = d3.scaleBand()
    .domain(data.map(d => d.age))
    .range([margin.left, width - margin.right])
    .padding(0.2);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value)])
    .nice()
    .range([height - margin.bottom, margin.top]);

 // --- Bars ---
svg.selectAll("rect")
  .data(data)
  .enter().append("rect")
  .attr("x", d => x(d.age))
  .attr("y", d => y(d.value))
  .attr("width", x.bandwidth())
  .attr("height", d => y(0) - y(d.value))
  .attr("fill", "url(#diagonal-stripes)");

// --- Labels above bars ---
svg.selectAll(".bar-label")
  .data(data)
  .enter().append("text")
  .attr("class", "bar-label")
  .attr("x", d => x(d.age) + x.bandwidth() / 2)
  .attr("y", d => y(d.value) - 6) // 6px above the bar
  .attr("text-anchor", "middle")
  .attr("fill", "var(--foreground)")
  .style("font-family", "geist")
  .style("font-size", window.innerWidth < 1200 ? "18px" : "14px")
  .text(d => d.value + "%");

  // --- Axes ---
  const fontSize = window.innerWidth < 1200 ? "18px" : "14px";
  const titleSize = window.innerWidth < 1200 ? "22px" : "18px";

  const xAxis = svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x));

  xAxis.selectAll("text")
    .attr("fill", "var(--foreground)")
    .style("font-family", "geist")
    .style("font-size", fontSize);

  xAxis.select(".domain").remove();

  const yAxis = svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(5).tickFormat(d => d + "%"));

  yAxis.selectAll("text")
    .attr("fill", "var(--foreground)")
    .style("font-family", "geist")
    .style("font-size", fontSize);

  yAxis.selectAll(".domain, .tick line")
    .attr("stroke", "var(--foreground)")
    .attr("opacity", 0.5);

  // --- Title ---
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", margin.top / 2)
    .attr("text-anchor", "middle")
    .attr("fill", "var(--foreground)")
    .style("font-family", "geist")
    .style("font-size", titleSize)
    .style("font-weight", "600")
    .text("Age likeliness to have a tattoo");
}

// --- Initial render ---
drawChart();

// --- Re-render on resize (with a floor at 560px) ---
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (window.innerWidth >= 560) {
      drawChart(); // re-render only above 560px
    }
  }, 25);
});
