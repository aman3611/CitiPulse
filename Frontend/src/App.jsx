import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./components/Context/AuthContext";
import PageNotFound from "./components/PageNotFound";
import Signup from "./components/auth/Signup/Signup";
import Login from "./components/auth/Login/Login";
import Home from "./components/Home/Home";
import UserDashboard from "./components/dashboard/userDashboard/userDashboard";
import GovernmentDashboard from "./components/dashboard/governmentDashboard/GovernmentDashboard";
import AdminDashboard from "./components/dashboard/adminDashboard/adminDashboard";
import UserPosts from "./components/dashboard/userDashboard/UserPosts/UserPosts";
import UserDashboardWelcome from "./components/dashboard/userDashboard/UserDashboardWelcome/UserDashboardWelcome";
import Profile from "./components/Profile/Profile";
import GovernmentDashboardWelcome from "./components/dashboard/governmentDashboard/GovernmentDashboardWelcome/GovernmentDashboardWelcome";
import AdminDashboardWelcome from "./components/dashboard/adminDashboard/AdminDashboardWelcome/AdminDashboardWelcome";
import ManagePosts from "./components/dashboard/adminDashboard/ManagePosts/ManagePosts";
import ManageGovernment from "./components/dashboard/adminDashboard/ManageGovernment/ManageGovernment";
import ManageUsers from "./components/dashboard/adminDashboard/ManageUsers/ManageUsers";
import Posts from "./components/Posts/Posts";
import ViewPosts from "./components/dashboard/governmentDashboard/ViewPosts/ViewPosts";
import ViewProgress from "./components/dashboard/governmentDashboard/ViewProgress/ViewProgress";
import Feedback from "./components/dashboard/governmentDashboard/ResolvedIssue/ResolvedIssue";
import UserProfile from "./components/dashboard/userDashboard/UserProfile/UserProfile";
import GovernmentProfile from "./components/dashboard/governmentDashboard/GovernmentProfile/GovernmentProfile";
import Developers from "./components/Developers/Developers";
import About from "./components/About/About";
import Services from "./components/Services/Services";
import Contact from "./components/Contact/Contact";
import Policy from "./components/Policy/Policy";
import Terms from "./components/Terms/Terms";
import CreatePost from "./components/Posts/CreatePost/CreatePost";
import CommunityChat from "./components/dashboard/userDashboard/CommunityChat/CommunityChat";
import SharePost from "./components/Posts/SharePost/SharePost";
import ScrollToTop from "./components/ScrollToTop";
import AIChat from "./components/AIChat/AIChat";
import DownvotedIssue from "./components/dashboard/userDashboard/DownvotedIssue/DownvotedIssue";
import UpvotedIssue from "./components/dashboard/userDashboard/UpvotedIssue/UpvotedIssue";

// 🔐 Protected route for logged-in users
const ProtectedRoute = ({ element, role }) => {
  const { token, role: userRole, loading } = useAuth();

  if (loading) return null;

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (role && userRole !== role) return <Navigate to="/" />;
  return element;
};

// 🚫 Public route only for non-authenticated users
const PublicRoute = ({ element }) => {
  const { token, loading } = useAuth();

  if (loading) return null;

  return !token ? element : <Navigate to="/" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <AIChat />
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<Home />} />
          <Route path="*" element={<PageNotFound />} />
          <Route
            path="/signup"
            element={<PublicRoute element={<Signup />} />}
          />
          <Route path="/login" element={<PublicRoute element={<Login />} />} />
          <Route path="/developers" element={<Developers />} />
          <Route path="/user/profile/:role/:userId" element={<Profile />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/policy" element={<Policy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/post/:postId" element={<SharePost />} />
          {/* User Dashboard Routes */}
          <Route
            path="/user/dashboard"
            element={<ProtectedRoute element={<UserDashboard />} role="user" />}
          >
            <Route index element={<UserDashboardWelcome />} />
            <Route path="userPosts" element={<UserPosts />} />
            <Route path="userProfile" element={<UserProfile />} />
            <Route path="createPost" element={<CreatePost />} />
            <Route path="posts" element={<Posts />} />
            <Route path="communityChat" element={<CommunityChat />} />
            <Route path="upvotedIssues" element={<UpvotedIssue />} />
            <Route path="downvotedIssues" element={<DownvotedIssue />} />
          </Route>

          {/* Government Dashboard Routes */}
          <Route
            path="/government/dashboard"
            element={
              <ProtectedRoute
                element={<GovernmentDashboard />}
                role="government"
              />
            }
          >
            <Route index element={<GovernmentDashboardWelcome />} />
            <Route path="viewPosts" element={<ViewPosts />} />
            <Route path="viewProgress" element={<ViewProgress />} />
            <Route path="resolvedIssues" element={<Feedback />} />
            <Route path="governmentProfile" element={<GovernmentProfile />} />
          </Route>

          {/* Admin Dashboard Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute element={<AdminDashboard />} role="admin" />
            }
          >
            <Route index element={<AdminDashboardWelcome />} />
            <Route path="profile" element={<Profile />} />
            <Route path="managePosts" element={<ManagePosts />} />
            <Route path="manageGovernment" element={<ManageGovernment />} />
            <Route path="manageUsers" element={<ManageUsers />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
