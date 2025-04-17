import React, { useState, useEffect } from 'react';
import { Col, Card, CardBody, FormGroup, Input, InputGroupAddon, InputGroupText, InputGroup, Label, Row, Button } from 'reactstrap';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { ACCOUNT_INITIALIZE } from '../../../store/actions';
import configData from '../../../config';
import { useNavigate } from "react-router-dom"
import { ThreeDots } from 'react-loader-spinner'
import useFetchData from '../component/fetchData';
import CheckIcon from '@mui/icons-material/Check';
import Alert from '@mui/material/Alert';
const Forgetpass = () => {
  const navigate = useNavigate();
  const dispatcher = useDispatch();
  const [isChecked, setIsChecked] = useState(false);
  const [errormsgFromLogin, seterrormsgFromLogin] = useState('');
  const [showPassword, setShowPassword] = useState(false)
  const [notificationMessage, setNotificationMsg] = useState(false)
  const [showLoader, setshowLoader] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [showAlertForSuccess, setAlertForSuccess] = useState(false)

  const methodForApi = 'POST';
  const urlApi = configData.API_SERVER + 'forgot_password';
  let dataForApi = {};

  const { fetchData } = useFetchData();
  useEffect(() => {
    const storedEmail = localStorage.getItem('rememberedEmail');
    if (storedEmail) {
      setIsChecked(true);
    }
  }, []);
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    // Clear the stored email if "Remember Me" is unchecked
    if (!isChecked) {
      localStorage.removeItem('rememberedEmail');
    }
  };
  const handleShowPassword = () => {
    setShowPassword(!showPassword)
  }
  const handleResetLink = () => {


  }


  const showPasswordVal = !showPassword ? 'password' : 'text';
  return (
    <>
        <div className='create-account'>

      <Col lg="7" md="8" className="login-form-container">
            <Card className="shadow border-0 login-card">
          {showAlert === true ? <div className='alertForgetPass'>
            <Alert severity={showAlertForSuccess === true ? "success" : "error"}>
              {notificationMessage}
            </Alert>
          </div>
            : null}
          <CardBody className="px-lg-6 py-lg-6">
            <div className="text-center  mb-4 signinText">Recover Your Password</div>
            <Formik
              initialValues={{
                email: localStorage.getItem('rememberedEmail') || '',
              }}
              validationSchema={Yup.object().shape({
                email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
              })}
              onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                axios
                  .post(configData.API_SERVER + 'forgot_password', {
                    "email": values.email
                  }).then(function (response) {
                    if (response.data) {
                      setShowAlert(true)
                      setAlertForSuccess(response.data.success)
                      setNotificationMsg(response.data.msg)
                      localStorage.setItem('emailForConfirm',response.data.url)
                    } else {
                      setshowLoader(false)
                      setStatus({ success: false });
                      setErrors({ submit: response.data.msg });
                      setSubmitting(false);
                    }
                  }).catch(function (error) {
                    setshowLoader(false)
                    setShowAlert(true)
                    setAlertForSuccess(false)
                    setNotificationMsg('Some Error Occured')
                  });
              }}
            >
              {({ errors, handleBlur, handleChange, touched, values }) => (
                <Form>
                  <FormGroup className="groupForEmail">
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
                        label="Email Address"
                      />

                    </InputGroup>
                    {touched.email && errors.email && (
                      <span style={{ color: 'red' }}>{errors.email} </span>
                    )}
                  </FormGroup>

                  <FormGroup className="groupForPassword">
                    {/* <div className="passwordContainerDiv">
                      <Label for="password">Password</Label>
                      <a
                  href="javascript:void(0)"
                  className="text-light linkLogincss"
                  onClick={() => navigate('/auth/forgot-password')}
                >
                        <small>Forgot password?</small>
                      </a>
                    </div> */}

                  </FormGroup>

                  <div>
                    <Label className="checkbox-container mb-2">
                      {/* <Input
                        type="checkbox"
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                        className="mr-2 custom-checkbox-input-login"
                      />
                      <span className="checkmark"></span>
                      <span className="text-muted">Remember me</span> */}
                    </Label>
                  </div>




                  <div className="text-center errorMessageForLogin">{errormsgFromLogin}</div>

                  <div className="text-center">
                    <Button className="my-4 classForButtonLogin" color="primary" type="submit" onClick={handleResetLink}>
                      {!showLoader ? <span>Send Reset Link</span> :
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

                          <ThreeDots
                            visible={true}
                            height="20"
                            width="40"
                            color="#ffffff"
                            radius="9"
                            ariaLabel="three-dots-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                          />
                        </div>
                      }
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
    </>
  );
};

export default Forgetpass;

