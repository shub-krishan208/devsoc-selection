import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import "./index.css";
import Database from "./Database";
import Login from "./Login";

function App() {
  /**
   * list of the api endpoints for relevance http://locahost:5000/api/  :
   *
   * @routes POST /auth:
   * /login
   * /register
   * /protect : random testing endpoint
   *
   * @routes /items:
   * / or ?status=found&category=tech
   * /:id
   * POST /
   * PUT /:id
   * DELETE /:id
   */

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/database" element={<Database />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
