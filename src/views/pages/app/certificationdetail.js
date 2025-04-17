
import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Form,
  Container,
  Row,
  Col,
  Modal
} from "reactstrap";
import OutlinedInput from '@mui/material/OutlinedInput';
// core components
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import configData from '../../../config';
import { useNavigate } from "react-router-dom"
import { useSelector } from 'react-redux';
// import Loader from 'react-spinner-loader';
import { ThreeDots } from 'react-loader-spinner'
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import useFetchData from '../component/fetchData';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useTheme } from '@mui/material/styles';
import { LOGOUT } from 'store/actions';
import UpgradeModal from '../component/upgradePlan'
import { useDispatch } from 'react-redux';
const Profile = () => {
  const { fetchData } = useFetchData();
  const dispatch = useDispatch();

  const theme = useTheme();
  const [courses, setSelectedCourses] = React.useState([]);
  const [showUpgrade, setshowUpgrade] = useState(false);
  const [showCertificateUpgrade, setShowCetificateUpgrade] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [period, setPeriod] = useState('year');
  const [currency, setCurrency] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [certificate, setcertificate] = useState([]);
  const [keysForKnow, setkeysForKnow] = useState([]);
  const [whattoknow, setwhattoknow] = useState([]);
  const [loading, setloading] = useState(true);
  const [messageForModel, setMessageforModel] = useState('');
  const [dataForModel, setDataForModel] = useState([])
  const [dataForOffers, setDataForOffers] = useState(null);
  const [refrenceLink, setrefrenceLink] = useState('');
  const account = useSelector((state) => state.account);
  const [dropdownVal, setDropdownVal] = useState()
  const [noofQuestion, setnoofQuestion] = useState('10');
  const categories = useSelector((state) => state.domainCeretifctaes);
  const [optionForMulti, setOptionForMulti] = useState([])
  const [selectedDuration, setSelectedDuration] = useState({});

  // const [noofquestion, setnoofquestion] = useState('');
  const [duration, setduration] = useState('10');
  const isAdmin = useSelector((state) => state.account.isAdmin);
  const subscriptions = useSelector((state) => state.account.isSubscribed);
  console.log("subscriprtion is", subscriptions)
  const checkUserAccess = () => {
    if (subscriptions.includes("0")) {
      return true;
    }

  };

  const allhasAccess = checkUserAccess();

  console.log("access is", allhasAccess)
  console.log("access is for id", subscriptions.includes(location.state.id?.toString()))
  const handleFilterChange = (value) => {
    setPeriod(value)
  }
  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const handleNoofChange = (code) => {
    console.log("duration is", code)
    setnoofQuestion(code)
    setduration(code)
  }
  const url = configData.API_SERVER + 'getSubDomainDetails';
  var data, method = 'post';

  if (location.state.type === "Practice") {
    console.log("passed is from the detail poage is", location.state)
    data = { "subDomainId": location.state.id }
  } else {
    data = { "subDomainId": location.state.id, type: location.state.type }

  }

  useEffect(() => {
    console.log("location is", location.state)

    fetchData(method, url, data, account.token,
      (response) => {
        setloading(false)
        setcertificate(response);

        if (location.state.type === "Mock") {
          setduration(response.duration)
          setnoofQuestion(response.noOfQuestions)
        }
        setwhattoknow(response.whatNeedToKnow != null ? JSON.parse(response.whatNeedToKnow) : null);
        setkeysForKnow(Object.keys(whattoknow))
        setrefrenceLink(response.reference_link)
        // setduration()
        console.log("object keys aare", Object.keys(whattoknow))
      },
      (error) => {
        if (error.response && error.response.status === 500) {
          dispatch({
            type: LOGOUT
          });
        }
        console.error("Error occurred:", error);
      }
    );
    // handleDynamicContent()
  }, [])


  let handleDynamicContent = (whatContent) => {
    if (whattoknow != null) {
      return (
        <ul className="dot-line-ul text-white">
          {Object.keys(whattoknow).map(item => (
            // Object.keys(item).map(item1 => (
            <li key={item} className="dot-line-li">{whattoknow[item]}</li>
            // ))
          ))}
        </ul>
      );
    } else {
      return <h3>No Data provided</h3>;
    }
  };
  let handleReferenceLink = (refrenceLink) => {
    if (refrenceLink != null) {
      return (
        <a href={refrenceLink} target="_blank" className="text-white" style={{ textDecoration: 'underline' }} >{refrenceLink}</a>
      );
    } else {
      return <h3>No Data provided</h3>;
    }
  };
  const getOffers = async (header) => {
    setloading(true)
    const offerresponse = await axios.get(configData.API_SERVER + 'offer', header);
    const dataResponse = offerresponse.data;
    setMessageforModel(dataResponse.message)
    setCurrency(dataResponse.currency)
    const filteredPlans = dataResponse.plans.filter(plan => plan.status === 'Y');
    console.log("Filtered plans:", filteredPlans);
    setDataForModel(filteredPlans);
    setDataForOffers(dataResponse)
    console.log(location.state.id, 'wewew')

    const uniqueCourseName = [...new Set(categories.certificates.response.map(item => item.courseName))];
    console.log("uniqiue certificates are", uniqueCourseName)
    const selectedCertificate = [...new Set(categories.certificates.response)].filter(item => item.courseId === location.state.id);
    //const itemSelected = { label: selectedCertificate[0].courseName, value: selectedCertificate[0].courseName }
    setDropdownVal(uniqueCourseName)
    const newArr = [].concat(selectedCertificate[0].courseName)
    setSelectedCourses(newArr)

    console.log("selected  certificates are", newArr)

    setloading(false)
  }
  //   const [selectedDuration, setSelectedDuration] = useState(

  // );

  const getQuiz = () => {
    let header = {
      headers: { 'Authorization': "Bearer " + account.token }
    };
    axios
      .post(configData.API_SERVER + 'enrollUser', {
        "course_id": location.state.id,
        "no_of_question": noofQuestion,
        "enroll_type": location.state.type,
        "componentType": "text-box"
      }, header)
      .then(function (response) {
         const planId = location.state.id?.toString();

        const hasGlobalAccess = Array.isArray(subscriptions) && subscriptions.map(String).includes('0');
        
        const hasSpecificAccess =
          Array.isArray(subscriptions) &&
          subscriptions
            .filter((id) => id !== null && id !== '0')
            .map(String)
            .includes(planId);
        
        if (location.state.type === "Mock" && allhasAccess && !isAdmin) {
          getOffers(header);
          setshowUpgrade(true);
        } else if (
          location.state.type === "Mock" &&
          (hasGlobalAccess || hasSpecificAccess || isAdmin)
        ) {
          navigate(`/admin/quiz`, {
            state: {
              id: location.state.id,
              enroll: response.data.enrollment_id,
              courseLevel: certificate.difficulty,
              domainetail: response.data,
              randomquestion: response.data.questions_random,
              currentQuestion: response.data.questions_random[0].id,
              questionid: response.data.questions_random[0].question_id,
              currentObj: response.data.questions_random[0],
              no_OfQuestion: noofQuestion,
              quizName: certificate.courseName,
              quizDuration: duration,
              enroll_type: location.state.type,
            },
          });
        } else if (location.state.type === "Mock") {
          getOffers(header);
          setshowUpgrade(true);
        }        
        else {
          navigate(`/admin/quiz`, { state: { id: location.state.id, enroll: response.data.enrollment_id, courseLevel: certificate.difficulty, domainetail: response.data, randomquestion: response.data.questions_random, currentQuestion: response.data.questions_random[0].id, questionid: response.data.questions_random[0].question_id, currentObj: response.data.questions_random[0], no_OfQuestion: noofQuestion, quizName: certificate.courseName, quizDuration: duration, enroll_type: location.state.type } });
        }
      })
  }
  const toggleModal = () => {
    setshowUpgrade(false)
  }
  const toggleModalCertifcate = () => {
    setShowCetificateUpgrade(false)
  }
  const handleSelect = (e) => {
    setDropdownVal({ label: e.value, value: e.value })
  }
  const handleDurationChange = (planName, duration) => {
    console.log("duration is", duration)
    setSelectedDuration((prev) => ({ ...prev, [planName]: duration }));
  };

  const handlePaymentClick = (valueOfFilter) => {
    console.log("Selected Plan:", valueOfFilter);
    console.log("Selected Duration:", selectedDuration[valueOfFilter] || "N/A");

    const dataToDisplayForPayment = dataForModel.filter(
      item => item.planName === valueOfFilter && (item.status === "Y" || item.status === "N")
    );

    if (dataToDisplayForPayment.length === 0) {
      console.error("No matching plan found!");
      return;
    }

    const selectedPlan = dataToDisplayForPayment[0];
    const planType = selectedPlan.planType;

    console.log("Currency and plan details:", dataToDisplayForPayment);
    let extractedCurrency = "";
    let extractedCost = 0;

    // Extract currency and cost from plan (fallback)
    if (selectedPlan) {
      const planDurations = selectedPlan.planDurationInDays;
      const firstKey = Object.keys(planDurations)[0]; // Get the first key dynamically
      const planValue = planDurations[firstKey]; // Fetch the corresponding value

      if (planValue) {
        const planParts = planValue.match(/([A-Z]{3}|[$€£])\s*(\d+)/);
        if (planParts) {
          extractedCurrency = planParts[1]; // Extract currency (USD, INR, etc.)
          extractedCost = Number(planParts[2]); // Convert price to number
        }
      }
    }

    // Set default duration to "30" if not selected
    const selectedPlanDuration = selectedDuration[valueOfFilter];


    // Fetch cost based on selected duration
    let costForPlans = selectedPlan.planDurationInDays
      ? selectedPlan.planDurationInDays[selectedPlanDuration] || "USD 0"
      : period === "month"
        ? selectedPlan.planCostMonthly
        : selectedPlan.planCostYearly;

    // Extract numerical cost from costForPlans
    let costCalculated = Number(costForPlans.replace(/[^\d]/g, "")); // Remove non-numeric characters

    // Get selected certificates
    const selectedCertificates = valueOfFilter === "Certificate Plan" ? courses : [courses[0]];
    console.log("Selected Certificates:", selectedCertificates);
    const numCertificates = selectedCertificates.length;

    // Multiply cost based on the number of certificates
    costCalculated *= numCertificates;
    const setCostCalculated = `${extractedCurrency} ${costCalculated}`;

    // Calculate discount if applicable
    const discountFetched = selectedPlan.discount ? selectedPlan.discount.split('%')[0] : "0";
    const calculatedDiscount = (Number(discountFetched) / 100) * costCalculated;
    const setCalculatedDiscount = `${extractedCurrency}${calculatedDiscount}`;

    // Final payable amount after discount
    const payableAmountCalculated = costCalculated - calculatedDiscount;
    const payableAmountToSet = `${extractedCurrency}${payableAmountCalculated}`;

    // Fetch certificate IDs based on selection
    const filteredId = categories.certificates.response
      .filter(item => selectedCertificates.includes(item.courseName))
      .map(item => item.courseId);

    console.log("Filtered Certificate IDs:", filteredId);

    if (valueOfFilter === "Certificate Plan") {
      navigate("/admin/payment", {
        state: {
          frequency: selectedPlan.planName === "Certificate Plan" ? Object.keys(selectedPlan.planDurationInDays)[0] : "none",
          planName: planType,
          subscriptionAmount: setCostCalculated,
          discountForCourse: setCalculatedDiscount,
          amountToPay: payableAmountToSet,
          // planName: selectedPlan.planName,
          certificateSelected: selectedCertificates, // Multiple selected courses
          certificateId: filteredId,
          categoriesResponse: categories.certificates.response,
          cost: payableAmountCalculated,
          currency: extractedCurrency, // Use extracted currency
          coursesSelected: selectedCertificates, // Send multiple certificates
          selectedDuration: selectedPlanDuration, // Include selected duration
        }
      });
    }
  };


  useEffect(() => {
    if (dataForModel.length > 0) {
      const defaultDurations = {};
      dataForModel.forEach((item) => {
        if (item.planDurationInDays) {
          defaultDurations[item.planName] = Object.keys(item.planDurationInDays)[0]; // First available option
        }
      });
      setSelectedDuration(defaultDurations);
    }
  }, [dataForModel, showUpgrade]);

  const handleShowCardPopup = (valueOfFilter) => {
    const dataToDisplayForPayment = dataForModel.filter(
      item => item.planName === valueOfFilter && (item.status === "Y" || item.status === "N")
    );

    if (dataToDisplayForPayment.length === 0) {
      console.error("No matching plan found!");
      return;
    }
    const selectedPlan = dataToDisplayForPayment[0];
    console.log("slected plan to pass iss", selectedPlan)
    const planType = selectedPlan.planType;
    console.log("Cost plan type is", planType);

    let extractedCurrency = "";
    let extractedCost = "";

    if (selectedPlan) {
      const planDurations = selectedPlan.planDurationInDays;
      const firstKey = Object.keys(planDurations)[0]; // Get the first key dynamically
      const planValue = planDurations[firstKey]; // Fetch the corresponding value

      if (planValue) {
        const planParts = planValue.match(/([A-Z]{3}|[$€£])\s*(\d+)/);
        if (planParts) {
          extractedCurrency = planParts[1]; // Extract currency (USD, INR, etc.)
          extractedCost = Number(planParts[2]); // Convert price to number
        }
      }
    }

    // if (!extractedCurrency) {
    //   extractedCurrency = "$";
    // }
    const costForPlans = period === "month" ? selectedPlan.planCostMonthly : selectedPlan.planCostYearly;

    const costCalculated = costForPlans
      ? Number(costForPlans.split(extractedCurrency)[1]) * courses.length
      : extractedCost * courses.length;

    const setCostCalclated = `${extractedCurrency}${costCalculated}`;

    const discountFetched = selectedPlan.discount.split('%')[0];
    const calculatedDiscount = ((Number(discountFetched) * courses.length) / 100) * Number(costCalculated);
    const setCalculatedDiscount = `${extractedCurrency}${calculatedDiscount}`;

    const payableAmountCalculated = costCalculated - calculatedDiscount;
    const payableAmountToSet = `${extractedCurrency}${payableAmountCalculated}`;


    if (selectedPlan.planName === "Certificate Plan") {
      const uniqueCourseName = [...new Set(categories.certificates.response.map(item => item.courseName))];

      const dataForMulti = uniqueCourseName.map(item => ({
        label: item,
        value: item
      }));
      const defaultDurations = {};
      dataForModel.forEach((item) => {
        if (item.planDurationInDays) {
          defaultDurations[item.planName] = Object.keys(item.planDurationInDays)[0]; // First available option
        }
      });
      // setSelectedDuration(defaultDurations);
      setOptionForMulti(dataForMulti);
      setshowUpgrade(false);
      // setShowCetificateUpgrade(true);
      handlePaymentClick('Certificate Plan')
    }
  }
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedCourses(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  }
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const options = [
    { label: 'Thing 1', value: 1 },
    { label: 'Thing 2', value: 2 },
  ];
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 230,
        whitespace: 'nowrap'
      },
    },
  };
  const getStyles = (name, courses, theme) => {
    return {
      fontWeight:
        courses.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
      whiteSpace: 'pre-wrap'
    };
  }
  const handleBackClick = () => {
    setShowCetificateUpgrade(false)
    setshowUpgrade(true)
  }
  return (
    <>
      {loading && certificate && whattoknow && keysForKnow ?
        <div className="header pb-8 pt-5 pt-lg-6 d-flex align-items-center">
          <Container className="mt--10" fluid>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '70vh' }}>
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
        <div
          className="header pb-8 pt-5 pt-lg-8 d-flex align-items-center"
        >
          <Container className="mt--10" fluid >
            <UpgradeModal
              showUpgrade={showUpgrade}
              toggleModal={toggleModal}
              dataForModel={dataForModel}
              period={period}
              handleFilterChange={handleFilterChange}
              handleShowCardPopup={handleShowCardPopup}
              selectedDuration={selectedDuration}
              handleDurationChange={handleDurationChange}
              plansLabel={{
                "Premium Member": 'Everything is free and :',
                "Certificate Member": " Everything is free and :",
                "Free Plan": "For people just getting started with Certify360"
              }}
              plansButtonLabel={{
                "Premium Member": 'Upgrade Subscription',
                "Certificate Member": " Upgrade Subscription",
                "Free Plan": "Your current plan"
              }}
            />
            {showCertificateUpgrade ? <Modal
              className="modal-dialog-centered divClassNameForModelPlans"
              contentClassName="bg-gradient-white"
              isOpen={showCertificateUpgrade}
              toggle={() => toggleModalCertifcate()}
            >
              <div className="modal-header">
                <h4 className="heading mt-4"><b>Want to add more certificates?</b></h4>
                <button
                  aria-label="Close"
                  className="close"
                  data-dismiss="modal"
                  type="button"
                  onClick={() => toggleModalCertifcate()}
                >
                  <span aria-hidden={true}>×</span>
                </button>
              </div>
              <div className="modal-body modelBodyOPlans">
                <Row className="justify-content-center" xl="8">
                  <FormControl sx={{ m: 1, width: '300px', height: 'auto' }}>
                    <InputLabel id="demo-multiple-name-label">Certificate</InputLabel>
                    <Select
                      labelId="demo-multiple-name-label"
                      id="demo-multiple-name"
                      multiple
                      value={courses}
                      onChange={handleChange}
                      input={<OutlinedInput label="Name" />}
                      MenuProps={MenuProps}
                    >
                      {dropdownVal.map((name) => (
                        <MenuItem
                          key={name}
                          value={name}
                          style={getStyles(name, courses, theme)}
                        >
                          {name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Row>
                <Row className="justify-content-center" xl="4">

                </Row>

              </div>
              <div className="modal-footer">
                <Button
                  className=" text-white bg-gradient-default mb-4"
                  type="button"
                  onClick={handleBackClick}
                >
                  Back
                </Button>
                <Button
                  className=" text-white bg-gradient-default mb-4"
                  type="button"
                  onClick={() => handlePaymentClick('Certificate Plan')}
                >
                  Continue to Payment
                </Button>

              </div>
            </Modal> : null}
            <Row>

              <Col className="mb-5 mb-xl-0" xl="8" style={{ borderRadius: '10%' }}>
                <Card className="bg-secondary shadow " >
                  <CardHeader className="bg-gradient-default border-0">
                    <Row className="align-items-center">
                      <Col xs="10">
                        <h3 className="mb-0 text-white " style={{ fontWeight: 'bolder' }}>{certificate.courseName}</h3>
                      </Col>


                    </Row>
                    <br></br>
                    <Row className="align-items-center">
                      <Col xs="12">
                        <h3 className="mb-0 text-white " >Reference Link: {handleReferenceLink(certificate.reference_link)} </h3>
                      </Col>
                    </Row>
                  </CardHeader>
                  <CardBody className="bg-gradient-default">

                    <Form>

                      <h3 className="heading-small text-white mb-4">

                        What you'll need to know?
                      </h3>

                      <div className="pl-lg-4">

                        <ul className="dot-line-ul text-white">
                          {handleDynamicContent(certificate.whatNeedToKnow)}
                          {/* return <li className="dot-line-li">{whattoknow[item]}</li> */}
                        </ul>

                      </div>

                      <hr className="my-4 bg-white" />

                    </Form>
                  </CardBody>
                </Card>
              </Col>
              <Col className="mb-5 mb-xl-0" xl="4">
                <Card className="card-profile shadow" >
                  <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                    <div className="d-flex justify-content-between">
                      <h3 className="mb-0 text-gradient-default " style={{ fontWeight: 'bolder' }}>At a Glance</h3>
                    </div>
                  </CardHeader>
                  <CardBody className="pt-0 ">
                    <Row>
                      <div className="card-profile-stats d-flex  border-0  pt-md-2 pb-0">
                        <div className="icon icon-shape bg-gradient-default text-white rounded-circle shadow">
                          <i class="fa-solid fa-clock "></i>
                        </div>
                      </div>
                      <div className="col" xl="2">
                        <div className="card-profile-stats d-flex  ">
                          {/* <h3 className="text-gradient-default " style={{ fontWeight: 'bolder' }}>Duration: {`${noofQuestion} Min`}</h3> */}

                          <h3 className="text-gradient-default " style={{ fontWeight: 'bolder' }}>Duration: {location.state.type === "Mock" ? `${duration} Min` : `${noofQuestion} Min`}</h3>
                        </div>
                      </div>
                    </Row>
                    {/* <Row>
                      <div className="card-profile-stats d-flex  border-0  pt-md-2 pb-0">
                        <div className="icon icon-shape bg-gradient-default text-white rounded-circle shadow">
                          <i class="fa-solid fa-certificate "></i>
                        </div>
                      </div>
                      <div className="col" xl="2">
                        <div className="card-profile-stats d-flex  ">
                          <h3 className="text-gradient-default " style={{ fontWeight: 'bolder' }}>Level: {certificate.difficulty}</h3>
                        </div>
                      </div>
                    </Row> */}
                    <Row>
                      <div className="card-profile-stats d-flex  border-0  pt-md-2 pb-0">
                        <div className="icon icon-shape bg-gradient-default text-white rounded-circle shadow">
                          <i class="fa-solid fa-question"></i>
                        </div>
                      </div>
                      <div className="col" xl="2">
                        <div className="card-profile-stats d-flex  ">
                          <h3 className="text-gradient-default " style={{ fontWeight: 'bolder' }}>No of Question's:&nbsp;
                            {location.state.type === "Practice" ? <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                              <DropdownToggle caret>
                                {noofQuestion}
                              </DropdownToggle>
                              <DropdownMenu>
                                <DropdownItem onClick={() => handleNoofChange('10')}>10</DropdownItem>
                                <DropdownItem onClick={() => handleNoofChange('20')}>20</DropdownItem>
                                <DropdownItem onClick={() => handleNoofChange('30')}>30</DropdownItem>
                                {/* Add more options as needed */}
                              </DropdownMenu>
                            </Dropdown> : `${noofQuestion} `}
                          </h3>
                        </div>
                      </div>
                    </Row>


                    <Row className="justify-content-center">
                      <Col xs="1"></Col>
                      <Col xs="4">
                        <div className="card-profile-image">
                          <Button
                            // color="primary"
                            // to="/admin/quiz"
                            // onClick={(e) => e.preventDefault()}
                            className="text-white bg-gradient-default"
                            size="lg"
                            // tag={Link}
                            onClick={() => getQuiz(certificate.courseId)}

                          >
                            Start Quiz
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>


        </div>
      }
    </>

  );
};

export default Profile;