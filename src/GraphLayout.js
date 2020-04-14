import React, { useRef, useEffect, useMemo } from 'react';
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

const enterLink = (selection, scale) => {
  selection
    .attr('class', 'link')
    .attr('stroke-width', (d) => scale(d.coappearances));
};

const enterNode = (selection, r, simulation) => {
  selection.append('circle').attr('r', r);

  selection.attr('class', 'node').call(
    drag()
      .on('start', (d) => dragStart(d, simulation))
      .on('drag', dragOn)
      .on('end', (d) => dragEnd(d, simulation))
  );
};

const dragStart = (d, simulation) => {
  if (!event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
};

const dragOn = (d) => {
  d.fx = event.x;
  d.fy = event.y;
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

const updateGraph = (selection) => {
  selection.selectAll('.link').call(updateLinks);
  selection.selectAll('.node').call(updateNodes);
};

export const GraphLayout = ({ data, width, height }) => {
  const ref = useRef();
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
    simulation.on('tick', () => select(ref.current).call(updateGraph));
    console.log('update center');
  }, [width, height, simulation]);

  useEffect(() => {
    const svg = select(ref.current);
    const { nodes, links } = data;
    const linksExtent = extent(links.map(d => d.coappearances));
    const scaleLinkWidth = scaleLinear().domain(linksExtent).range([2, 6])
    const scaleLinkDistance = scaleLinear().domain(linksExtent).range([20, 200])

    simulation.nodes(nodes);
    simulation.force('links').links(links).distance(d => scaleLinkDistance(d.coappearances));

    svg
      .selectAll('.link')
      .data(links, (d) => d.index)
      .join((enter) => enter.append('line').call(enterLink, scaleLinkWidth))
      .call(updateLinks);

    svg
      .selectAll('.node')
      .data(nodes, (d) => d.index)
      .join((enter) => enter.append('g').call(enterNode, r, simulation))
      .call(updateNodes);

    console.log('update data');
  }, [simulation, data]);

  return (
    <svg ref={ref} width={width} height={height} className="svg-container" />
  );
};
