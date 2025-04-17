import React, { useState, useEffect } from 'react';
import { Col, Card, CardBody, FormGroup, Input, Container, InputGroupAddon, InputGroupText, InputGroup, Label, Row, Button } from 'reactstrap';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import { useDispatch, useSelector } from 'react-redux';
import { ACCOUNT_INITIALIZE } from '../../../store/actions';
import configData from '../../../config';
import { useNavigate } from "react-router-dom";
import { ThreeDots } from 'react-loader-spinner';
import Certify360Logo from "../../../assets/img/icons/common/Certify 360 logo.svg";
import Certify360Icon1 from "../../../assets/img/icons/common/AI based Learning Feedback.png";
import Certify360Icon2 from "../../../assets/img/icons/common/Industry Standard Certification.png";
import Certify360Icon3 from "../../../assets/img/icons/common/Personalize Practice Que.png";
import Certify360Icon4 from "../../../assets/img/icons/common/Visualize Reports and Analytics.png";
import useFetchData from '../component/fetchData';
import { setUserProfile } from "store/actions";

// import './Login.css';  // Import the custom CSS file

const GoogleLoginButton = () => {
  const navigate = useNavigate();
  const dispatcher = useDispatch();


  const responseGoogle = async (response) => {
    try {
      const backendResponse = await axios.post(configData.API_SERVER + 'VerifyGoogle', {
        tokenId: response.credential,
      });
      localStorage.setItem('emailForPayment', backendResponse.data.user.email);
      localStorage.setItem('profileUserName', backendResponse.data.user_info.name);
      if (backendResponse.data.success) {

        dispatcher({
          type: ACCOUNT_INITIALIZE,
          payload: { isLoggedIn: true, user: backendResponse.data.user, token: backendResponse.data.token, isGoogleLogin: true },
        });
        navigate('/admin/index');
      }
    } catch (error) {
      console.error('Error during Google login:', error);
    }
  };

  return (
    <GoogleLogin
      clientId="678138449376-njuhfuaoh2rff0g9djjlgu754p8fqn03.apps.googleusercontent.com"
      buttonText="Login with Google"
      onSuccess={responseGoogle}
      onFailure={responseGoogle}
      cookiePolicy={'single_host_origin'}
      uxMode="popup"
      prompt="select_account"
    />
  );
};

