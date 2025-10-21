import { UserProvider } from '@/components/settings/user/user-context';
import { AppRoutes } from '@/router/route';

function App() {
  // return (

  //   <Routes>
  //     <Route
  //       element={<IndexPage />}
  //       path='/'
  //     />
  //     <Route
  //       element={<SidebarLayout />}
  //       path='dashboard'
  //     >
  //       <Route
  //         index
  //         element={<DashboardPage />}
  //       />
  //       <Route
  //         element={<SubjectPage />}
  //         path='subject'
  //       />
  //       <Route
  //         element={<LevelPage />}
  //         path='level'
  //       />
  //       <Route
  //         element={<MatrixPage />}
  //         path='matrix'
  //       />
  //       <Route
  //         element={<QuestionType />}
  //         path='question-type'
  //       />
  //       <Route
  //         element={<ContentPage />}
  //         path='content'
  //       />
  //       <Route
  //         element={<LessonPage />}
  //         path='lesson'
  //       />
  //     </Route>

  //     <Route
  //       element={<PricingPage />}
  //       path='/level'
  //     />
  //     <Route
  //       element={<BlogPage />}
  //       path='/blog'
  //     />
  //     <Route
  //       element={<AboutPage />}
  //       path='/about'
  //     />
  //   </Routes>
  // );
  return (
    <UserProvider>
      <AppRoutes />
    </UserProvider>
  );
}

export default App;
