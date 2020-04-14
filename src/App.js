import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import { Footer } from "./Footer";
import "./App.css";

function App() {
  return (
    <Container className="app-container">
      <header>
        <h1 className="mt-4 mb-4">GCN JS</h1>
      </header>
      <main>
        <p>Testing content</p>
      </main>
      <Footer url="gcn-js" />
    </Container>
  );
}

export default App;
