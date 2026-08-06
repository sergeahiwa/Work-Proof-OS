/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import Profile from './pages/Profile';
import Projects from './pages/Projects';
import Opportunities from './pages/Opportunities';
import Network from './pages/Network';
import Onboarding from './pages/Onboarding';
import RecruiterDashboard from './pages/RecruiterDashboard';
import UserTestingMode from './pages/UserTestingMode';
import AdminDashboard from './pages/AdminDashboard';
import CreateProof from './pages/CreateProof';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/profile" element={<Layout><Profile /></Layout>} />
        <Route path="/projects" element={<Layout><Projects /></Layout>} />
        <Route path="/opportunities" element={<Layout><Opportunities /></Layout>} />
        <Route path="/network" element={<Layout><Network /></Layout>} />
        <Route path="/recruiter" element={<Layout><RecruiterDashboard /></Layout>} />
        <Route path="/test-mode" element={<Layout><UserTestingMode /></Layout>} />
        <Route path="/admin" element={<Layout><AdminDashboard /></Layout>} />
        <Route path="/create-proof" element={<Layout><CreateProof /></Layout>} />
      </Routes>
    </Router>
  );
}
