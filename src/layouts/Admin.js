
import React from "react";
import { useLocation, Route, Routes, Navigate } from "react-router-dom";
// reactstrap components
import { Container } from "reactstrap";
// core components
import Sidebar from "../components/Sidebar/Sidebar.js";
import routes from "../routes.js";
import { useSelector } from 'react-redux';

const Admin = (props) => {
  const mainContent = React.useRef(null);
  const location = useLocation();

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin" ) {
        return (
          <Route path={prop.path} element={prop.component} key={key} exact />
        );
      } else {
        return null;
      }
    });
  };


 const account = useSelector((state) => state.account);
const { isLoggedIn } = account;
console.log("login value changed",isLoggedIn)
if (isLoggedIn) {
    // return <Redirect to={config.defaultPath} />;

  return (
    <>
    <Sidebar
        {...props}
        routes={routes}
        logo={{
          innerLink: "/admin/index",
          imgSrc: require("../assets/img/brand/argon-react-white.png"),
          imgAlt: "...",
        }}
      />
      <div className="main-content" ref={mainContent}>
        {/* <AdminNavbar
          {...props}
          brandText={getBrandText(props?.location?.pathname)}
        /> */}
        <Routes>
          {getRoutes(routes)}
          <Route path="*" element={<Navigate to="/admin/index" replace />} />
        </Routes>
        <Container fluid>
          {/* <AdminFooter /> */}
        </Container>
      </div>
    </>
  );
      }
}

export default Admin;