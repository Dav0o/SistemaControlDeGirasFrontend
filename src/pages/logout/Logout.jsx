import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthProviders";
import '../../stylesheets/logout.css'

const Logout = () => {
  const { logOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logOut();
    navigate("/login", { replace: true });
  };

  setTimeout(() => {
    handleLogout();
  }, 3 * 1000);

  return(
  <>
  <div className="logout-container"></div>
    <div class="logout-wrapper">
      <div class="circle"></div>
      <div class="circle"></div>
      <div class="circle"></div>
      <div class="logout-shadow"></div>
      <div class="logout-shadow"></div>
      <div class="logout-shadow"></div>
      
    </div>
  </>
  );
  
};

export default Logout;
