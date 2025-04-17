

// reactstrap components
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
  Label,
  Row,
  Col,
} from "reactstrap";
import * as Yup from 'yup';
import { React, useState } from 'react';
import axios from 'axios';
import configData from '../../../config';
import { useDispatch } from 'react-redux';
import { ACCOUNT_INITIALIZE } from '../../../store/actions';
import { Formik, Form } from 'formik';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";


import { useNavigate } from "react-router-dom"
const Login = () => {
  const navigate = useNavigate();

  const dispatcher = useDispatch();

 const responseMessage = async(credentialResponse) => {
      var obj = jwtDecode(credentialResponse.credential);
      var data = JSON.stringify(obj);
      const config = {
        method: 'POST',
        url: 'https://studybot-ehasl4rfha-uc.a.run.app/api/VerifyGoogle',
        headers: {},
        data: data
      }
     let responseData = await axios(config);
     if (responseData && responseData.data) {
         navigate('/admin/index')
      console.log(responseData.data);
    } else {
      console.error("Error: Empty or invalid response");
    }
  };
  const errorMessage = (error) => {
    console.log("on error", error);
  };
  const [isChecked, setIsChecked] = useState(false);
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };
  const [errormsgFromLogin,seterrormsgFromLogin]= useState('')

  return (
    <>
      <Col lg="8" md="9">
        <Card className="shadow border-0 boxshadowEffect">
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center  mb-4 signinText">
              Sign in to your account
            </div>
            <Formik
              initialValues={{
                password: '',
                email: '',
              }}
              validationSchema={Yup.object().shape({
                email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                password: Yup.string().max(255).required('Password is required')
              })}
              onSubmit={(values, { setErrors, setStatus }) => {
                // same shape as initial values
                localStorage.setItem('emailForPayment', values.email)
                try {
                  axios
                    .post(configData.API_SERVER + 'users/login', {
                      password: window.btoa(values.password),
                      email: values.email
                    })
                    .then(function (response) {
                      if (response.data.success) {
                        console.log(response.data);
                        seterrormsgFromLogin('')
                        dispatcher({
                          type: ACCOUNT_INITIALIZE,
                          payload: { isLoggedIn: true, user: response.data.user, token: response.data.token, isAdmin: response.data.is_admin }
                        });
                        // const account = useSelector((state) => state.account);
                        // const { isLoggedIn } = account;

                        // if (isLoggedIn) {
                        navigate('/admin/index');
                        // }


                      } else {
                        setStatus({ success: false });
                        setErrors({ submit: response.data.msg });
                        seterrormsgFromLogin(response.data.msg)
                      }
                    })
                    .catch(function (error) {
                      setStatus({ success: false });
                      setErrors({ submit: error.response.data.msg });
                      seterrormsgFromLogin(error.response.data.msg)
                    });
                } catch (err) {
                  console.error(err);

                }
              }}
            >
              {({ errors, handleBlur, handleChange, touched, values }) => (
                <Form >
                  <FormGroup className="groupForEmail">
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
                        placeholder="Email"
                        name="email"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        label="Email Address"
                      />

                    </InputGroup>
                    {touched.email && errors.email && (
                      <span style={{ color: 'red' }}>
                        {errors.email}{' '}
                      </span>
                    )}
                  </FormGroup>
                  <FormGroup className="groupForPassword">
                    <div className="passwordContainerDiv">
                      <Label for="password">
                        Password
                      </Label>
                      <a
                        className="text-light linkLogincss"
                        // tag={Link}
                        href="javascript:void(0)"
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
                        type="password"
                        value={values.password}
                        name="password"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        autoComplete="new-password"
                      />
                    </InputGroup>
                           {touched.password && errors.password && (
                      <span style={{ color: 'red' }}>
                        {errors.password}{' '}
                      </span>
                    )}
                  </FormGroup>
                  <div className=" ">

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
                  <div className="text-center errorMessageForLogin">
                      {errormsgFromLogin}
                  </div>
                  <div className="text-center">
                  <Button className="my-4 classForButtonLogin" color="primary" type="submit" >

                  Sign in
                </Button>
                    {/* <Button className="my-4 classForButtonLogin" color="primary" type="submit" >
                      <i class="fas fa-angle-right"></i>
                    </Button> */}
                    {/* <button className="my-4" color="primary" type="submit"> Sign in</button> */}

                  </div>
                </Form>
              )}


            </Formik>
            <Row className="mt-3">
          <Col className="text-left createNewAccountContent" xs="12">
            Don't have an account? 
            <a
              href="javascript:void(0)"
              className="text-light linkCreateNewAccountcss"
              onClick={() => navigate('/auth/register')}
            >
              <small>Create new account</small>
            </a>
          </Col>
        </Row>
        <div className="signInGoogleLogin">
        <div className="px-lg-7">
              <GoogleLogin onSuccess={responseMessage} onError={errorMessage} text={'continue_with'} redirectUri="https://certi5-m7v2vrekeq-uc.a.run.app/login/google/"/>
        </div>
        </div>
        
          </CardBody>
        </Card>
       
      </Col>
    </>
  );
};

export default Login;
