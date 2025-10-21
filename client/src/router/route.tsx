import { Routes, Route } from 'react-router-dom';

import SidebarLayout from '@/layouts/sidebar-layout';
import { ProtectedRoute } from '@/router/ProtectedRoute';
import IndexPage from '@/pages/index';
import DashboardPage from '@/pages/dashboard';
import PricingPage from '@/pages/pricing';
import AboutPage from '@/pages/about';
import SubjectPage from '@/pages/subject';
import LevelPage from '@/pages/level';
import MatrixPage from '@/pages/matrix';
import QuestionType from '@/pages/question-type';
import ContentPage from '@/pages/content';
import LessonPage from '@/pages/lesson';
import { QuestionListByLesson } from '@/components/question/question-list-by-lesson';
import { LessonComponent } from '@/components/lesson/lesson.component';
import CreateQuestionPage from '@/pages/create-question';
import ExamPage from '@/pages/exam';
import FeaturePage from '@/pages/feature';
import { MatrixExamList } from '@/components/matrix/exam-list';
import MatrixLayout from '@/layouts/matrix-layout';
import { UserSettingsPage } from '@/pages/setting';
import GradePage from '@/pages/grade';

export function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route
        index
        element={<IndexPage />}
      />
      <Route
        element={<PricingPage />}
        path='pricing'
      />
      <Route
        element={<FeaturePage />}
        path='feature'
      />
      <Route
        element={<AboutPage />}
        path='about'
      />

      {/* Dashboard (TEACHER, ADMIN) */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['TEACHER', 'ADMIN']}>
            <SidebarLayout />
          </ProtectedRoute>
        }
        path='dashboard'
      >
        <Route
          index
          element={<DashboardPage />}
        />
        <Route
          element={<UserSettingsPage />}
          path='settings'
        />
        <Route
          element={<MatrixLayout />}
          path='matrix'
        >
          <Route
            index
            element={<MatrixPage />}
          />
          <Route
            element={<MatrixExamList />}
            path=':matrixId/exams'
          />
        </Route>

        <Route
          element={<ContentPage />}
          path='content'
        />
        <Route
          element={<ExamPage />}
          path='exam'
        />

        <Route
          element={<LessonPage />}
          path='lesson'
        >
          {/* Route mặc định: chỉ show LessonComponent */}
          <Route
            index
            element={<LessonComponent />}
          />

          {/* Route: show QuestionListByLesson bên trong LessonComponent */}
          <Route
            element={<QuestionListByLesson />}
            path=':lessonId/questions'
          />
        </Route>
        <Route
          element={<CreateQuestionPage />}
          path='question/create'
        />
      </Route>

      {/* Admin-only */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <SidebarLayout />
          </ProtectedRoute>
        }
        path='admin'
      >
        <Route
          index
          element={<DashboardPage />}
        />
        <Route
          element={<GradePage />}
          path='grade'
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
          element={<QuestionType />}
          path='question-type'
        />
      </Route>
    </Routes>
  );
}
