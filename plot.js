import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { clamp } from "./utils.js";

const width = 500;
const height = 500;
const marginTop = 50;
const marginRight = 50;
const marginBottom = 50;
const marginLeft = 50;
const strokeWidth = 2;

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

  function plotCurve(data, markerId, threshold = 0.3) {
    data = data.filter((_, i) => i % 2 == 0);
    if (!data.length) return;

    const segments = [];
    {
      let j = 0; // start of current segment
      for (let i = 1; i < data.length; ++i) {
        if (
          Math.abs(data[i][0] - data[i - 1][0]) >
            threshold * (domainX[1] - domainX[0]) ||
          Math.abs(data[i][1] - data[i - 1][1]) >
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
        .attr("stroke", "none")
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

  plotCurve(data1, "marker1");
  plotCurve(data2, "marker2");

  root.parentElement.replaceChild(svg.node(), root);
}

export function drawBackground(canvas, xRange, yRange, color, isValid) {
  canvas.width = xRange[1] - xRange[0] + 1;
  canvas.height = yRange[1] - yRange[0] + 1;
  const ctx = canvas.getContext("2d");
  const imageData = new ImageData(canvas.width, canvas.height);
  for (let y = yRange[1]; y >= yRange[0]; --y) {
    for (let x = xRange[0]; x <= xRange[1]; ++x) {
      const i = 4 * ((yRange[1] - y) * canvas.width + (x - xRange[0]));
      const { r, g, b } = d3.rgb(color(x, y));
      const isRGB = isValid(x, y);
      imageData.data[i + 0] = clamp(r | 0, 0, 255) * (isRGB ? 1 : 0.5);
      imageData.data[i + 1] = clamp(g | 0, 0, 255) * (isRGB ? 1 : 0.5);
      imageData.data[i + 2] = clamp(b | 0, 0, 255) * (isRGB ? 1 : 0.5);
      imageData.data[i + 3] = 255;
    }
  }
  ctx.putImageData(imageData, 0, 0);
}
