import { Theme } from '@radix-ui/themes';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import '@radix-ui/themes/styles.css';
import './App.css';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { HoldingsAnalysis } from './components/HoldingsAnalysis';
import { TransactionHistory } from './components/TransactionHistory';
import { FileManagement } from './components/FileManagement';
import { Settings } from './components/Settings';
import { PortfolioProvider } from './context/PortfolioContext';

function App() {
  return (
    <PortfolioProvider>
      <Theme appearance="light" accentColor="blue" radius="medium">
        <Router>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="holdings" element={<HoldingsAnalysis />} />
                <Route path="transactions" element={<TransactionHistory />} />
                <Route path="files" element={<FileManagement />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Routes>
          </div>
        </Router>
      </Theme>
    </PortfolioProvider>
  );
}

export default App;
