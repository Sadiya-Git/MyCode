import React, { useState, useEffect } from 'react';
import {Container, Col, Card, CardBody, FormGroup, Input, InputGroupAddon,Navbar, InputGroupText, InputGroup, Label, Row, Button,NavbarBrand } from 'reactstrap';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom"
import Alert from '@mui/material/Alert';
import axios from 'axios';
import { Link } from "react-router-dom";
import configData from '../../../config';
import Certify360Logo from "../../../assets/img/icons/common/Certify 360 logo.svg"
const FormSchema = Yup.object().shape({

  pass: Yup
    .string()
    .min(8, 'Password must be 8 characters long')
    .matches(/[0-9]/, 'Password requires a number')
    .matches(/[a-z]/, 'Password requires a lowercase letter')
    .matches(/[A-Z]/, 'Password requires an uppercase letter')
    .matches(/[^\w]/, 'Password requires a symbol'),
  confirm: Yup
    .string()
    .oneOf([Yup.ref('pass'), null], 'Must match "password" field value'),
});

const Forgetpass = () => {
  const mainContent = React.useRef(null);
  const navigate = useNavigate();
  const dispatcher = useDispatch();
  const [isChecked, setIsChecked] = useState(false);
  const [errormsgFromLogin, seterrormsgFromLogin] = useState('');
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showLoader, setshowLoader] = useState(false)
  const [shownotificationMessage,setnotificationMessage]= useState('')
  const [showAlertSeverity,setAlertSeverity]=useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const methodForApi = 'POST';
  const urlApi = configData.API_SERVER + 'reset_password';
  useEffect(() => {
    const storedEmail = localStorage.getItem('rememberedEmail');
    if (storedEmail) {
      setIsChecked(true);
    }
  }, []);
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
  }, []);
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
const tokenFromUrl = document.URL.split('?token=')[1];
console.log(tokenFromUrl,'tokenFromUrl')
  const showPasswordVal = !showPassword ? 'password' : 'text';
  const showConfirmPasswordVal = !showConfirmPassword ? 'password' : 'text';
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
          <a href="mailto:support@example.com" className="text-white"><i className="fa fa-envelope" /> {' '}support@Certify360.com</a>
        </div>
      </Container>
    </Navbar>
      <div className="login-container" ref={mainContent}>
      <Col lg="8" md="9">
        <Card className="shadow border-0 boxshadowEffect positionForRecover">
        {showAlert === true ? <div className='alertForgetPass'>
            <Alert severity= {showAlertSeverity===true?"error":"success"}>
              {shownotificationMessage}
            </Alert>
          </div>
            : null}
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center  mb-4 signinText">Recover Your Password</div>
            <Formik
              initialValues={{
                pass:'',
                confirm: '',
              }}
              validationSchema={FormSchema}
              onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                axios
                  .post(configData.API_SERVER + 'reset_password', {
                    "new_password": window.btoa(values.confirm),
                    "token": tokenFromUrl
                  }).then(function (response) {
                    if (response.data) {
                      setshowLoader(false)
                        if(response.data.success){
                          setnotificationMessage(response.data.message)
                          setShowAlert(true)
                          setAlertSeverity(false)
                          //navigate('/auth/login');
                        }else{
                          setnotificationMessage(response.data.message)
                          setShowAlert(true)
                          setAlertSeverity(true)
                        }  
                    
                    } else {
                      setshowLoader(false)
                      setStatus({ success: false });
                      setErrors({ submit: response.data.msg });
                      setSubmitting(false);
                    }
                  }).catch(function (error) {
                    setshowLoader(false)
                    setShowAlert(true)
                  });
              }}
            >
              {({ errors, handleBlur, handleChange, touched, values }) => (
                <Form>
                  <FormGroup className="groupForEmail">
                    <Label for="email">New Password</Label>
                    <InputGroup className="input-group-alternative marginBottomForNewPassword">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-lock-circle-open" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type={showPasswordVal}
                        value={values.password}
                        placeholder="New Password"
                        name="pass"
                        label="New Password"
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
<InputGroupAddon addonType="append">
                            <InputGroupText>
                              <div className='passwordIcon' onClick={handleShowPassword}></div>
                            </InputGroupText>
                          </InputGroupAddon>
                    </InputGroup>
                    <Label for="email">Confirm New Password</Label>
                    <InputGroup className="input-group-alternative">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-lock-circle-open" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type={showConfirmPasswordVal}
                        value={values.passwordConfirmation}
                        placeholder="Confirm New Password"
                        name="confirm"
                        label="Confirm New Password"
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
<InputGroupAddon addonType="append">
                            <InputGroupText>
                              <div className='passwordIcon' onClick={handleShowConfirmPassword}></div>
                            </InputGroupText>
                          </InputGroupAddon>
                    </InputGroup>
                    
                    {errors.pass && (
                      <span style={{ color: 'red' }}>{errors.pass} </span>
                    )}
                     {errors.confirm && <span style={{ color: 'red' }}>{errors.confirm}</span>}
                  </FormGroup>
                  <div className="text-center errorMessageForLogin">{errormsgFromLogin}</div>
                  <div className="text-center">
                    <Button className="my-4 classForButtonLogin submitForRecoverPassword" color="primary" type="submit" disabled={errors.pass || errors.confirm ||values.pass=="" ||values.confirm==""}>
                      <span>Save</span>

                    </Button>
                  </div>
                </Form>
              )}
            </Formik>

            <Row className="mt-3">
              <Col className="text-left createNewAccountContent" xs="12">
                Don't want to reset?
                <a
                  href="javascript:void(0)"
                  className="text-light linkCreateNewAccountcss"
                  onClick={() => navigate('/auth/login')}
                >
                  <small>Go back to login</small>
                </a>
              </Col>
            </Row>

          </CardBody>
        </Card>
      </Col>
        </div>
     
    </div>
  
    </>
  );
};

export default Forgetpass;
