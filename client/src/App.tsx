import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Profile } from './pages/Profile';
import { Header } from './components/Header';
import { SignIn } from './pages/SingIn';
import { SignUp } from './pages/SingUp';
import { PrivateRoute } from './components/PrivateRoute';
import { CreateListing } from './pages/CreateListing';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path={'/'} element={<Home />} />
        <Route path={'/about'} element={<About />} />
        <Route path={'/sign-in'} element={<SignIn />} />
        <Route path={'/sign-up'} element={<SignUp />} />
        <Route element={<PrivateRoute />}>
          <Route path={'/profile'} element={<Profile />} />
          <Route path={'/create-listing'} element={<CreateListing />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
