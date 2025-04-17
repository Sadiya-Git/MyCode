

// reactstrap components
import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Label,
  Col,
  Container
} from "reactstrap";
import Alert from '@mui/material/Alert';
import * as Yup from 'yup';
import axios from 'axios';
import configData from '../../../config';
import { Formik, Form } from 'formik';
import { useNavigate } from "react-router-dom"
import { ThreeDots } from 'react-loader-spinner'

const Register = () => {
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);
  const [showLoader, setshowLoader] = useState(false)
  const [showPassword, setshowPassword] = useState(false)
  const [showConfirmPassword, setshowConfirmPassword] = useState(false)
  const [shownotificationMessage,setnotificationMessage]= useState('')
  const [showAlertSeverity,setAlertSeverity]=useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };
  useEffect(() => {
    document.body.classList.add('no-scroll');
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [])
  const showPasswordVal = !showPassword ? 'password' : 'text';
  const showConfirmPasswordVal = !showConfirmPassword ? 'password' : 'text';
  const handleShowConfirmPassword = () => {
    setshowConfirmPassword(!showConfirmPassword)
  }
  const handleShowPassword = () => {
    setshowPassword(!showPassword);
  }
  return (
    <div className='create-account'>

      <Col lg="6" md="8">
        <Card className="shadow border-0 " >
        {showAlert === true ? <div className='alertForgetPass'>
            <Alert severity= {showAlertSeverity===true?"error":"success"}>
              {shownotificationMessage}
            </Alert>
          </div>
            : null}
          <CardBody className="px-lg-3 py-lg-3" >
            {/* <div className="text-center signinText">Create your account</div> */}

            <Formik
              initialValues={{
                username: '',
                email: '',
                password: '',
                confirmpassword: '',
                submit: null
              }}
              validationSchema={Yup.object().shape({
                email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                username: Yup.string().required('Username is required').matches(
                  /^[a-zA-Z0-9@]+$/,
                  "Invalid UserName"
                ),
                password: Yup.string().min(6, "Min character length is 6").required('Password is required'),
                confirmpassword: Yup.string()
                  .oneOf([Yup.ref('password'), null], 'Passwords do not match')
              })}
              onSubmit={(values, { setErrors, setStatus, setSubmitting }) => {

                try {
                  setshowLoader(true)
                  axios
                    .post(configData.API_SERVER + 'users/register', {
                      username: values.username,
                      password: values.password,
                      email: values.email
                    })
                    .then(function (response) {
                      if (response.data.success) {
                        setnotificationMessage(response.data.msg)
                        setShowAlert(true)
                        setAlertSeverity(false)
                        localStorage.setItem("userNameCreateAccount",values.username)
                        localStorage.setItem("emailCreateAccount",values.email)
                        navigate('/route/otp-verification');
                      } else {
                        setshowLoader(false)
                        setnotificationMessage(response.data.msg)
                        setShowAlert(true)
                        setAlertSeverity(true)
                        setStatus({ success: false });
                        setErrors({ submit: response.data.msg });
                        setSubmitting(false);
                      }
                    })
                    .catch(function (error) {
                      setshowLoader(false)
                      setStatus({ success: false });
                      setErrors({ submit: error.response.data.msg });
                      setSubmitting(false);
                    });
                } catch (err) {
                  console.error(err);

                }
              }}
            >
              {({ errors, handleBlur, handleChange, touched, values }) => (

                <Form >
                  <FormGroup className="groupForUserName">
                    <Label for="username">
                      Username
                    </Label>
                    <InputGroup className="input-group-alternative">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-hat-3" />
                        </InputGroupText>
                      </InputGroupAddon>

                      <Input type="text"
                        value={values.username}
                        name="username"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="User name"
                      />

                    </InputGroup>
                    {touched.username && errors.username && (
                      <span style={{ color: 'red' }}>
                        <small>{errors.username}</small>
                      </span>

                    )}
                  </FormGroup>
                  <FormGroup className="groupForEmailRegister">
                    <Label for="email">
                      Email
                    </Label>
                    <InputGroup className="input-group-alternative">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-email-83" />
                        </InputGroupText>
                      </InputGroupAddon>

                      <Input type="email"
                        value={values.email}
                        name="email"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="Email Address"
                      />

                    </InputGroup>
                    {touched.email && errors.email && (
                      <span style={{ color: 'red' }}>
                        <small>{errors.email}{' '}</small>
                      </span>
                    )}
                  </FormGroup>
                  <FormGroup className="groupForPassword">
                    <Label for="password">
                      Password
                    </Label>
                    <InputGroup className="input-group-alternative">

                      <Input
                        placeholder="Password"
                        type={showPasswordVal}
                        value={values.password}
                        name="password"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        autoComplete="new-password"
                      />
                      <InputGroupAddon addonType="append">
                        <InputGroupText>
                          <div className='passwordIcon' onClick={handleShowPassword}></div>
                        </InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                    {touched.password && errors.password && (
                      <span style={{ color: 'red' }}>
                        <small>{errors.password}{' '}</small>
                      </span>
                    )}
                  </FormGroup>
                  <FormGroup className="groupForPassword">
                    <Label for="password">
                      Confirm Password
                    </Label>
                    <InputGroup className="input-group-alternative">
                      <Input
                        placeholder="Confirm Password"
                        type={showConfirmPasswordVal}
                        value={values.confirmpassword}
                        name="confirmpassword"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        autoComplete="new-password"
                      />
                      <InputGroupAddon addonType="append">
                        <InputGroupText>
                          <div className='passwordIcon' onClick={handleShowConfirmPassword}></div>
                        </InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                    {touched.confirmpassword && errors.confirmpassword && (
                      <span style={{ color: 'red' }}>
                        <small>{errors.confirmpassword}{' '}</small>
                      </span>
                    )}
                  </FormGroup>
                  <Row className="my-4 rowForButton">
                    <Col xs="12">
                      <div>
                        <Label className="checkbox-container mb-2">
                          <Input
                            type="checkbox"
                            checked={isChecked}
                            onChange={handleCheckboxChange}
                            className="mr-2 custom-checkbox-input-login"
                          />
                          <span className="checkmark"></span>
                          {/* <span className=" text-light linkCreateNewAccountcss">
                            <small>I agree with the {"    "}</small>
                            <a href="https://academy360.ai/privacy-policy/"                       
onClick={(e) => e.preventDefault()}>
                              <small>Privacy Policy</small>
                            </a>
                          </span> */}
                          <span className="text-light linkCreateNewAccountcss">
                            <small>I agree with the {"    "}</small>
                            <a
                              href="https://academy360.ai/privacy-policy/"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <small>Privacy Policy</small>
                            </a>
                          </span>

                        </Label>
                      </div>

                    </Col>
                  </Row>

                  <div className="text-center">
                    <Button className="my-4 classForButtonLogin create-account-button" color="primary" type="submit" disabled={!isChecked || errors.username === "Invalid UserName"}>
                      {!showLoader ? <span> Create account</span> :
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
                <Label className="checkbox-container mb-2">
                  Already have an account?
                  <a
                    href="javascript:void(0)"
                    className="text-light linkCreateNewAccountcss"
                    onClick={() => navigate('/auth/login')}
                  >
                    <small>Login</small>
                  </a>
                </Label>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
    </div>
  );
};

export default Register;
