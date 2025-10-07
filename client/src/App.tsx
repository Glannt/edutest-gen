import { Route, Routes } from 'react-router-dom';

import IndexPage from '@/pages/index';
import DashboardPage from '@/pages/dashboard';
import PricingPage from '@/pages/pricing';
import BlogPage from '@/pages/blog';
import AboutPage from '@/pages/about';
import SidebarLayout from '@/layouts/sidebar-layout';
import SubjectPage from '@/pages/subject';
import LevelPage from '@/pages/level';
import MatrixPage from '@/pages/matrix';
import QuestionType from '@/pages/question-type';
import ContentPage from '@/pages/content';
import QuestionPage from '@/pages/question';

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
        <Route
          element={<LevelPage />}
          path='level'
        />
        <Route
          element={<MatrixPage />}
          path='matrix'
        />
        <Route
          element={<QuestionType />}
          path='question-type'
        />
        <Route
          element={<ContentPage />}
          path='content'
        />
        <Route
          element={<QuestionPage />}
          path='lesson'
        />
      </Route>

      <Route
        element={<PricingPage />}
        path='/level'
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
