import './index.css'; // or './App.css' if you're using that
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

// routes 
import Login from './pages/Auth/Login';
import SignUp from './pages/auth/signup'; 
import Home from './pages/Dashboard/Home';
import Income from './pages/Dashboard/Income';
import Expense from './pages/Dashboard/Expense';
import EmojiTest from './components/layouts/EmojiTest';

// layouts
import AuthLayout from './components/layouts/AuthLayout';
import UserProvider from './context/userContext';

// toaster
import {Toaster} from 'react-hot-toast'


function App() {
  return (
    <UserProvider>
    <div>
      <Router>
        <Routes>
          <Route path='/' element={<Root />}></Route>
          <Route path='/login' exact element={<Login />}></Route>
          <Route path='/signup' exact element={<SignUp />}></Route>
          <Route path='/dashboard' exact element={<Home />}></Route>
          <Route path='/income' exact element={<Income />}></Route>
          <Route path='/expense' exact element={<Expense />}></Route>
          <Route path="/emoji-test" element={<EmojiTest />} ></Route>

        </Routes>
      </Router>
    </div>

    <Toaster 
      toastOptions={{
        className:"",
        style:{
          fontsize:'13px'
        },
      }}
    />
    </UserProvider>
  )
}

export default App

const Root = () => {
  // check if the token exists in local storage
  const isAuthenticated = !!localStorage.getItem('token');

  // Redirect to login if not authenticated and dashboard is authenticated 
  return isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />;

};