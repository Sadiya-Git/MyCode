import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Form,
  Container,
  Row,
  Col,
  Button,
  Modal
} from "reactstrap";
import configData from '../../../config';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ThreeDots } from 'react-loader-spinner';
import '@fortawesome/fontawesome-free/css/all.min.css';
import useFetchData from '../component/fetchData';
import FeedbackItem from './feedbackinner';
import { useNavigate } from "react-router-dom"
import axios from 'axios';
import UpgradeModal from '../component/upgradePlan'
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useTheme } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';


const Feedback = () => {
  const navigate = useNavigate();
  const dispatcher = useDispatch();
  const { fetchData } = useFetchData();
  const [feedback, setFeedback] = useState([]);
  const [feedbackYoutube, setFeedbackYoutube] = useState([]);
  const [totalScore, setTotalScore] = useState('');
  const [userScore, setUserScore] = useState('');
  const account = useSelector((state) => state.account);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const url1 = configData.API_SERVER + 'UserAnswersWithFeedback';
  const url2 = configData.API_SERVER + 'calculateScore';
  const data = { "enrollment_id": location.state.enroll };
  const method = 'post';
  const [period, setPeriod] = useState('year');
  const [courseName, setCourseName] = useState('');
  const [courseQue, setCourseQue] = useState('');
  const [mockData, setMockData] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [dataForModel, setDataForModel] = useState([])
  const [messageForModel, setMessageforModel] = useState('');
  const [dataForOffers, setDataForOffers] = useState(null);
  const [dropdownVal, setDropdownVal] = useState()
  const categories = useSelector((state) => state.domainCeretifctaes);
  const [courses, setSelectedCourses] = React.useState([]);
  const [showUpgrade, setshowUpgrade] = useState(false);
  const [showCertificateUpgrade, setShowCetificateUpgrade] = useState(false);
  const [optionForMulti, setOptionForMulti] = useState([])
    const [selectedDuration, setSelectedDuration] = useState({});
  
  const theme = useTheme();
  const handleBackClick = () => {
    setShowCetificateUpgrade(false)
    setshowUpgrade(true)
  }
  const handleFilterChange = (value) => {
    setPeriod(value)
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
 const subscriptions =useSelector((state) => state.account.isSubscribed);
   const checkUserAccess = () => {
     if (subscriptions.includes("0")) {
       return true;
     }
     if(subscriptions.include(location.state.courseId)){
      return true;
     }
     else return false;
 
   };
 
   const allhasAccess = checkUserAccess();
   useEffect(()=>{
    setIsSubscribed(allhasAccess)
   },[])
 
  const getOffers = async (header) => {
    const offerresponse = await axios.get(configData.API_SERVER + 'offer', header);
    const dataResponse = offerresponse.data;
    setMessageforModel(dataResponse.message)

    const filteredPlans = dataResponse.plans.filter(plan => plan.status === 'Y');
    console.log("Filtered plans:", filteredPlans);
    setDataForModel(filteredPlans);
    setDataForOffers(dataResponse)
    console.log(location.state.courseId, 'wewew')
    const uniqueCourseName = [...new Set(categories.certificates.response.map(item => item.courseName))];
    console.log("uniqiue certificates are", uniqueCourseName)
    const selectedCertificate = [...new Set(categories.certificates.response)].filter(item => item.courseId === location.state.courseId);
    //const itemSelected = { label: selectedCertificate[0].courseName, value: selectedCertificate[0].courseName }
    setDropdownVal(uniqueCourseName)
    const newArr = [].concat(selectedCertificate[0].courseName)
    setSelectedCourses(newArr)

    console.log("selected  certificates are", newArr)

    // setloading(false)
  }
  const getStyles = (name, courses, theme) => {
    return {
      fontWeight:
        courses.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
      whiteSpace: 'pre-wrap'
    };
  }
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
    if (selectedPlan.plan) {
      const planParts = selectedPlan.plan.match(/([$€£])(\d+)/);
      if (planParts) {
        extractedCurrency = planParts[1]; // Currency symbol ($, €, £)
        extractedCost = Number(planParts[2]); // Cost as a number
      }
    }

    if (!extractedCurrency) {
      extractedCurrency = "$"; // Default currency
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
    const setCostCalculated = `${extractedCurrency}${costCalculated}`;

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
          frequency: selectedPlan.planName === "Certificate Plan" ? "none" : period,
          planName: planType,
          subscriptionAmount: setCostCalculated,
          discountForCourse: setCalculatedDiscount,
          amountToPay: payableAmountToSet,
          planName: selectedPlan.planName,
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
    const planType = selectedPlan.planType;
    console.log("Cost plan type is", planType);

    let extractedCurrency = "";
    let extractedCost = "";

    if (selectedPlan.plan) {
      const planParts = selectedPlan.plan.match(/([$€£])(\d+)/);
      if (planParts) {
        extractedCurrency = planParts[1];
        extractedCost = Number(planParts[2]);
      }
    }
    if (!extractedCurrency) {
      extractedCurrency = "$";
    }

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
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 230,
        whitespace: 'nowrap'
      },
    },
  };
  
  const handleSubscribe = async (event) => {
    if (event) event.preventDefault(); // Prevent any default behavior
    
    console.log("handleSubscribe called!");
    
    try {
      let header = {
        headers: { 'Authorization': "Bearer " + account.token }
      };
      
      await getOffers(header);
  
      setshowUpgrade(true);
      
    } catch (error) {
      console.error("Error fetching offers:", error);
    }
  };
  useEffect(() => {
    const subscriptions = JSON.parse(localStorage.getItem("subscriptions")) || [];
    const checkUserAccess = () => {
  
      if (subscriptions.includes("0")) {
          return true;
      }
  };


    if (showUpgrade) {
      console.log("Modal should be displayed");
    }
  }, [showUpgrade]);
    
  const handleDurationChange = (planName, duration) => {
    console.log("duration is",duration)
    setSelectedDuration((prev) => ({ ...prev, [planName]: duration }));
  };
  const toggleModal = () => {
    setshowUpgrade(false)
  }
  const toggleModalCertifcate = () => {
    setShowCetificateUpgrade(false)
  }
  useEffect(() => {
    fetchData(method, url1, data, account.token,
      (response) => {
        setFeedback(response.user_answers_with_feedback);
        setMockData(response);
        setCourseName(response.course_name);
        setCourseQue(response.total_questions);
        setFeedbackYoutube(JSON.parse(response.youtube_url));
      },
      (error) => {
        console.error("Error occurred:", error);
      }
    );
    TotalScore();
  }, []); // Runs only once when the component mounts

  const TotalScore = () => {
    fetchData(method, url2, { "enrollment_id": location.state.enroll, "skill": location.state.skill }, account.token,
      (response) => {
        setLoading(false);
        setUserScore(response.user_score);
        setTotalScore(response.total_score);
      },
      (error) => {
        console.error("Error occurred:", error);
      }
    );
  };
  const handleReviseOptionClick = () => {
    navigate(`/admin/learning/details`, { state: { id: location.state.courseId, coursename: courseName } });

  }

  const handleDynamicContent = () => {
    if (feedbackYoutube != null) {
      return Object.keys(feedbackYoutube).map(item => (
        <Row key={item}>
          <div className="col">
            <div className="card-profile-stats d-flex">
              <iframe
                width="560"
                height="315"
                src={feedbackYoutube[item]}
                title={`YouTube video player ${item}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </Row>
      ));
    }
    return <h3>No Data provided</h3>;
  };


  return (
    <>
      {loading ? (
        <div className="header pb-8 pt-5 pt-lg-6 d-flex align-items-center">
          <Container className="mt--10" fluid>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '70vh' }}>
              <ThreeDots visible={true} height="80" width="80" color="#172b4d" />
            </div>
          </Container>
        </div>
      ) : (
        <div className="header pb-8 pt-5 pt-md-5">
          <Container className="align-items-center" fluid>
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
                  onClick={() => handlePaymentClick('Certificate Member')}
                >
                  Continue to Payment
                </Button>

              </div>
            </Modal> : null}
            <Row>
              <Col className="order-xl-1" xl="10">
                <h6 className="mb-0 display-3 text-gradient-darker">Results</h6>
              </Col>
              <Col className="order-xl-2 mb-5 mb-xl-0" xl="2" >
                {/* <h6 className="mb-0 display-3 text-gradient-darker">Results</h6> */}
                <Button
                  className="outline text-white bg-gradient-default"
                  onClick={() => handleReviseOptionClick()}
                  size="lg"
                >
                  {"Revise Course"} {"  "} <i class="fa-solid fa-arrow-right"></i>
                </Button>
              </Col>
            </Row>
          </Container><br />

          <Container fluid>
            <Row>
              <Col className="order-xl-1" xl="8">
                <Card className="bg-secondary shadow">
                  <CardHeader className="border-0 headerForResultsSection">
                    <Row className="align-items-center">
                      <Col xs="10">
                        <h3 className="mb-0 text-default" style={{ fontWeight: 'bolder' }}>
                          {courseName}
                        </h3>
                      </Col>

                    </Row>
                    <Row className="">
                      <Col xs="5">
                        <h3 className="mb-0 text-default" style={{ fontWeight: 'bolder' }}>
                          {userScore} out of {totalScore}
                        </h3>
                      </Col>
                    </Row>
                  </CardHeader>
                  <CardBody className="bg-gradient-white">
                    <Form style={{ position: 'relative' }}>
                      {!isSubscribed && (
                        <div
                          style={{
                            position: 'absolute', // Keeps it within the Form
                            top: 0,
                            left: 0,
                            width: '100%', // Only covers the form
                            height: '100%',
                            backgroundColor: 'rgba(255, 255, 255, 0.7)',
                            backdropFilter: 'blur(5px)',
                            display: 'flex',
                            justifyContent: 'start',
                            alignItems: 'center',
                            flexDirection: 'column',
                            zIndex: 10 // Keep it above the form content but below other UI elements
                          }}
                        >
                          <button
                          type="button"
                            style={{
                              backgroundColor: '#007bff',
                              color: 'white',
                              border: 'none',
                              padding: '10px 20px',
                              borderRadius: '5px',
                              cursor: 'pointer',
                              fontSize: '16px',
                              top: 0
                            }}
                            onClick={handleSubscribe}
                          >
                            Subscribe to Access
                          </button>
                        </div>
                      )}

                      {/* Form Content */}
                      <div className="pl-lg-2">
                        <div className="text-default" style={{ fontWeight: 'bolder' }}>
                          {mockData &&
                            mockData.user_answers_with_feedback.map((answer, index) => (
                              <FeedbackItem
                                key={index}
                                questionData={{
                                  question: answer.question,
                                  options: answer.options,
                                  feedback: answer.feedback,
                                  status: answer.status,
                                  selected_options: answer.selected_options,
                                  correct_options: answer.correct_options,
                                  questionNo: index + 1
                                }}
                                isSubscribed={isSubscribed}
                              />
                            ))}
                        </div>
                      </div>
                    </Form>

                  </CardBody>
                </Card>
              </Col>

              <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
                <Card className="card-profile shadow">
                  <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                    <h3 className="mb-0 text-gradient-default" style={{ fontWeight: 'bolder' }}>
                      You can deep dive into these videos related to these modules and enhance your learning experience.
                    </h3>
                  </CardHeader>
                  <CardBody className="text-center">
                    {handleDynamicContent()}
                    <Row className="justify-content-center">
                      <div className="col">
                        <div className="card-profile-image">
                          Reach out to our support team for any queries or concerns at support@academy360.ai
                          <p className="text-success" style={{ fontWeight: 'bolder' }}>Happy Learning!</p>
                        </div>
                      </div>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      )}
    </>
  );
};

export default Feedback;
