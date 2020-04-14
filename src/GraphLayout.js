import React, { useRef, useEffect, useMemo } from 'react';
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  select,
  drag,
  event,
} from 'd3';
import './GraphLayout.css';

const enterLink = (selection) => {
  selection.attr('class', 'link');
};

const enterNode = (selection, simulation) => {
  selection.attr('class', 'node');
  selection
    .append('circle')
    .attr('r', 8)
    .call(
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

  const simulation = useMemo(() => {
    return forceSimulation()
      .force('links', forceLink())
      .force('charge', forceManyBody())
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

    simulation.nodes(nodes);
    simulation.force('links').links(links);

    svg
      .append('g')
      .attr('class', 'links')
      .selectAll('.link')
      .data(links, (d) => d.index)
      .join((enter) => enter.append('line').call(enterLink))
      .call(updateLinks);

    svg
      .append('g')
      .attr('class', 'nodes')
      .selectAll('.node')
      .data(nodes, (d) => d.index)
      .join((enter) => enter.append('g').call(enterNode, simulation))
      .call(updateNodes);

    console.log('update data');
  }, [simulation, data]);

  return <svg ref={ref} width={width} height={height} />;
};
