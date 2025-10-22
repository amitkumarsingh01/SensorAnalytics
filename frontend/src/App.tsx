import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import TemperaturePage from './pages/TemperaturePage';
import HumidityPage from './pages/HumidityPage';
import VoltagePage from './pages/VoltagePage';
import LDRPage from './pages/LDRPage';
import AnalyticsPage from './pages/AnalyticsPage';
import DataTable from './pages/DataTable';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/temperature" element={<TemperaturePage />} />
          <Route path="/humidity" element={<HumidityPage />} />
          <Route path="/voltage" element={<VoltagePage />} />
          <Route path="/ldr" element={<LDRPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/data" element={<DataTable />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
