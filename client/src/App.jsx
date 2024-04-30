import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Layout from "./components/Layout";

function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/messages" element={<Layout />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
