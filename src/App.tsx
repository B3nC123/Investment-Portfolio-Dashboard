import { Theme } from '@radix-ui/themes';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './components/Dashboard';
import { FileManagement } from './components/FileManagement';
import { HoldingsAnalysis } from './components/HoldingsAnalysis';
import { TransactionHistory } from './components/TransactionHistory';
import { Layout } from './components/Layout';
import { PortfolioProvider } from './context/PortfolioContext';

function App() {
  return (
    <Theme
      accentColor="blue"
      grayColor="slate"
      radius="medium"
      scaling="100%"
      appearance="light"
    >
      <PortfolioProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/files" element={<FileManagement />} />
              <Route path="/holdings" element={<HoldingsAnalysis />} />
              <Route path="/transactions" element={<TransactionHistory />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </Router>
      </PortfolioProvider>
    </Theme>
  );
}

export default App;
