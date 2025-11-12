import './styles/App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header, Footer } from './components/Layout';
import HomePage from './pages/HomePage';
import HouseDesignsRoute from './pages/HouseDesignsRoute';
import { useSiteSettings } from './hooks/useSiteSettings';

function App() {
  const { settings } = useSiteSettings();

  return (
    <Router basename="/shambala_homes">
      <div className="App">
        <Header settings={settings} />
        <main>
          <Routes>
            <Route path="/" element={<HomePage settings={settings} />} />
            <Route path="/house-designs" element={<HouseDesignsRoute />} />
          </Routes>
        </main>
        <Footer settings={settings} />
      </div>
    </Router>
  );
}

export default App;
