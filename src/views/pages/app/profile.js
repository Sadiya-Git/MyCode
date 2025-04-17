
import React, { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Input,
  InputGroup,
  Container,
  Row,
  Col,
  Table
} from 'reactstrap';
import configData from '../../../config';
import { useSelector } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import { Modal, ModalBody } from 'reactstrap';
import { ThreeDots } from 'react-loader-spinner'
import useFetchData from '../component/fetchData';
import { useNavigate } from "react-router-dom"
import * as Yup from 'yup';

const Profile = () => {
  const { fetchData } = useFetchData();
  const account = useSelector((state) => state.account);
  const navigate = useNavigate();
  const [isPopupOpen, setPopupOpen] = useState(false);
  const togglePopup = () => setPopupOpen(!isPopupOpen);
  const isPremiumUser = localStorage.getItem('isPremiumUser');
  const [enableUpdateButton, setenableUpdateButton] = useState(false);
  const [isPopupOpenForSuccess, setPopupOpenForSuccess] = useState(false);
  const togglePopupForSuccess = () => setPopupOpenForSuccess(!isPopupOpenForSuccess);
  const [loading, setloading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState([]);
  const [initialValues, setInitialValues] = useState({

  });
  const toggleModalForSuccess = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    setPopupOpenForSuccess(true);
    setTimeout(() => {
      // Close the wait popup after the process is complete
      //setPopupOpenForSuccess(false);
    }, 10000);
  }
  useEffect(() => {

  }, [])
  const handleModalClickForSuccess = () => {
    setPopupOpenForSuccess(false)
  }
  const handleModalClick = () => {
    setPopupOpen(false)
    // navigate(`/admin/user-profile`);
  }
  const getFormattedDate = (date) => {
    if (date) {
      var year = date.getFullYear();

      var month = (1 + date.getMonth()).toString();
      month = month.length > 1 ? month : '0' + month;

      var day = date.getDate().toString();
      day = day.length > 1 ? day : '0' + day;

      return year + '-' + month + '-' + day;
    } else {
      return ""
    }

  }
  const url = configData.API_SERVER + 'users';
  const data = {}, method = 'get';
  const urlPaymentDetails = configData.API_SERVER + 'paydetails'
  const dataPaymentDetails = {}, methodPaymentDetails = 'get';
  const fetchUserPaymentDetails = async () => {
    try {
      fetchData(methodPaymentDetails, urlPaymentDetails, dataPaymentDetails, account.token,
        (response) => {
          const paymentDetails = response?.details;
          const detailsTodisplay = paymentDetails.map(item => {
            let obj = {};
            obj.endDate = item.end_date !== "N/A" ? item.end_date.split('T')[0] : item.end_date;
            obj.startDate = item.start_date !== "N/A" ? item.start_date.split('T')[0] : item.start_date;
            obj.certificate = item.certificate;
            return obj
          })
          setPaymentDetails(detailsTodisplay)
          setloading(false)
          //console.log("initial values are", initialValues)
        },
        (error) => {
          console.error("Error occurred:", error);
        }
      );
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }
  const fetchUserProfile = async () => {
    try {
      fetchData(method, url, data, account.token,
        (response) => {
          const userProfile = response;
          setInitialValues({
            first_name: userProfile.user.first_name,
            last_name: userProfile.user.last_name,
            email:userProfile.user.email,
            address: userProfile.user.address,
            city: userProfile.user.city,
            country: userProfile.user.country,
            postal_code: userProfile.user.postal_code,
            about_me: userProfile.user.about_me,
          });
          setloading(false)
          console.log("initial values are", initialValues)
          const paymentSuccess = localStorage.getItem('isModelRequired')
          if (paymentSuccess === 'true') {
            toggleModalForSuccess()
          }
          localStorage.setItem('isModelRequired', false)
        },
        (error) => {
          console.error("Error occurred:", error);
        }
      );
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchUserPaymentDetails();
  }, [account.token]);

  const handleSubmit = async (values) => {
    let method = 'put';
    try {
      fetchData(method, url, {
        first_name: values.first_name,
        last_name: values.last_name,
        address: values.address,
        city: values.city,
        country: values.country,
        postal_code: values.postal_code,
        about_me: values.about_me,
      }, account.token,
        (response) => {
          setenableUpdateButton(false)
          setInitialValues(values);
          window.scrollTo({
            top: 0,
            behavior: 'smooth', // You can use 'auto' instead of 'smooth' for an instant scroll
          });

          setPopupOpen(true)
          console.log('Profile updated successfully:', response.data);
        },
        (error) => {
          console.error("Error occurred:", error);
        }
      );
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };
  const AnimationPopupForSuccessPayement = ({ isOpen, toggle }) => {
    return (
      <CSSTransition
        in={isOpen}
        timeout={300} // Set the duration of the animation
        classNames="nice-animation"
        unmountOnExit
      >
        <Modal isOpen={isOpen} toggle={toggle}>
          <ModalBody classsName="contentCenter">
            <div className='successMessageContainer'>
              <div className='successPaymentIcon'></div>
              <h2 className="successText">SUCCESS </h2>
              <h5>Thanks for Your Subscription payment</h5>
              <h5></h5>
              <Button
                // color="primary"
                className=" outline text-white bg-green buttonCss"
                disabled={false}
                onClick={() => handleModalClickForSuccess()}
                size="lg"
              >
                OK
              </Button>
            </div>

          </ModalBody>
        </Modal>

      </CSSTransition>
    );
  };
  const AnimationPopup = ({ isOpen, toggle }) => {
    return (
      <CSSTransition
        in={isOpen}
        timeout={300} // Set the duration of the animation
        classNames="nice-animation"
        unmountOnExit
      >
        <Modal isOpen={isOpen} toggle={toggle}>
          <ModalBody classsName="contentCenter">
            <div className='successMessageContainer'>
              <div className='successPaymentIcon'></div>
              <h2>Profile updated successfully..! </h2>
              {/* <h5>Thanks for Your Subscription payment</h5> */}
              <h5></h5>
              <Button
                // color="primary"
                color="primary"
                disabled={false}
                onClick={() => handleModalClick()}
                size="lg"
              >
                Close
              </Button>
            </div>

          </ModalBody>
        </Modal>

      </CSSTransition>
    );
  };
  const noSpecialCharRegex = /^[a-zA-Z\s]*$/;

  const validationSchema = Yup.object().shape({
    first_name: Yup.string()
      .nullable()
      .min(2, 'First name must be at least 2 characters')
      .max(50, 'First name must be less than 50 characters')
      .matches(noSpecialCharRegex, 'First name cannot contain special characters or numeric values')
      .required('First name is required')
  });
  return (
    <>
      <div className="header pb-8 pt-5 pt-lg-8 d-flex align-items-center">
        <Container className="mt--10" fluid>
          {isPopupOpen ?
            <AnimationPopup isOpen={isPopupOpen} toggle={togglePopup} />
            : null}
          {isPopupOpenForSuccess ?
            <AnimationPopupForSuccessPayement isOpen={isPopupOpenForSuccess} toggle={togglePopupForSuccess} /> : null}
          {
            loading ? <div
              className="header pb-8 pt-5 pt-lg-6 d-flex align-items-center"

            >
              <Container className="mt--10" fluid>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '40vh' }}>

                  <ThreeDots
                    visible={true}
                    height="80"
                    width="80"
                    color="#172b4d"
                    radius="9"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                  />
                </div>

              </Container>
            </div> :
              <Row>
                <Col className="order-xl-2 mb-5 mb-xl-0" xl="5">
                  <Card className="card-profile shadow">
                    <Row className="justify-content-center">
                      <Col className="order-lg-2" lg="3">
                        <div className="card-profile-image">
                          <a href={void (0)} onClick={(e) => e.preventDefault()}>
                            <img
                              alt="..."
                              className="rounded-circle"
                              src={require("../../../assets/img/theme/profile-new.png")}
                            />
                          </a>

                        </div>
                      </Col>
                    </Row>
                    <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">

                    </CardHeader>
                    <CardBody className="pt-0 pt-md-4">
                      <div className="text-center">
                        <h3>
                          {initialValues.first_name != null && initialValues.last_name != null ? ` ${initialValues.first_name}  ${initialValues.last_name}` : null}
                          <span className="font-weight-light"></span>
                        </h3>
                        <div className="h5 font-weight-300">
                          <i className="ni location_pin mr-2" />
                          {initialValues.city != null && initialValues.country != null ? ` ${initialValues.city}  ${initialValues.country}` : null}
                        </div>
                        {isPremiumUser === 'true' ? <div className="textClassForPremiumSubscriber">
                          You are a premium subscriber
                        </div> : null}
                        <h3 className="paymentDetailsHeading">Payment History Details</h3>
                        <Table className="align-items-center table-flush" responsive>
                          <thead className="thead-light">
                            <tr>
                              <th scope="col">Certificate</th>
                              <th scope="col">Plan Start Date</th>

                              <th scope="col">Plan End Date</th>

                            </tr>
                          </thead>
                          <tbody>

                            {paymentDetails.map(item => {
                              return (
                                <tr>
                                  <td>{item.certificate}</td>
                                  <td>{item.startDate}</td>
                                  <td>{item.endDate}</td>
                                </tr>

                              )
                            })

                            }


                          </tbody>
                        </Table>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                <Col className="order-xl-1" xl="7">
                  <Card className="bg-gradient-default shadow">
                    <CardHeader className="bg-gradient-default  border-0">
                      <Row className="align-items-center">
                        <Col xs="8">
                          <h3 className="mb-0 text-white">My account</h3>
                        </Col>
                        {!enableUpdateButton ? <Col className="text-right" xs="4">
                          <Button
                            color="primary"
                            // href="#pablo"
                            onClick={() => setenableUpdateButton(true)}
                            size="sm"
                          >
                            Edit the details
                          </Button>
                        </Col> : null}
                      </Row>
                    </CardHeader>
                    <CardBody>
                      {Object.keys(initialValues).length > 0 && (

                        <Formik
                          initialValues={initialValues}
                          validationSchema={validationSchema}
                          onSubmit={handleSubmit}
                        >
                          {({ errors, handleBlur, handleChange, touched, values }) => (
                            <Form>
                              <h6 className="heading-small text-white mb-4">User information</h6>
                              <div className="pl-lg-4">
                                <Row>
                                  <Col lg="6">
                                    <FormGroup className="mb-3">
                                      <label className="form-control-label text-white" htmlFor="input-first-name">
                                        First name
                                      </label>
                                      <InputGroup className="input-group-alternative">
                                        <Input
                                          type="text"
                                          value={values.first_name}
                                          name="first_name"
                                          onBlur={handleBlur}
                                          onChange={handleChange}
                                          placeholder="First name"
                                          readOnly={!enableUpdateButton}
                                        />
                                      </InputGroup>
                                      {touched.first_name && errors.first_name && (
                                        <span style={{ color: 'red' }}>
                                          <small>{errors.first_name}</small>
                                        </span>
                                      )}
                                    </FormGroup>
                                  </Col>

                                  <Col lg="6">
                                    <FormGroup className="mb-3">
                                      <label className="form-control-label text-white" htmlFor="input-last-name">
                                        Last name
                                      </label>
                                      <InputGroup className="input-group-alternative">
                                        <Input
                                          type="text"
                                          value={values.last_name}
                                          name="last_name"
                                          onBlur={handleBlur}
                                          onChange={handleChange}
                                          placeholder="Last name"
                                          readOnly={!enableUpdateButton}
                                        />
                                      </InputGroup>
                                      {touched.last_name && errors.last_name && (
                                        <span style={{ color: 'red' }}>
                                          <small>{errors.last_name}</small>
                                        </span>
                                      )}
                                    </FormGroup>
                                  </Col>
                                  
                                </Row>
                                <Row>
                                <Col lg="6">
                                    <FormGroup className="mb-3">
                                      <label className="form-control-label text-white" htmlFor="input-last-name">
                                        Email
                                      </label>
                                      <InputGroup className="input-group-alternative">
                                        <Input
                                          type="text"
                                          value={values.email}
                                          name="email"
                                          onBlur={handleBlur}
                                          onChange={handleChange}
                                          placeholder="Email"
                                          readOnly={true}
                                        />
                                      </InputGroup>
                                    </FormGroup>
                                  </Col>
                                </Row>
                              </div>
                              <hr className="my-4" />
                              <h6 className="heading-small text-white mb-4 text-white">Contact information</h6>
                              <div className="pl-lg-4">
                                <Row>
                                  <Col md="12">
                                    <FormGroup className="mb-3">
                                      <label className="form-control-label text-white" htmlFor="input-address">
                                        Address
                                      </label>
                                      <InputGroup className="input-group-alternative">
                                        <Input
                                          type="text"
                                          value={values.address}
                                          name="address"
                                          onBlur={handleBlur}
                                          onChange={handleChange}
                                          placeholder="Home Address"
                                          readOnly={!enableUpdateButton}
                                        />
                                      </InputGroup>
                                      {touched.address && errors.address && (
                                        <span style={{ color: 'red' }}>
                                          <small>{errors.address}</small>
                                        </span>
                                      )}
                                    </FormGroup>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col lg="6">
                                    <FormGroup className="mb-3">
                                      <label className="form-control-label text-white" htmlFor="input-city">
                                        City
                                      </label>
                                      <InputGroup className="input-group-alternative">
                                        <Input
                                          type="text"
                                          value={values.city}
                                          name="city"
                                          onBlur={handleBlur}
                                          onChange={handleChange}
                                          placeholder="City"
                                          readOnly={!enableUpdateButton}
                                        />
                                      </InputGroup>
                                      {touched.city && errors.city && (
                                        <span style={{ color: 'red' }}>
                                          <small>{errors.city}</small>
                                        </span>
                                      )}
                                    </FormGroup>
                                  </Col>

                                  <Col lg="6">
                                    <FormGroup className="mb-3">
                                      <label className="form-control-label text-white" htmlFor="input-country">
                                        Country
                                      </label>
                                      <InputGroup className="input-group-alternative">
                                        <Input
                                          type="text"
                                          value={values.country}
                                          name="country"
                                          onBlur={handleBlur}
                                          onChange={handleChange}
                                          placeholder="Country"
                                          readOnly={!enableUpdateButton}
                                        />
                                      </InputGroup>
                                      {touched.country && errors.country && (
                                        <span style={{ color: 'red' }}>
                                          <small>{errors.country}</small>
                                        </span>
                                      )}
                                    </FormGroup>
                                  </Col>
                                </Row>
                              </div>
                              <hr className="my-4" />
                              <h6 className="heading-small text-white mb-4">About me</h6>
                              <div className="pl-lg-4">
                                <FormGroup className="mb-3">
                                
                                  <InputGroup className="input-group-alternative">
                                    <Input
                                      type="textarea"
                                      value={values.about_me}
                                      name="about_me"
                                      onBlur={handleBlur}
                                      onChange={handleChange}
                                      placeholder="A few words about you..."
                                      readOnly={!enableUpdateButton}
                                      rows="4"
                                    />
                                  </InputGroup>
                                  {touched.about_me && errors.about_me && (
                                    <span style={{ color: 'red' }}>
                                      <small>{errors.about_me}</small>
                                    </span>
                                  )}
                                </FormGroup>
                              </div>
                              <div className="pl-lg-8">
                                {enableUpdateButton ? (
                                  <Col className="text-right" xs="6">
                                    <Button color="primary" type="submit" size="lg">
                                      Update
                                    </Button>
                                  </Col>
                                ) : null}
                              </div>
                            </Form>
                          )}
                        </Formik>
                      )}
                    </CardBody>
                  </Card>
                </Col>
              </Row>
          }
        </Container>
      </div>
    </>
  );
};

export default Profile;
