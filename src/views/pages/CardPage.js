import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CardDetails from './CardDetails'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import { ThreeDots } from 'react-loader-spinner'
import { useLocation, useNavigate } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { CSSTransition } from 'react-transition-group';
import {
  Container,
  Row,
  Col,
  Button,
  Input,
  Label
} from "reactstrap";
import configData from '../../config';
import Alert from '@mui/material/Alert';
import { useSelector } from 'react-redux';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import useFetchData from '../pages/component/fetchData';
import { createGenerateClassName, StylesProvider } from '@material-ui/core/styles';
export default function CardPage() {
  const [loading, setloading] = useState(true);
  const [showModal, setshowModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { fetchData } = useFetchData();
  const urlPromo = configData.API_SERVER + 'couponCode';
  const account = useSelector((state) => state.account);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [promoCheck, setPromoCheck] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('')
  const [showNotification, setShowNotification] = useState(false)
  const [errorNotification, setErrorNotification] = useState(false)
  const [discountFromPromo, setDiscountFromPromo] = useState(0)
  const [promoInput, setPromoInput] = useState('');
  const methodForPromoApi = 'POST';
  const togglePopup = () => setPopupOpen(!isPopupOpen);
  const generateClassName = createGenerateClassName({
    productionPrefix: 'c',
    disableGlobal: true
  });
  const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);
  const emailForPay = localStorage.getItem('emailForPayment');
  useEffect(() => {
    console.log("data is", location.state)
    setloading(false)
    // fetchData()
  }, []);
  const toggleModal = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // You can use 'auto' instead of 'smooth' for an instant scroll
    });
    setPopupOpen(true);
    setTimeout(() => {
      // Close the wait popup after the process is complete
      togglePopup();
    }, 10000);
  }
  const handleModalClick = () => {
    setshowModal(false)
    navigate(`/admin/user-profile`);
  }
  const imageStyle = {
    width: '3rem',
    height: '3rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 'auto', // Center horizontally
    marginBottom: '10px',
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
              <h2 className="successText">SUCCESS </h2>
              <h5>Thanks for Your Subscription payment</h5>
              <h5></h5>
              <Button
                // color="primary"
                className=" outline text-white bg-green buttonCss"
                disabled={false}
                onClick={() => handleModalClick()}
                size="lg"
              >
                Continue
              </Button>
            </div>

          </ModalBody>
        </Modal>

      </CSSTransition>
    );
  };
  const handlePromoCheck = (e) => {
    if (e.target.checked) {
      setPromoCheck(true)
    } else {
      setPromoCheck(false)
    }
  }
  const handleApplyPromo = () => {
    if (promoInput !== "") {
      const dataForPromoChange = {
        coupon_code: promoInput.toUpperCase()
      }
      setloading(true)
      fetchData(methodForPromoApi, urlPromo, dataForPromoChange, account.token,
        (response) => {
          setloading(false)
          if (response.success) {
            if (response.message.indexOf("Invalid") != -1) {
              setShowNotification(true)
              setErrorNotification(true)
              setNotificationMessage(response.message)
              setDiscountFromPromo(response.discount)
            } else {
              setShowNotification(true)
              setErrorNotification(false)
              setNotificationMessage(response.message)
              setDiscountFromPromo(response.discount)
            }
          } else {
            setShowNotification(true)
            setErrorNotification(true)
            setNotificationMessage(response.message)
            setDiscountFromPromo(response.discount)
          }

        },
        (error) => {
          console.error("Error occurred:", error);
        }

      );
    }
  }
  const handlePromoInputCheck = (e) => {
    setPromoInput(e.target.value)
  }
  const certificationPrice = location.state.subscriptionAmount
  const newpriceAfterDiscount = Number(location.state.subscriptionAmount.split('USD')[1]) - discountFromPromo
  return (
    <>
      {loading ?
        <div
          className="header pb-8 d-flex align-items-center"
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
        <div className="header pb-8 pt-5 pt-md-5">
          {isPopupOpen ?
            <AnimationPopup isOpen={isPopupOpen} toggle={togglePopup} />
            : null}
          <Container className="align-items-center" fluid>
            <Row>
              <Col lg="8" xl="8">
                <h1 className="display-3 text-gradient-darker">Payment Details</h1>
              </Col>

            </Row>
          </Container>
          <StylesProvider generateClassName={generateClassName}>
            <div className="paymentContainer">
              <Card className='cardForPayment'>
                <CardContent>
                  <div className="headingforTextContent">
                    Order Summary

                  </div>
                  <div className="subcriptionContainer">
                    <div className="subcriptionText">
                      Certification
                    </div><br></br>
                    <div className="currencyAmount">
                      {Array.isArray(location.state.certificateSelected) ? (
                        <ol>
                          {location.state.certificateSelected.map((cert, index) => (
                            <li key={index}>{cert}</li>
                          ))}
                        </ol>
                      ) : (
                        <span>{location.state.certificateSelected}</span>
                      )}

                    </div>
                  </div><br></br>
                  <div className="subcriptionContainer">
                    <div className="subcriptionText">
                      Certification Duration
                    </div>
                    <div classsName="currencyAmount">{location.state.selectedDuration}</div>
                  </div>
                  <div className="subcriptionContainer">
                    <div className="subcriptionText">
                      Certification Price
                    </div>
                    <div classsName="currencyAmount">{location.state.subscriptionAmount}</div>
                  </div>
                  <div className="subcriptionContainer">
                    <div className="subcriptionText">
                      Discount
                    </div>
                    <div classsName="currencyAmount">USD {discountFromPromo}</div>
                  </div>
                  <div className="subcriptionContainer">
                    <div className="subcriptionText">
                      Taxes
                    </div>
                    <div classsName="currencyAmount">USD 0</div>
                  </div>
                  <div>
                    <div className="promoContainer">
                      <Input type="checkbox" onChange={(e) => handlePromoCheck(e)} />
                      <Label check={promoCheck}>
                        Do you have any Promo Code?
                      </Label>
                    </div>
                    {promoCheck ? <div>
                      <Input type="text" onChange={(e) => handlePromoInputCheck(e)} name="promoInput" />
                      <div className="promoButtonContainer">
                        <Button
                          variant="contained"
                          color="primary"
                          className=" outline text-white promoButtonCss"
                          disabled={false}
                          onClick={() => handleApplyPromo()}
                        >
                          Apply Promo
                        </Button>
                        {showNotification === true && errorNotification === false ? <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                          {notificationMessage}
                        </Alert> : null}
                        {showNotification === true && errorNotification === true ? <Alert icon={<ClearIcon fontSize="inherit" />} severity="error">
                          {notificationMessage}
                        </Alert> : null}
                      </div>
                    </div> : null}
                  </div>
                  <hr className="horizontalLine" />
                  <div className="subcriptionContainer">
                    <div className="subcriptionText">
                      Subtotal
                    </div>
                    <div classsName="currencyAmount">USD {newpriceAfterDiscount}</div>
                  </div>
                </CardContent>
              </Card>
              <Divider orientation="vertical" flexItem className="separator" />

              {<Elements stripe={stripePromise}>
                <CardDetails
                  showCerificate={location.state.coursesSelected} currency={location.state.currency} costToPass={newpriceAfterDiscount}
                  planCost={newpriceAfterDiscount} certificateSelected={location.state.certificateSelected}
                  certificateDetails={location.state.categoriesResponse} openModelFn={toggleModal}
                  frequencyPlan={location.state.frequency} planForPay={location.state.planName} certificateIdForCertification={location.state.certificateId} />
              </Elements>}
            </div>
          </StylesProvider>
        </div>}
    </>

  );
}
