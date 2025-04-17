import React, { useState, useEffect } from 'react';
import { Container, Col, Card, CardBody, FormGroup, Input, InputGroupAddon, Navbar, InputGroupText, InputGroup, Label, Row, Button, NavbarBrand } from 'reactstrap';
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
        .min(6, 'OTP must be 6 characters long')
        .max(6, 'OTP must be 6 characters long')
});

const OTPVerification = () => {
    const mainContent = React.useRef(null);
    const navigate = useNavigate();
    const dispatcher = useDispatch();
    const [isChecked, setIsChecked] = useState(false);
    const [errormsgFromLogin, seterrormsgFromLogin] = useState('');
    const [showPassword, setShowPassword] = useState(false)
    const [showResendOtpButton, setShowResendOTPButton] = useState(true);

    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showLoader, setshowLoader] = useState(false)
    const [shownotificationMessage, setnotificationMessage] = useState('')
    const [showAlertSeverity, setAlertSeverity] = useState(false)
    const [showAlert, setShowAlert] = useState(false)
    const methodForApi = 'POST';
    const urlApi = configData.API_SERVER + 'reset_password';
    const urlVerify = configData.API_SERVER + 'users/resendOtp';

    const dataForResendOTP = {
        "username": localStorage.getItem("userNameCreateAccount"),
        "email": localStorage.getItem("emailCreateAccount")
    }
    const handleBackButton = () => {
        navigate('/auth/register');
    }
    const handleResend = async () => {
        axios.post(urlVerify, dataForResendOTP)
            .then(function (response) {
                if (response.data.success) {
                    setnotificationMessage(response.data.msg)
                    setShowAlert(true)
                    setAlertSeverity(false)
                    setShowResendOTPButton(false)
                } else {
                    setnotificationMessage(response.data.msg)
                    setShowAlert(true)
                    setAlertSeverity(false)
                    setShowResendOTPButton(true)
                }
            })
    }
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
    const tokenFromUrl = document.URL.split('&token=')[1];
    console.log(tokenFromUrl, 'tokenFromUrl')
    const showPasswordVal = !showPassword ? 'number' : 'number';
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
                <div className="otpVerificationConatiner" ref={mainContent}>
                    <Col lg="4" md="9">
                        <Card className="shadow border-0 boxshadowEffect positionForRecover">
                            {showAlert === true ? <div className='alertOTPVerifciation'>
                                <Alert severity={showAlertSeverity === true ? "error" : "success"}>
                                    {shownotificationMessage}
                                </Alert>
                            </div>
                                : null}
                            <CardBody className="px-lg-2 py-lg-2">
                                <div className="text-center  mb-4 verifyText">Verify Your OTP</div>
                                <div className="mb-4 verifySubHeadingText">Verify your account by entering the OTP sent to your mail ({localStorage.getItem("emailCreateAccount")}) </div>
                                <Formik
                                    initialValues={{
                                        pass: '',
                                    }}
                                    validationSchema={FormSchema}
                                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                                        axios
                                            .post(configData.API_SERVER + 'users/email_verify', {
                                                "otp": Number(values.pass),
                                                "email": localStorage.getItem("emailCreateAccount")
                                            }).then(function (response) {
                                                if (response.data) {
                                                    setshowLoader(false)
                                                    if (response.data.success) {
                                                        setnotificationMessage(response.data.msg)
                                                        setShowAlert(true)
                                                        setAlertSeverity(false)
                                                        navigate('/auth/login');
                                                    } else {
                                                        setnotificationMessage(response.data.msg)
                                                        setShowAlert(true)
                                                        setAlertSeverity(true)
                                                    }

                                                } else {
                                                    setshowLoader(false)
                                                    setStatus({ success: false });
                                                    setErrors({ submit: response.data.msg });
                                                    setSubmitting(false);
                                                    setnotificationMessage(response.data.msg)
                                                    setShowAlert(true)
                                                    setAlertSeverity(false)
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

                                                <InputGroup className="input-group-alternative marginBottomForNewPassword">
                                                    <Input
                                                        type={showPasswordVal}
                                                        value={values.password}
                                                        name="pass"
                                                        label="New Password"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                    />

                                                </InputGroup>
                                                {errors.pass && (
                                                    <span style={{ color: 'red' }}>{errors.pass} </span>
                                                )}
                                                {errors.confirm && <span style={{ color: 'red' }}>{errors.confirm}</span>}
                                            </FormGroup>
                                            <div className="text-center errorMessageForLogin">{errormsgFromLogin}</div>
                                            <div className="text-center">
                                                <Button className="my-4 classForButtonLogin submitForRecoverPassword" color="primary" type="submit" disabled={errors.pass || errors.confirm || values.pass == "" || values.confirm == ""}>
                                                    <span>Verify</span>
                                                </Button>
                                                {showResendOtpButton ? <Button className="my-4 classForButtonLogin submitForRecoverPassword" color="primary" onClick={handleResend}>
                                                    <span>Resend OTP</span>
                                                </Button> : null}
                                                <div className="backToCreateAccountText" onClick={handleBackButton}>Back To Create Account Page</div>
                                            </div>
                                        </Form>
                                    )}
                                </Formik>
                            </CardBody>
                        </Card>
                    </Col>
                </div>

            </div>

        </>
    );
};

export default OTPVerification;
