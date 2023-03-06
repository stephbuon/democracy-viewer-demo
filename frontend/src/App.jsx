import { React, useState } from "react";
import { LoginRegister } from "./pages/login-register.jsx";
import { Graph } from "./pages/graph.jsx";
import { Layout } from "./pages/layout.jsx";
import { Zoom } from "./pages/zoom.jsx";
import { Upload } from "./pages/upload.jsx";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  const dataset = {
    x: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ],
    y: [24, 24, 24, 24, 24, 24, 24],
    label: "Hours/Day",
    other: [
      "SUNDAY is 24 hours",
      "MONDAY is also 24 hours long",
      "TUESDAY, as we can see, is also 24 hours",
      "I wonder if WEDNESDAY follows the same pattern (24 hours)",
      "'THURSDAY.hours == 24' returns true",
      "FRIDAY is 23 hours long if we exclude the final hour",
      "SATURDAY is not any amount of hours, except 24"
    ]
  };

  const [data, setData] = useState(undefined);

  return (
    <div className="App">
      <Router>
        <Layout />
        <div className="container border border-2">
          <Routes>
            <Route path="/" element={<Upload />}></Route>
            <Route path="/login" element={<LoginRegister />}></Route>
            <Route path="/graph" element={<Graph dataset={dataset} setData={setData} />}></Route>
            <Route path="/zoom" element={<Zoom data={data} />}></Route>
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
