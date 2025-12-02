import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppsPage from './pages/apps/page';
import WorkflowPage from './pages/WorkflowPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import CustomersPage from './pages/customers/page';
import Test32pxLoader from './pages/customers/test-32px-loader';
import PixelCatShowcase from './pages/pixel-cat-showcase/page';
import CatComparison from './pages/pixel-cat-showcase/CatComparison';
import BritishShorthairShowcase from './pages/pixel-cat-showcase/BritishShorthairShowcase';
import { ButtonPopupExample } from './examples/ButtonPopupExample';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/apps" element={<AppsPage />} />
      <Route path="/customers" element={<CustomersPage />} />
      <Route path="/test-32px-loader" element={<Test32pxLoader />} />
      <Route path="/pixel-cat-showcase" element={<PixelCatShowcase />} />
      <Route path="/cat-comparison" element={<CatComparison />} />
      <Route path="/british-shorthair" element={<BritishShorthairShowcase />} />
      <Route path="/workflow/:appId" element={<WorkflowPage />} />
      <Route path="/button-popup-example" element={<ButtonPopupExample />} />
    </Routes>
  );
};

export default App;
