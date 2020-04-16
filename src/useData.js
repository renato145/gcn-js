import dataSource from './data.json';
import { useMemo } from 'react';
import { rollup } from 'd3-array';

export const useData = () => {
  const data = useMemo(() => {
    const {links , nodes} = dataSource;
    const values = links.map(d => [d.source, d.target]).flat();
    const counts = Object.fromEntries(rollup(values, d => d.length, o => o));
    nodes.forEach((d,i) => d['degree'] = counts[i]);
    return {links, nodes};
  }, []);

  return data;
};
