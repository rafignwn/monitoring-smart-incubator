import MainLayout from "./layouts";
import {
  Routes,
  Route,
  BrowserRouter as Router,
  Navigate,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Activity from "./pages/Activity";
import ErrorPage from "./pages/ErrorPage";
import Notifications from "./pages/Notifications";
import Login from "./pages/Login";
import { useContext } from "react";
import { AuthContext } from "./contexts/AuthContext";
import UsersPage from "./pages/UsersPage";
import AddUserPage from "./pages/AddUserPage";
import EditUserPage from "./pages/EditUserPage";
import Realtime from "./pages/Realtime";
import ControlPage from "./pages/ControlPage";

function App() {
  const { currentUser } = useContext(AuthContext);

  function AuthProtection({ children }: { children: JSX.Element }) {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }

    return children;
  }

  function RequiredAdmin({ children }: { children: JSX.Element }) {
    if (currentUser?.role !== "admin") {
      return <Navigate to="/" />;
    }

    return children;
  }

  return (
    <Router>
      <Routes>
        <Route
          element={
            <AuthProtection>
              <MainLayout />
            </AuthProtection>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/realtime" element={<Realtime />} />
          <Route path="/notif" element={<Notifications />} />
          <Route path="/control" element={<ControlPage />} />
          <Route
            path="/users"
            element={
              <RequiredAdmin>
                <UsersPage />
              </RequiredAdmin>
            }
          />
          <Route
            path="/adduser"
            element={
              <RequiredAdmin>
                <AddUserPage />
              </RequiredAdmin>
            }
          />
          <Route path="/edit" element={<EditUserPage />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}

export default App;
