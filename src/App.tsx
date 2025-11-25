import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppsPage from './pages/apps/page';
import WorkflowPage from './pages/WorkflowPage';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<AppsPage />} />
      <Route path="/workflow/:appId" element={<WorkflowPage />} />
    </Routes>
  );
};

export default App;
