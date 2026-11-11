import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import NotesPage from './pages/NotesPage'
import PostsPage from './pages/PostsPage'
import AdminUsersPage from './pages/AdminUsersPage'
import AdminNotesPage from './pages/AdminNotesPage'
import AdminInterestsPage from './pages/AdminInterestsPage'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/notes" element={<ProtectedRoute><NotesPage /></ProtectedRoute>} />
        <Route path="/posts" element={<ProtectedRoute><PostsPage /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute adminOnly><AdminUsersPage /></ProtectedRoute>} />
        <Route path="/admin/notes" element={<ProtectedRoute adminOnly><AdminNotesPage /></ProtectedRoute>} />
        <Route path="/admin/interests" element={<ProtectedRoute adminOnly><AdminInterestsPage /></ProtectedRoute>} />
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </>
  )
}

export default App
