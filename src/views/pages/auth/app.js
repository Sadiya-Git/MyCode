import React, { useState } from 'react';
import { Card, CardBody, Row, Container, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import classnames from 'classnames';
import { Toaster } from 'react-hot-toast';
import LoginForm from './login'; 
import RegisterForm from './register'; 

const LoginRegister = () => {
  const [activeTab, setActiveTab] = useState('login');

  const toggleTab = tab => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  return (
    <div className="pb-8 pt-5 pt-md-5">
      <Container className="align-items-center" fluid>
        <Row>
          <div className="login-register-container">
            <Card className="login-register-card">
              <Nav tabs>
                <NavItem>
                  <NavLink
                    className={classnames('custom-nav-item', { active: activeTab === 'login' })}
                    onClick={() => { toggleTab('login'); }}
                  >
                    Login
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames('custom-nav-item', { active: activeTab === 'register' })}
                    onClick={() => { toggleTab('register'); }}
                  >
                    Register
                  </NavLink>
                </NavItem>
              </Nav>
              <CardBody>
                <TabContent activeTab={activeTab}>
                  <TabPane tabId="login">
                    {/* Login Form */}
                    <LoginForm />
                  </TabPane>
                  <TabPane tabId="register">
                    {/* Register Form */}
                    <RegisterForm />
                  </TabPane>
                </TabContent>
              </CardBody>
            </Card>
          </div>
        </Row>
      </Container>
      {/* Add Toaster here */}
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default LoginRegister;
