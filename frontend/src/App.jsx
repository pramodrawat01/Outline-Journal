

import './App.css'
import { Route, Routes } from 'react-router-dom'
import LandingPage from './pages/Landingpage'
import AuthPage from './pages/Authpage'
import Profile from './pages/profile/Profile'
import CreateBlog from './pages/CreateBlog'
import OnboardingLayout from './layout/OnboardingLayout'
import OnboardingGate from './routes/OnboardingGate'
import Onboarding from './pages/onboarding/Onboarding'
import ProfileOverview from './pages/profile/ProfileOverview'
import ProfileLayout from './layout/ProfileLayout'
import Challenges from './pages/profile/Challenges'
import Journal from './pages/profile/Journal'
import Blogs from './pages/blog/Blogs'
import ChallengeDetail from './pages/profile/ChallengeDetail'
import ChallengeWrite from './pages/profile/ChallengeWrite'
import JournalWrite from './pages/profile/JournalWrite'
 import JournalRead from './pages/profile/JournalRead'
import BlogRead from './pages/profile/BlogRead'
 import Diary from './pages/profile/Diary'
 import DiaryDetail from './pages/profile/DiaryDetail'
// import PublicLayout from './layout/PublicLayout'
// import AuthorProfile from './pages/public/AuthorProfile'

import ArticlePage from './pages/blog/ArticlePage'
import DiaryPage from './pages/blog/DiaryPage'
import PublicLayout from './layout/PublicLayout'
import AuthorProfile from './pages/public/AuthorProfile'
import EditProfile from './pages/profile/EditProfile'
import GuestRoute from './routes/GuestRoute'

function App() {
  return (
    <Routes>
      <Route path='/' element={<LandingPage />} />
      <Route element={<GuestRoute/>} >
        <Route path='/signup' element={<AuthPage />} />
      </Route>

    

      {/* logged in, onboarding not finished */}
      <Route element={<OnboardingLayout />}>
        <Route path='/onboarding' element={<Onboarding />} />
      </Route>

      {/* logged in and onboarding finished */}
      <Route element={<OnboardingGate />}>
        {/* <Route path='/profile' element={<Profile />}> */}
        <Route path='/profile' element={<ProfileLayout/>}>
          
          <Route index element={<Profile/>} />
          <Route path='blogs/:id' element={<BlogRead />} />
          
          <Route path='overview'  element={<ProfileOverview/>} />
          <Route path="edit" element={<EditProfile/>} />

          <Route path='challenges' element={<Challenges/>} />
          <Route path='challenges/:id' element={<ChallengeDetail />} />
          <Route path='challenges/:id/write/:date' element={<ChallengeWrite />} />

          <Route path='journal' element={<Journal/>} />
          <Route path='journal/new' element={<JournalWrite />} />
          <Route path='journal/:id' element={<JournalRead />} />
          <Route path='journal/:id/edit' element={<JournalWrite />} />

          <Route path='diary' element={<Diary />} />
         <Route path='diary/:id' element={<DiaryDetail />} />
         <Route path='diary/:diaryId/new' element={<JournalWrite />} />
         <Route path='diary/:diaryId/entries/:id' element={<JournalRead />} />
         <Route path='diary/:diaryId/entries/:id/edit' element={<JournalWrite />} />


        </Route>
        
        {/* <Route path='blogs' element={<Blogs/>} /> */}

        <Route path='/create-blog' element={<CreateBlog />} />
        <Route path="/edit-blog/:id" element={<CreateBlog/>} />
      </Route>
      

      {/* public: no login needed */}
      <Route element={<PublicLayout />}>
        <Route path='/blogs' element={<Blogs />} />
        <Route path='/blogs/:id' element={<ArticlePage kind='blog' />} />
        <Route path='/journals/:id' element={<ArticlePage kind='journal' />} />
        <Route path='/diaries/:id' element={<DiaryPage />} />
        <Route path='/diaries/:id/entries/:entryId' element={<ArticlePage kind='entry' />} />
        <Route path='/u/:username' element={<AuthorProfile />} />
      </Route>

    </Routes>
  )
}

export default App