import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const width = 500;
const height = 500;
const marginTop = 40;
const marginRight = 40;
const marginBottom = 40;
const marginLeft = 40;
const strokeWidth = 2;

const color1 = "#cf3759";
const color2 = "#4771b2";

export function plot(root, domainX, domainY, data1, data2, titleX, titleY) {
  const x = d3
    .scaleLinear()
    .domain(domainX)
    .range([marginLeft, width - marginRight]);

  const y = d3
    .scaleLinear()
    .domain(domainY)
    .range([height - marginBottom, marginTop]);

  const line = d3.line(
    (d) => x(d[0]),
    (d) => y(d[1])
  );

  function plotCurve(data, color, markerId, threshold = 0.3) {
    data = data.filter((_, i) => i % 3 == 0);

    const segments = [];
    {
      let j = 0; // start of current segment
      for (let i = 1; i < data.length; ++i) {
        if (
          Math.abs(data[i][0] - data[i - 1][0]) >
            threshold * (domainX[1] - domainX[0]) ||
          Math.abs(data2[i][1] - data2[i - 1][1]) >
            threshold * (domainY[1] - domainY[0])
        ) {
          segments.push(data.slice(j, i));
          j = i;
        }
      }
      if (j < data.length) {
        segments.push(data.slice(j));
      }
    }
    segments.forEach((segment) => {
      svg
        .append("path")
        .attr("d", line(segment))
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", strokeWidth)
        .attr("marker-mid", `url(#${markerId})`);
    });
  }

  const svg = d3.create("svg").attr("width", width).attr("height", height);

  svg
    .append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(x));

  svg
    .append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y));

  svg
    .append("text")
    .attr("text-anchor", "end")
    .attr("x", width - marginRight)
    .attr("y", height - 10)
    .text(titleX);

  svg
    .append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("y", marginLeft - 30)
    .attr("x", -marginTop)
    .text(titleY);

  plotCurve(data2, color2, "marker2");
  plotCurve(data1, color1, "marker1");

  root.parentElement.replaceChild(svg.node(), root);
}
