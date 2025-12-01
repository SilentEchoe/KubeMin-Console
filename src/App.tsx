import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppsPage from './pages/apps/page';
import WorkflowPage from './pages/WorkflowPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import { ButtonPopupExample } from './examples/ButtonPopupExample';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<AppsPage />} />
      <Route path="/apps" element={<AppsPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/workflow/:appId" element={<WorkflowPage />} />
      <Route path="/button-popup-example" element={<ButtonPopupExample />} />
    </Routes>
  );
};

export default App;
