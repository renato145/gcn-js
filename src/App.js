import React from 'react';
import { Container } from 'react-bootstrap';
import {} from 'd3';
import { Footer } from './Footer';
import { GraphLayout } from './GraphLayout';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import data from './data.json';

console.log(data);

function App() {
  return (
    <Container className="app-container">
      <header>
        <h1 className="mt-4 mb-4">GCN JS</h1>
      </header>

      <main>
        <GraphLayout />
      </main>

      <Footer url="gcn-js" />
    </Container>
  );
}

export default App;
