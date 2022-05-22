import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";

import AdminHome from "./pages/Admin/Home/AdminHome";
import CreateUser from "./pages/CreateUser/CreateUser";
import Home from "./pages/Home";
import AddDetails from "./pages/Owner/AddDetails/AddDetails";
import TenantHome from "./pages/Tenant/TenantHome";

//Global state provider
import { Provider } from "./ContextApi/createContext";

function App() {
  return (
    <Provider>
      <Router>
        <Routes>
          //Login page
          <Route exact path="/" element={<Home />} />
          //Create User page
          <Route path="/createUser" element={<CreateUser />} />
          //Owner Home Page
          <Route path="/owner/addDetails" element={<AddDetails />} />
          //Admin Home page
          <Route path="/admin/home" element={<AdminHome />} />
          //Tenant
          <Route path="/tenant/home" element={<TenantHome />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
