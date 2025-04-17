import React, { useState } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Container,
  Row,
  Col,
  Media,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { LOGOUT } from "store/actions";
import configData from '../../config';
import axios from 'axios';
import { googleLogout } from '@react-oauth/google';
import Certify360Logo from "../../assets/img/icons/common/Certify 360 logo.svg"; 
import Certify360LogoToggle from "../../assets/img/icons/common/Certify360_logo_black.png"; 

const ResponsiveHeader = ({ routes }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };
  const toggleCollapse = () => {
    setIsOpenCollapse(!isOpenCollapse);
  };
  const dispatcher = useDispatch();
  const account = useSelector((state) => state.account);
  const isAdmin = useSelector((state) => state.account.isAdmin);
  const isUserLoggedInIsAdmin = localStorage.getItem('isAdmin');
  const userName = localStorage.getItem('profileUserName');

  const createLinks = (routes) => {
    const standardLinks = routes
      .filter((prop) => prop.showcomponent)
      .map((prop, key) => {
        if (prop.name === "Certification Details" && isUserLoggedInIsAdmin==="true") {
          return (
            <NavItem key={key}>
              <NavLink
                to={prop.layout + prop.path}
                tag={Link}
                onClick={toggle}
                className='text-white'
              >
                <i className={prop.icon} />&nbsp;
                <b>{prop.name}</b>
              </NavLink>
            </NavItem>
          );
        } else if (prop.name === "User Details" && isUserLoggedInIsAdmin==="true") {
          console.log(prop.name,'wewe--->')
          return (
            <NavItem key={key}>
              <NavLink
                to={prop.layout + prop.path}
                tag={Link}
                onClick={toggle}
                className='text-white'
              >
                <i className={prop.icon} />&nbsp;
                <b>{prop.name}</b>
              </NavLink>
            </NavItem>
          );
        }
         else if (prop.name==="Certificates" || prop.name==="Score") {
          console.log(prop.name,'wewe33--->')
          return (
            <NavItem key={key}>
              <NavLink
                to={prop.layout + prop.path}
                tag={Link}
                onClick={toggle}
                className='text-white'
              >
                <i className={prop.icon} />&nbsp;
                <b>{prop.name}</b>
              </NavLink>
            </NavItem>
          );
        }
      });
  
    return (
      <>
        {standardLinks}
        <NavItem>
          <NavLink
            href="mailto:support@academy360.ai"  // Add the Get Support link here
            className='text-white'
          >
            <b>Get Support</b>
          </NavLink>
        </NavItem>
      </>
    );
  };
  
  const onAccountLogout = () => {
    dispatcher({
      type: LOGOUT,
    });
    if (account.isGoogleLogin) {
      googleLogout();
    } else {
      localStorage.setItem('isAdmin',false)
      axios.post(configData.API_SERVER + 'users/logout', {}, {
        headers: { Authorization: 'Bearer ' + account.token },
      });
    }
  };

 return (
    <Navbar className="navbar-horizontal bg-gradient-default navbar-expand-custom" expand="md" id="sidenav-main">
      <Container fluid>
        <NavbarBrand to="/" tag={Link}>
          <img
            alt="Certify360 Logo"
            className="navbar-logo"
            src={Certify360Logo}
          />
        </NavbarBrand>
        <NavbarToggler className="navbar-light" onClick={toggleCollapse} type="button">
          <span className="navbar-toggler-icon" />
        </NavbarToggler>
        <Collapse isOpen={isOpenCollapse} navbar>
          <div className="navbar-collapse-header d-md-none">
            <Row>
              <Col className="collapse-brand" xs="6">
                <Link to="/">
                  <img
                    alt="Certify360 Logo"
                    style={{ height: "90px", width: "90px" }}
                    src={Certify360LogoToggle}
                  />
                </Link>
              </Col>
              <Col className="collapse-close" xs="6">
                <button
                  className="navbar-toggler"
                  type="button"
                  onClick={toggleCollapse}
                >
                  <span />
                  <span />
                </button>
              </Col>
            </Row>
          </div>
  
          <Nav className="mr-auto" navbar>
            {isOpenCollapse ? (
              <>
              {createLinks(routes)}
                <NavItem>
                  <NavLink
                    to="/admin/user-profile"
                    tag={Link}
                    onClick={toggleCollapse}
                    className='text-white'
                  >
                    <b>My Profile</b>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    to="/auth/login"
                    tag={Link}
                    onClick={() => { onAccountLogout(); toggleCollapse(); }}
                    className='text-white'
                  >
                    <b>Logout</b>
                  </NavLink>
                </NavItem>
              </>
            ) : (
              <>
                {createLinks(routes)}
                  <Nav className="ml-auto justify-content-end iconsPosition" navbar>
                  <Container className="containerForIcons">
                    <UncontrolledDropdown nav>
                      <DropdownToggle nav>
                        <Media className="justify-content-end">
                          <span className="avatar avatar-sm rounded-circle">
                            <img
                              alt="..."
                              src={require("../../assets/img/theme/profile-new.png")}
                            />
                          </span>
                        </Media>
                      </DropdownToggle>
                      <DropdownMenu className="dropdown-menu-arrow" right>
                        <DropdownItem className="noti-title" header tag="div">
                                                   <h5 className="text-overflow m-0"> {`Welcome ${userName}`}                          </h5>
                        </DropdownItem>
                        <DropdownItem to="/admin/user-profile" tag={Link}>
                          <i className="ni ni-single-02" />
                          <span>My profile</span>
                        </DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem to="/auth/login" tag={Link} onClick={onAccountLogout}>
                          <i className="ni ni-user-run" />
                          <span>Logout</span>
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </Container>
                </Nav>
              </>
            )}
          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  );
};

export default ResponsiveHeader;
