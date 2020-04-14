import React from 'react';
import { Container } from 'react-bootstrap';
import {} from 'd3';
import { Footer } from './Footer';
import { GraphLayout } from './GraphLayout';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import data from './data.json';

const width = 600,
  height = 500;

function App() {
  return (
    <Container className="app-container">
      <header>
        <h1 className="mt-4 mb-4">GCN JS</h1>
      </header>

      <main>
        <GraphLayout data={data} width={width} height={height} />
      </main>

      <Footer url="gcn-js" />
    </Container>
  );
}

export default App;
