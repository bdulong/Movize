import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MovieStart from "./components/MovieStart";
import MovieDetail from "./components/MovieDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MovieStart />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App; 