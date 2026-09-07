import './App.css';

import { store } from './redux/store';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Auth from './pages/Auth/Auth';
import Feed from './pages/Feed/Feed';
import Popular from './pages/Popular/Popular'
import AutoLogin from './components/AutoLogin';
import PostDetails from './components/PostDetails';
import CustomizeFeed from './pages/CustomizeFeed/CustomizeFeed';
import AddPost from './pages/AddPost/AddPost';
import User from './pages/User/User';
import About from './pages/About/About';
import Maintenance from './pages/Maintenance/Maintenance';
import Messages from './pages/Messages/Messages';

import Aboutus from './pages/StaticPages/AboutUs';
import DataDeletion from './pages/StaticPages/DataDeletion';
import SafetyPolicy from './pages/StaticPages/SafetyPolicy';
import PrivacyPolicy from './pages/StaticPages/PrivacyPolicy';
import TermsAndConditions from './pages/StaticPages/TermsAndConditions';
import PageNotFound from './pages/StaticPages/PageNotFound';
import ProtectedRoute from './components/ProtectedRoute';

import SetBG from './backgrounds/SetBG';
import LayoutNavbar from './components/LayoutNavbar';
import MessageBar from './components/MessageBar';
import Loader from './components/Loader';

import SocketConnection from './pages/Messages/SocketConnection';

import { routeAuth, routeFeed, routePopular, routeCustomizeFeed, routeAddPost, routeUser, routeAbout, routeMessages, routeMaintenance, routeAboutus, routePrivacyPolicy, routeTermsAndConditions, routePostDetails, routeDataDeletion, routeSafetyPolicy } from './utils/Routes';

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <SetBG />
        <AutoLogin />
        <SocketConnection />

        <Routes>

          <Route path={routePostDetails} element={<PostDetails />} />
          
          <Route path={routeDataDeletion} element={<DataDeletion />} />
          <Route path={routeAboutus} element={<Aboutus />} />
          <Route path={routePrivacyPolicy} element={<PrivacyPolicy />} />
          <Route path={routeTermsAndConditions} element={<TermsAndConditions />} />
          <Route path={routeSafetyPolicy} element={<SafetyPolicy />} />

          <Route path={routeAuth} element={<Auth />} />
          <Route path={routeMaintenance} element={<Maintenance />} />

          <Route element={<ProtectedRoute />}>

            <Route element={<LayoutNavbar />}>

              <Route path={routeFeed} element={<Feed />} />
              <Route path={routePopular} element={<Popular />} />
              <Route path={routeCustomizeFeed} element={<CustomizeFeed />} />
              <Route path={routeAddPost} element={<AddPost />} />
              <Route path={routeUser} element={<User />} />
              <Route path={routeAbout} element={<About />} />
              <Route path={routeMessages} element={<Messages />} />

            </Route>

          </Route>

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>

      <MessageBar />
      <Loader />
    </Provider>
  )
};