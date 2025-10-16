import {BrowserRouter as Router, Routes, Route} from "react-router-dom";

import './App.css'
import HomePage from "./pages/HomePage.tsx";

function App() {
  return (
      <div className="App">
          <Router>
              <Routes>
                <Route path={"/"} element={<HomePage/>}/>
              </Routes>
          </Router>
      </div>
  )
}

export default App
