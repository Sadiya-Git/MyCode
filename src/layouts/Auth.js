import React from "react";
import { useLocation, Route, Routes, Navigate } from "react-router-dom";
import { Container, Row, Navbar, NavbarBrand, } from "reactstrap";
import routes from "../routes.js";
import { Link } from "react-router-dom";
import Certify360Logo from "../assets/img/icons/common/Certify 360 logo.svg"
import Sidebar from "../components/Sidebar/Sidebar.js";

const Auth = (props) => {
  const mainContent = React.useRef(null);
  const location = useLocation();

  React.useEffect(() => {
    document.body.classList.add("bg-default-login");
    return () => {
      document.body.classList.remove("bg-default-login");
    };
  }, []);
  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/auth") {
        return (
          <Route path={prop.path} element={prop.component} key={key} exact />
        );
      } else {
        return null;
      }
    });
  };

  return (
    <>
      <div className="" ref={mainContent}>

      <Navbar className="navbar-horizontal bg-gradient-default" expand="md" id="sidenav-main">
      <Container fluid>
        <NavbarBrand to="/" tag={Link}>
          <img
            alt="Certify360 Logo"
            className="navbar-logo"
            src={Certify360Logo}
          />
        </NavbarBrand>
        <div className="ml-auto">
          <a href="mailto:support@academy360.ai" className="text-white"><i className="fa fa-envelope" /> {' '}support@academy360.ai</a>
        </div>
      </Container>
    </Navbar>
        <div className="login-container" ref={mainContent}>
            <Row className="">
              <Routes>
                {getRoutes(routes)}
                <Route path="*" element={<Navigate to="/auth/login" replace />} />
              </Routes>
            </Row>
        </div>
      </div>
    </>
  );
};

export default Auth;
