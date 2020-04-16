import React, { useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import {} from 'd3';
import { Footer } from './Footer';
import { GraphLayout } from './GraphLayout';
import { useData } from './useData';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

const width = 600,
  height = 500;

function App() {
  const data = useData();
  const [nodes, setNodes] = useState(data.nodes);
  const [links, setLinks] = useState(data.links);

  const addData = () => {
    setNodes((d) =>
      d.concat({
        name: 'added',
        x: width/2,
        y: height/2,
        degree: Math.random()*20
      })
    );
  };

  return (
    <Container className="app-container">
      <header>
        <h1 className="mt-4 mb-4">GCN JS</h1>
      </header>

      <main>
        <GraphLayout
          nodes={nodes}
          links={links}
          width={width}
          height={height}
        />
        <p>
          <Button onClick={addData}>Add node</Button>
        </p>
      </main>

      <Footer url="gcn-js" />
    </Container>
  );
}

export default App;