const Login = () => {
  const { fetchData } = useFetchData();
  const navigate = useNavigate();
  const dispatcher = useDispatch();
  const [isChecked, setIsChecked] = useState(false);
  const [errormsgFromLogin, seterrormsgFromLogin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showLoader, setshowLoader] = useState(false);
  const url = configData.API_SERVER + 'users';
  const data = {}, method = 'get';
  const account = useSelector((state) => state.account);

  useEffect(() => {
    const storedEmail = localStorage.getItem('rememberedEmail');
    if (storedEmail) {
      setIsChecked(true);
    }
    document.body.classList.add('no-scroll');
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, []);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    if (!isChecked) {
      localStorage.removeItem('rememberedEmail');
    }
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const showPasswordVal = !showPassword ? 'password' : 'text';

  return (
    <>
      <Container fluid className="loginpass-container" style={{ marginBottom: '40px' }}>
        <Row className="login-row">
          <Col lg="6" md="12" className="certification-content mb-4"  >
            <div className="certification-info text-center">
              <img
                alt="Certify360 Logo"
                className="navbar-logo img-fluid"
                src={Certify360Logo}
              />
              <h2>Your Bridge to Professional Mastery</h2>
              <div className="d-flex justify-content-center flex-wrap">
                <div className="d-flex flex-column align-items-center m-3">
                  <img alt="Certify360 Logo1" className="login-logo img-fluid" src={Certify360Icon1} />
                  <h3 className="m-0">AI Based Learning</h3>
                </div>
                <div className="d-flex flex-column align-items-center m-3">
                  <img alt="Certify360 Logo2" className="login-logo img-fluid" src={Certify360Icon2} />
                  <h3 className="m-0">Industry Certification</h3>
                </div>
                <div className="d-flex flex-column align-items-center m-3">
                  <img alt="Certify360 Logo3" className="login-logo img-fluid" src={Certify360Icon3} />
                  <h3 className="m-0">Personalize Practice</h3>
                </div>
                <div className="d-flex flex-column align-items-center m-3">
                  <img alt="Certify360 Logo4" className="login-logo img-fluid" src={Certify360Icon4} />
                  <h3 className="m-0">Visual Reports</h3>
                </div>
              </div>
            </div>
          </Col>
          <Col lg="6" md="12" className="login-form-container">
            <Card className="shadow border-0 login-card">
              <CardBody className="px-lg-4 py-lg-5">
                <Formik
                  initialValues={{
                    password: '',
                    email: localStorage.getItem('rememberedEmail') || '',
                  }}
                  validationSchema={Yup.object().shape({
                    email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                    password: Yup.string().max(255).required('Password is required'),
                  })}
                  onSubmit={async (values, { setErrors, setStatus, setFieldValue }) => {
                    if (isChecked) {
                      localStorage.setItem('rememberedEmail', values.email);
                    } else {
                      localStorage.removeItem('rememberedEmail');
                    }
                    try {
                      setshowLoader(true);
                      const response = await axios.post(configData.API_SERVER + 'users/login', {
                        password: window.btoa(values.password),
                        email: values.email,
                      });
                      fetchData(method, url, data, response.data.token,
                        (response) => {
                          const userProfile = response;
                          localStorage.setItem('profileUserName', userProfile.user.first_name);
                          dispatcher(setUserProfile({ username: userProfile.user.first_name }));
                        },
                        (error) => {
                          console.error("Error occurred:", error);
                        }
                      );
                      if (response.data.success) {
                        localStorage.setItem('emailForPayment', response.data.user.email);
                        localStorage.setItem('isAdmin', response.data.is_admin);
                        localStorage.setItem('subscription', response.data.subscriptions);
                        localStorage.setItem("user", JSON.stringify(response.data.user));
                        localStorage.setItem("token", response.data.token);
                        localStorage.setItem("isSubscribed", JSON.stringify(response.data.subscriptions));

                        seterrormsgFromLogin('');
                        dispatcher({
                          type: ACCOUNT_INITIALIZE,
                          payload: { isLoggedIn: true, user: response.data.user, token: response.data.token, isGoogleLogin: false, isAdmin: response.data.is_admin, isSubscribed: response.data.subscriptions },
                        });

                        navigate('/admin/index');
                      } else {
                        setshowLoader(false);
                        setStatus({ success: false });
                        setErrors({ submit: response.data.msg });
                        seterrormsgFromLogin(response.data.msg);
                      }
                    } catch (error) {
                      setshowLoader(false);
                      setStatus({ success: false });
                      setErrors({ submit: error.response.data.msg });
                      seterrormsgFromLogin(error.response.data.msg);
                    }
                  }}
                >
                  {({ errors, handleBlur, handleChange, touched, values }) => (
                    <Form>
                      <FormGroup>
                        <Label for="email">Email</Label>
                        <InputGroup className="input-group-alternative">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="ni ni-email-83" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            type="email"
                            value={values.email}
                            placeholder="Email"
                            name="email"
                            onBlur={handleBlur}
                            onChange={handleChange}
                          />
                        </InputGroup>
                        {touched.email && errors.email && (
                          <span style={{ color: 'red' }}>{errors.email}</span>
                        )}
                      </FormGroup>

                      <FormGroup>
                        <div className="d-flex justify-content-between align-items-center passwordContainerDiv">
                          <Label for="password">Password</Label>
                          <a
                            href="javascript:void(0)"
                            className="text-light linkLogincss"
                            onClick={() => navigate('/auth/forgot-password')}
                          >
                            <small>Forgot password?</small>
                          </a>
                        </div>

                        <InputGroup className="input-group-alternative">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="ni ni-lock-circle-open" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            placeholder="Password"
                            type={showPasswordVal}
                            value={values.password}
                            name="password"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            autoComplete="off"
                          />
                          <InputGroupAddon addonType="append">
                            <InputGroupText>
                              <div className='passwordIcon' onClick={handleShowPassword}></div>
                            </InputGroupText>
                          </InputGroupAddon>
                        </InputGroup>
                        {touched.password && errors.password && (
                          <span style={{ color: 'red' }}>{errors.password}</span>
                        )}
                      </FormGroup>
                      <div>
                        <Label className="checkbox-container mb-2">
                          <Input
                            type="checkbox"
                            checked={isChecked}
                            onChange={handleCheckboxChange}
                            className="mr-2 custom-checkbox-input-login"
                          />
                          <span className="checkmark"></span>
                          <span className="text-muted">Remember me</span>
                        </Label>
                      </div>

                      <div className="text-center text-danger">
                        {errormsgFromLogin}
                      </div>

                      <div className="text-center">
                        <Button color="primary" type="submit" className="btn-block">
                          {!showLoader ? 'Sign in' :
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <ThreeDots visible={true}
                                height="20"
                                width="40"
                                color="#ffffff"
                                radius="9"
                                ariaLabel="three-dots-loading"
                                wrapperStyle={{}}
                                wrapperClass=""
                              />
                            </div>}
                        </Button>
                      </div>
                    </Form>
                  )}
                </Formik>

                {/* <Row className="mt-3 text-center">
                  <Col>
                    <small>Don't have an account?</small>
                    <a
                      href="javascript:void(0)"
                      className="text-light ml-2"
                      onClick={() => navigate('/auth/register')}
                    >
                      <small>Create new account</small>
                    </a>
                  </Col>
                </Row> */}
                <Row className="mt-3 text-center">
                  <Col className="text-light linkCreateNewAccountcss" xs="12">
                    <small> Don't have an account?{'    '}</small>
                    <a
                      href="javascript:void(0)"
                      className="text-light linkCreateNewAccountcss"
                      onClick={() => navigate('/auth/register')}
                    >
                      <small>Create new account</small>

                    </a>
                  </Col>
                </Row>

                <div className="signInGoogleLogin text-center mt-4">
                  <GoogleLoginButton />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Login;
