import { Route, Routes } from 'react-router-dom';

import IndexPage from '@/pages/index';
import DashboardPage from '@/pages/dashboard';
import PricingPage from '@/pages/pricing';
import BlogPage from '@/pages/blog';
import AboutPage from '@/pages/about';
import SidebarLayout from '@/layouts/sidebar-layout';
import SubjectPage from '@/pages/subject';

function App() {
  return (
    <Routes>
      <Route
        element={<IndexPage />}
        path='/'
      />
      <Route
        element={<SidebarLayout />}
        path='dashboard'
      >
        <Route
          index
          element={<DashboardPage />}
        />
        <Route
          element={<SubjectPage />}
          path='subject'
        />
      </Route>

      <Route
        element={<PricingPage />}
        path='/pricing'
      />
      <Route
        element={<BlogPage />}
        path='/blog'
      />
      <Route
        element={<AboutPage />}
        path='/about'
      />
    </Routes>
  );
}

export default App;
