import React, { useRef, useEffect, useMemo, useState } from 'react';
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  select,
  drag,
  event,
  scaleLinear,
  extent,
  forceCollide,
} from 'd3';
import './GraphLayout.css';
import { NodeTooltip } from './NodeTooltip';

export const clamp = (value, min, max) =>
  value >= max ? max : value <= min ? min : value;

const enterLink = (selection, scale) => {
  selection
    .attr('class', 'link')
    .attr('stroke-width', (d) => scale(d.coappearances))
    .on('mouseover', (d, i, all) =>
      handleLinkMouseOver(d, select(all[i]), scale)
    )
    .on('mouseout', (d, i, all) =>
      handleLinkMouseOut(d, select(all[i]), scale)
    );
};

function handleLinkMouseOver(d, selection, scale) {
  selection.attr('stroke-width', 2 * scale(d.coappearances));
}

function handleLinkMouseOut(d, selection, scale) {
  selection.attr('stroke-width', scale(d.coappearances));
}

const enterNode = (selection, r, simulation, clipPositions, setToolTip) => {
  selection.append('circle').attr('r', r);

  selection
    .attr('class', 'node')
    .call(
      drag()
        .on('start', (d) => dragStart(d, simulation))
        .on('drag', (d) => dragOn(d, clipPositions))
        .on('end', (d) => dragEnd(d, simulation))
    )
    .on('mouseenter', d => {
      setToolTip({text: d.name, index: d.index, left: `${d.x}px`, top:`${d.y}px`})
      // setToolTip({text: d.name, index: d.index, left: `${event.pageX}px`, top:`${d.y}px`})
    })
    .on('mouseout', () => setToolTip({}));
};

const dragStart = (d, simulation) => {
  if (!event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
};

const dragOn = (d, clipPositions) => {
  const [x, y] = clipPositions(event.x, event.y);
  d.fx = x;
  d.fy = y;
};

const dragEnd = (d, simulation) => {
  if (!event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
};

const updateLinks = (selection) => {
  selection
    .attr('x1', (d) => d.source.x)
    .attr('y1', (d) => d.source.y)
    .attr('x2', (d) => d.target.x)
    .attr('y2', (d) => d.target.y);
};

const updateNodes = (selection) => {
  selection.attr('transform', (d) => `translate(${d.x}, ${d.y})`);
};

const updateTooltip = (selection, setToolTip) => {
  setToolTip(tooltip => {
    const index = tooltip?.index;
    if (!index) return
    const {x, y} = selection.data().filter(d => d.index===index)[0];
    const out = Object.assign(tooltip, {text: 'asd', left: `${x}px`, top:`${y}px`});
    return out;
  });
};

const updateGraph = (selection, setToolTip) => {
  selection.selectAll('.link').call(updateLinks);
  selection.selectAll('.node').call(updateNodes).call(updateTooltip, setToolTip);
};

export const GraphLayout = ({ nodes, links, width, height }) => {
  const ref = useRef();
  const [tooltip, setToolTip] = useState({});
  const r = 10;

  const simulation = useMemo(() => {
    return forceSimulation()
      .force('links', forceLink())
      .force('charge', forceManyBody())
      .force('collide', forceCollide(r))
      .force('center', forceCenter());
  }, []);

  useEffect(() => {
    simulation
      .force('center')
      .x(width / 2)
      .y(height / 2);
    simulation.on('tick', () => select(ref.current).call(updateGraph, setToolTip));
    console.log('update center');
  }, [width, height, simulation]);

  useEffect(() => {
    const svg = select(ref.current);
    const linksExtent = extent(links.map((d) => d.coappearances));
    const scaleLinkWidth = scaleLinear().domain(linksExtent).range([2, 6]);
    const scaleLinkDistance = scaleLinear()
      .domain(linksExtent)
      .range([20, 200]);

    simulation.nodes(nodes);
    simulation
      .force('links')
      .links(links)
      .distance((d) => scaleLinkDistance(d.coappearances));

    // Links
    svg
      .selectAll('.link')
      .data(links, (d) => d.index)
      .join((enter) => enter.append('line').call(enterLink, scaleLinkWidth))
      .call(updateLinks);

    // Nodes
    const clipPositions = (x, y) => [
      clamp(x, 0, +svg.attr('width')),
      clamp(y, 0, +svg.attr('height')),
    ];

    svg
      .selectAll('.node')
      .data(nodes, (d) => d.index)
      .join((enter) =>
        enter.append('g').call(enterNode, r, simulation, clipPositions, setToolTip)
      )
      .call(updateNodes);

    simulation.alpha(0.5).restart();
    console.log('update data');
  }, [simulation, nodes, links]);
  console.log(tooltip);

  return (
    <>
      <svg ref={ref} width={width} height={height} className="svg-container" />
      <NodeTooltip {...tooltip} />
    </>
  );
};
