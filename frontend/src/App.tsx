import './styles/App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header, Footer } from './components/Layout';
import HomePage from './pages/HomePage';
import HouseDesignsRoute from './pages/HouseDesignsRoute';

function App() {
  return (
    <Router basename="/shambala_homes">
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/house-designs" element={<HouseDesignsRoute />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
