
import {
    Button,
    Card,
    CardBody,
    FormGroup,
    Form,
    Container,
    Row,
    Col,
    Input
} from "reactstrap";
import "../../../assets/css/dashboard-react.css";
// core components
import React, { useState, useEffect, useCallback } from "react";
import Timer from "./timmer";
import RadioButton from "../component/cusstomeRadio";
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import configData from '../../../config';
import { ThreeDots } from 'react-loader-spinner'
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom"
// import Confetti from 'react-confetti';
import { CSSTransition } from 'react-transition-group';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import ReactLogo from '../../../assets/icons8-sand-timer.gif';
import { Label } from "reactstrap";
import { useDispatch } from 'react-redux';
import { LOGOUT } from 'store/actions';
import toast, { Toaster } from 'react-hot-toast';

const Quiz = () => {
    const dispatch = useDispatch();

    const [currentQuestion, setCurrentQuestion] = useState();
    const [isPopupOpen, setPopupOpen] = useState(false);
    const [isPopupOpenSelective, setPopupOpenSelective] = useState(false);
    const [isPopupOpenSelectiveReview, setIsPopupOpenSelectiveReview] = useState(false);

    const togglePopupSelectiveReview = () => {
        setIsPopupOpenSelectiveReview(!isPopupOpenSelectiveReview);
    }
    const [isTimeUp, setisTimeUp] = useState(false);
    const [isQuizCompleted, setQuizCompleted] = useState(false);
    const [reviewStatus, setReviewStatus] = useState([]);

    const togglePopup = () => setPopupOpen(!isPopupOpen);
    const toggleTimeup = () => setisTimeUp(!isTimeUp);
    const togglePopupSelective = () => setPopupOpenSelective(!isPopupOpenSelective);

    // const [flag, setfalg] = useState(false);
    const location = useLocation();
    const [loading, setloading] = useState(true);
    const [answered, setanswered] = useState(0);
    const [marked, setmarked] = useState(0);
    const [skipped, setskipped] = useState(0);
    const [answer, setanswer] = useState([]);
    const [question, setquestions] = useState('');
    const [questionType, setquestionsType] = useState('');
    const [skillSet, setskillSet] = useState('');
    const [questionid, setquestionid] = useState();
    const [domaindetail, setdomaindetail] = useState([]);
    const [randomQuestion, setrandomQuestion] = useState([]);
    const [isSaveNextButtonEnabled, setSaveNextButtonEnabled] = useState(false);
    const [isAtLeastOneQuestionAnswered, setIsAtLeastOneQuestionAnswered] = useState(false);
    const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
    const account = useSelector((state) => state.account);
    const navigate = useNavigate();

    const [selectedOption, setSelectedOption] = useState('');
    const [selectedAnswer, setselectedAnswer] = useState([]);
    const [multiselectedAnswer, setmultiselectedAnswer] = useState([]);
    let header = {
        headers: { 'Authorization': "Bearer " + account.token },
        mode: 'cors'
    };
    const handleOptionChange = (e) => {
        setSelectedOption(e.target.value);
        setselectedAnswer([Number(e.target.id)]);
        setSaveNextButtonEnabled(true);

    };
    const notify = () => toast.error("Something went wrong...!");

    const handleTimerOver = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth', // You can use 'auto' instead of 'smooth' for an instant scroll
        });
        setisTimeUp(true);
        setTimeout(() => {
            toggleTimeup();
            navigate(`/admin/feedback`, { state: { enroll: location.state.enroll, skill: skillSet,courseId:location.state.id  } });
        }, 10000);
    };
    // const handleCheckboxChange = (id, order) => {
    //     setselectedAnswer((prevSelectedAnswer) => {
    //         const updatedSelectedAnswer = [...prevSelectedAnswer];
    //         const index = updatedSelectedAnswer.indexOf(order);
    //         if (index !== -1) {
    //             updatedSelectedAnswer.splice(index, 1);
    //         } else {
    //             updatedSelectedAnswer.push(order);
    //         }
    //         return updatedSelectedAnswer;
    //     });
    //     setmultiselectedAnswer((prevSelectedAnswer) => {
    //         const updatedSelectedAnswer = [...prevSelectedAnswer];
    //         const index = updatedSelectedAnswer.indexOf(id);
    //         if (index !== -1) {
    //             updatedSelectedAnswer.splice(index, 1);
    //         } else {
    //             updatedSelectedAnswer.push(id);
    //         }
    //         return updatedSelectedAnswer;
    //     });
    //     setSaveNextButtonEnabled(true);
    // };

    const handleCheckboxChange = (id, order) => {
        setselectedAnswer((prevSelected) => 
            prevSelected.includes(order) 
                ? prevSelected.filter((item) => item !== order) 
                : [...prevSelected, order]
        );
    
        setmultiselectedAnswer((prevSelected) => 
            prevSelected.includes(id) 
                ? prevSelected.filter((item) => item !== id) 
                : [...prevSelected, id]
        );
    
        setSaveNextButtonEnabled(true);
    };
    
    
    const updateSkippedCount = (randomQuestion) => {
        const skippedCount = randomQuestion.reduce((count, entry) => count + (entry.skipped ? 1 : 0), 0);
        setskipped(skippedCount);
    };
    const onNextQuestionFunction = (index, id, qid, obj) => {
        setCurrentQuestionNumber(index);
        const currentQuestionIndex = randomQuestion.findIndex(entry => entry.question_id === questionid);

        if (!randomQuestion[currentQuestionIndex].reviewed && !randomQuestion[currentQuestionIndex].saved) {
            setrandomQuestion(prevRandomQuestion => {
                const updatedRandomQuestion = prevRandomQuestion.map((entry, index) =>
                    index === currentQuestionIndex
                        ? { ...entry, saved: false, skipped: true, reviewed: false }
                        : entry
                );
                updateSkippedCount(updatedRandomQuestion);
                return updatedRandomQuestion;
            });
        }
        getNextQuestion(qid);
        setCurrentQuestion(id);
    };
    const getNextQuestion = (qid) => {
        setCurrentQuestionNumber((prevNumber) => prevNumber + 1);

        setquestionid(qid);
        setSaveNextButtonEnabled(false);
        axios.post(configData.API_SERVER + 'getQuiz', {
            "question_id": qid,
            "enrollment_id": location.state.enroll,
            "componentType": "text-box"
        }, header)
            .then(function (response) {
                if (response.data) {
                    if (response.data.answerOptions) {
                        const selectedOptions = response.data.selected_option || [];
                        if (response.data.question_type === 'Multiple Choice') {
                            const selectedOption = response.data.answerOptions.find(option =>
                                selectedOptions.includes(option.option_id)
                            );
                            setSelectedOption(selectedOption ? selectedOption.answerText : null);

                        } if (response.data.question_type === 'Multiple Select') {
                            console.log("in multi choice")
                            setmultiselectedAnswer(selectedOptions);
                        }

                        setanswer(response.data.answerOptions);
                        setquestions(response.data.question_text);
                        setquestionsType(response.data.question_type);
                    }
                }
            })
            .catch(function (error) {
                console.error("Error saving user answer:", error);
                notify();
                if (error.response && error.response.status === 400) {
                    axios.post(configData.API_SERVER + 'users/logout', header)
                }
            }
            );
    }


    const onMarkforReview = () => {
        setReviewStatus((prevStatus) => {
            const updatedStatus = [...prevStatus];
            updatedStatus[currentQuestion] = !updatedStatus[currentQuestion];
            return updatedStatus;
        });

        // Update marked count
        setmarked((prevMarked) => {
            if (reviewStatus[currentQuestion]) {
                // If unchecked, decrement marked count (if greater than 0)
                return prevMarked > 0 ? prevMarked - 1 : prevMarked;
            } else {
                // If checked, increment marked count
                return prevMarked + 1;
            }
        });

        randomQuestion.forEach((entry) => {
            if (entry.id === currentQuestion + 1 && !reviewStatus[currentQuestion]) {
                setCurrentQuestion(entry.id);
                setquestionid(entry.question_id);
                getNextQuestion(entry.question_id);
            }
        });

        const KeyvalueUpdated = randomQuestion.map((entry) =>
            entry.question_id === questionid
                ? { ...entry, reviewed: reviewStatus[currentQuestion], saved: false, skipped: false }
                : entry
        );
        setrandomQuestion(KeyvalueUpdated);
    };


    const sendFeedbackandSubmit = async () => {
        await handleAnswerOptionClick(); 
        sendFeedback(); 
    };
    
    const handleAnswerOptionClick = async () => {   
        if(selectedAnswer.length!==0){
            try {
                const KeyvalueUpdated = randomQuestion.map((entry) =>
                    entry.question_id === questionid
                        ? { ...entry, saved: true, skipped: false, reviewed: false }
                        : entry
                );
                // const allQuestionsAnswered = randomQuestion.every(entry => entry.saved);
                // setQuizCompleted(allQuestionsAnswered);
    
                if (answered < domaindetail.total_question) {
                    setanswered(answered + 1);
                }
                if (currentQuestion === location.state.no_OfQuestion - 1) {
                    setQuizCompleted(true);
                }
                // sendFeedback();
    
                const updatedSkippedCount = randomQuestion.reduce((count, entry) => count + (entry.skipped ? 1 : 0), 0);
                setskipped(updatedSkippedCount);
    
                randomQuestion.forEach((entry) => {
                    if (entry.id === currentQuestion + 1) {
                        setCurrentQuestion(entry.id);
                        setquestionid(entry.question_id);
                        getNextQuestion(entry.question_id);
                    }
                });
    
                setrandomQuestion(KeyvalueUpdated);
                // Save user answer
                const response = await axios.post(configData.API_SERVER + 'saveUserAnswers', {
                    "question_id": questionid,
                    "option_ids": selectedAnswer,
                    "enrollment_id": location.state.enroll,
                    "componentType": "text-box"
                }, header);
    
                if (response) {
                    console.log("User answer saved successfully", response);
                    setIsAtLeastOneQuestionAnswered(true)
                    setselectedAnswer([]);
                    setmultiselectedAnswer([]);
                }
                if (response.status === 400) {
                    notify();
                    dispatch({
                        type: LOGOUT
                    });
    
                    await axios.post(configData.API_SERVER + 'users/logout', {}, header);
                }
            } catch (error) {
                console.error("Error saving user answer:", error);
                notify();
                if (error.response && error.response.status === 400) {
                    dispatch({
                        type: LOGOUT
                    });
                    await axios.post(configData.API_SERVER + 'users/logout', {}, header);
                }
            }
        }
       

    };

    useEffect(() => {
        if (location.state.enroll_type === 'Mock' || location.state.enroll_type === 'Practice') {
            console.log("quiz name is", location.state.quizName)
            setskillSet(location.state.quizName)
        } else {
            console.log("skill set comming from study", location.state.skill)
            setskillSet(location.state.skill);
        }
        console.log("skill passed is", location.state.skill)
        fetchData()
        window.addEventListener("keydown", function (e) {
            if ((e.key === "F5") || (e.ctrlKey && e.key === "r")) {
                e.preventDefault();
            }
        });
        window.addEventListener("beforeunload", function (e) {
            const confirmationMessage = "Are you sure you want to leave this page? Changes you made may not be saved.";
            e.returnValue = confirmationMessage;
            return confirmationMessage;
        });
    }, [])

    const imageStyle = {
        width: '3rem',
        height: '3rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 'auto', // Center horizontally
        marginBottom: '10px',
    };
    const fetchData = useCallback(async () => {
        setdomaindetail(location.state.domainetail);
        setrandomQuestion(location.state.randomquestion);
        setCurrentQuestion(location.state.currentQuestion)
        setquestionid(location.state.questionid)
        const initialReviewStatus = location.state.randomquestion.map(() => false);
        setReviewStatus(initialReviewStatus);
        try {
            let response = await axios
                .post(configData.API_SERVER + 'getQuiz', {
                    "question_id": location.state.questionid,
                    "enrollment_id": location.state.enroll
                }, header);
            // if (response.data) {
            //     setloading(false)
            //     setanswer(response.data.answerOptions);
            //     setquestions(response.data.question_text);
            // }
            if (response.data) {
                if (response.data.answerOptions) {
                    const selectedOptions = response.data.selected_option || [];
                    if (response.data.question_type === 'Multiple Choice') {
                        const selectedOption = response.data.answerOptions.find(option =>
                            selectedOptions.includes(option.option_id)
                        );
                        setSelectedOption(selectedOption ? selectedOption.answerText : null);

                    } if (response.data.question_type === 'Multiple Select') {
                        console.log("in multi choice")
                        setmultiselectedAnswer(selectedOptions);
                    }

                    setanswer(response.data.answerOptions);
                    setquestions(response.data.question_text);
                    setquestionsType(response.data.question_type);
                    setloading(false)
                }
            }
        }
        catch (error) {
            console.error("Error saving user answer:", error);
            notify();
            if (error.response && error.response.status === 400) {
                dispatch({
                    type: LOGOUT
                });
            }
        }
    })
    // const sendFeedback = () => {
    //     if (marked === 0) {
    //         setPopupOpenSelective(true)
    //     } if (marked > 0) {
    //         setIsPopupOpenSelectiveReview(true)
    //     }
    // }
    const sendFeedback = () => {
        if (marked === 0) {
            setPopupOpenSelective(true);
        } else if (marked > 0 && !isPopupOpenSelectiveReview) { 
            setIsPopupOpenSelectiveReview(true);
        }
    };
    
    const AnimationPopup = ({ isOpen, toggle }) => {
        return (
            <CSSTransition
                in={isOpen}
                timeout={300} // Set the duration of the animation
                classNames="nice-animation"
                unmountOnExit
            >
                <Modal isOpen={isOpen} toggle={toggle} centered>
                    {/* <ModalHeader toggle={toggle}>Quiz Completed</ModalHeader> */}
                    <ModalBody>

                        <h2 className="text-center">Fantastic job! Quiz complete! </h2>

                        <br></br>
                        <h3 className="text-center">Your responses are safely in. Let's continue our journey on the feedback page.</h3>
                        <br></br>
                        <img src={ReactLogo} alt="wait svg" style={imageStyle} />

                        <br></br>
                        <h4 className="text-center">
                            Thanks a bunch for being a part of this!                        </h4>
                        {/* <h3>Thanks for Your dedication and effort we're now redirecting you to your quiz response feedback.</h3> */}


                    </ModalBody>
                </Modal>

            </CSSTransition>
        );
    };
    const AnimationPopupSelective = ({ isOpen, toggle }) => {
        const handleFinishCourse = () => {
            setPopupOpenSelective(false)
            window.scrollTo({
                top: 0,
                behavior: 'smooth', // You can use 'auto' instead of 'smooth' for an instant scroll
            });
            setPopupOpen(true);
            setTimeout(() => {
                // Close the wait popup after the process is complete
                togglePopup();
                navigate(`/admin/feedback`, { state: { enroll: location.state.enroll, skill: skillSet,courseId:location.state.id } });
            }, 10000);
        };

        return (
            <CSSTransition
                in={isOpen}
                timeout={300} // Set the duration of the animation
                classNames="nice-animation"
                unmountOnExit
            >
                <Modal isOpen={isOpen} toggle={toggle} centered>
                    {/* <ModalHeader toggle={toggle}>Confirmation</ModalHeader> */}
                    <ModalBody className="text-center">
                        <h3>Are you sure you want to finish the course?</h3>

                        <Button onClick={handleFinishCourse} className="mr-4 text-white bg-gradient-default"
                            style={{ Color: '#525f7f', margin: '10px' }}>
                            Yes
                        </Button>{' '}
                        <Button color="secondary" onClick={toggle} style={{ margin: '10px' }}>
                            No
                        </Button>
                    </ModalBody>
                </Modal>
            </CSSTransition>
        );
    };
    const AnimationPopupSelectiveReview = React.memo(({ isOpen, toggle }) => {
        const handleFinishCourse = () => {
            setIsPopupOpenSelectiveReview(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setPopupOpen(true);
    
            setTimeout(() => {
                togglePopup();
                navigate(`/admin/feedback`, { state: { enroll: location.state.enroll ,courseId:location.state.id } });
            }, 10000);
        };
    
        return (
            <CSSTransition
                in={isOpen}
                timeout={300}
                classNames="nice-animation"
                unmountOnExit
            >
                <Modal isOpen={isOpen} toggle={toggle} centered>
                    <ModalBody className="text-center">
                        <h2 className="text-center">Are you sure you want to finish the course?</h2>
                        <h3 className="text-center">Some questions are marked as review. Make sure you've reviewed them before finishing.</h3>
    
                        <Button
                            className="mr-4 text-white bg-gradient-default"
                            onClick={handleFinishCourse}
                            style={{ backgroundColor: '#525f7f', margin: '10px' }}
                        >
                            Yes
                        </Button>{' '}
                        <Button color="secondary" onClick={toggle} style={{ margin: '10px' }}>
                            No
                        </Button>
                    </ModalBody>
                </Modal>
            </CSSTransition>
        );
    });
    
    const AnimatedTimeUp = ({ isOpen, toggle }) => {
        return (
            <CSSTransition
                in={isOpen}
                timeout={300} // Set the duration of the animation
                classNames="nice-animation confirmation-container"
                unmountOnExit
            >
                <Modal isOpen={isOpen} toggle={toggle} centered>
                    {/* <ModalHeader toggle={toggle}>Quiz Completed</ModalHeader> */}
                    <ModalBody>

                        <h2 className="submission-header text-center">
                            Oh no! Time's up for the quiz, but no worries! </h2>
                        <br></br>
                        <h3 className="text-center">
                            Your responses are safely in. Let's continue our journey on the feedback page.                        </h3>
                        <br></br>
                        <img src={ReactLogo} alt="wait svg" style={imageStyle} />
                        <br></br>
                        <h4 className="text-center">
                            Thanks a bunch for being a part of this!
                        </h4>

                    </ModalBody>
                </Modal>

            </CSSTransition>
        );
    }


    return (
        <>
            {loading ? <div
                className="header pb-8 pt-5 pt-lg-6 d-flex align-items-center"

            >
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
                    className="header pb-8 pt-5 pt-lg-6 d-flex align-items-center"
                >

                    <Container className="mt--10" fluid>
                        {isPopupOpen ? <div>
                            {/* <Confetti /> */}
                            <AnimationPopup isOpen={isPopupOpen} toggle={togglePopup} />

                        </div> : null}

                        {isPopupOpenSelective ? <div>
                            <AnimationPopupSelective isOpen={isPopupOpenSelective} toggle={togglePopupSelective} />

                        </div> : null}
                        {isPopupOpenSelectiveReview && (
                            <AnimationPopupSelectiveReview
                                isOpen={isPopupOpenSelectiveReview}
                                toggle={togglePopupSelectiveReview}
                            />
                        )}
                        {isTimeUp ? <AnimatedTimeUp isOpen={isTimeUp} toggle={toggleTimeup} /> : null}
                        <Row className="justify-content-start">
                        </Row>
                        <Row className="justify-content-start">
                            <Col className="order-lg-1" lg="1">
                            </Col>
                            <Col>
                                <h6 className="heading text-gradient-default mb-4">
                                    <b> <span className=" text-center" >{location.state.quizName}</span></b>
                                </h6>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="order-xl-1  mb-5 mb-xl-0" xl="4">
                                <Card className="card-profile shadow bg-gradient-default">
                                    <CardBody className="pt-0 pt-md-2">
                                        <Row>
                                            <div className="row">
                                                <div className="card-profile-stats d-flex justify-content-between ">
                                                    <Col className="justify-content-start order-xl-0" xl="3">
                                                        {/* <i className="ni ni-hat-3 text-white" /><br />
                                                        <span className="quizHeading text-white" >Level : <span className="description text-white" style={{ 'text-transform': 'capitalize' }}>{location.state.courseLevel.charAt(0).toUpperCase() + location.state.courseLevel.slice(1)} </span></span> */}
                                                    </Col>
                                                    <div>
                                                    </div>
                                                    <Col className="order-xl-2 " xl="8">
                                                        <i className="ni ni-time-alarm text-white" /><br />
                                                        <span className="quizHeading text-white" >Time :
                                                            {/* <Timer
                                                            initMinute={location.state.no_OfQuestion}
                                                            initSeconds={0}
                                                        />  */}
                                                            <Timer
                                                                initMinute={location.state.quizDuration}
                                                                initSeconds={0}
                                                                onTimerOver={handleTimerOver}
                                                            />
                                                        </span>
                                                    </Col>
                                                    <div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Row>
                                        <Row>
                                            <div className="col">
                                                <div className="card-profile-stats d-flex justify-content-center ">

                                                    <div
                                                        className="card-body"
                                                        style={{
                                                            display: "flex",
                                                            padding: 20,
                                                            marginTop: 0,
                                                            flexWrap: "wrap"
                                                        }}
                                                    >
                                                        {randomQuestion.map((item, index) => (
                                                            <div
                                                                key={index}
                                                                className="text-gradient-default  bg-white"
                                                                style={{
                                                                    display: "flex",
                                                                    justifyContent: "center",
                                                                    alignItems: "center",
                                                                    height: 48,
                                                                    width: 48,
                                                                    marginRight: '10%',
                                                                    marginLeft: '2%',
                                                                    marginBottom: 5,
                                                                    float: 'left',
                                                                    marginTop: '2%',
                                                                    border: item.saved === true ? "4px solid #2dce89" : item.skipped === true ? "4px solid #fb6340" : item.reviewed === false ? "4px solid #ffd600" : index === currentQuestion ? "#2dce89" : "#8898aa",
                                                                    borderRadius: "25px",
                                                                    cursor: "pointer",
                                                                    fontWeight: 'bolder',
                                                                }}
                                                                onClick={() => onNextQuestionFunction(index, item.id, item.question_id, item)}
                                                            >
                                                                {index + 1}
                                                            </div>
                                                            // ))
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </Row>
                                        {isAtLeastOneQuestionAnswered && (
                                            <Row className="justify-content-center" style={{ alignContent: 'center', alignSelf: 'center' }}>
                                                <Button
                                                    className="mr-4 text-white bg-gradient-danger"
                                                    // color="success"
                                                    // href="#pablo"
                                                    // disabled
                                                    // onClick={(e) => e.preventDefault()}
                                                    // to="/admin/feedback"
                                                    onClick={() => sendFeedback()}
                                                    size="lg"
                                                // tag={Link}
                                                >
                                                    Finish
                                                </Button>
                                            </Row>
                                        )}
                                    </CardBody>
                                </Card>
                            </Col>
                            <br />
                            <Col className="order-xl-1  mb-5 mb-xl-0" xl="8">
                                <Card className="bg-secondary shadow bg-gradient-default">

                                    <CardBody>
                                        <Form>
                                            <Row>
                                                <Col className="order-xl-2" xl="3">
                                                    <h6 className="quizHeading text-white mb-4">
                                                        Questions:<b style={{ fontSize: '17px' }}>{domaindetail.total_question}</b>

                                                    </h6>
                                                </Col>
                                                <Col className="order-xl-2" xl="3">
                                                    <h6 className="quizHeading text-white mb-4">
                                                        Answered:<b className=" text-green mb-4" style={{ fontSize: '17px' }} >{answered}</b>

                                                    </h6>
                                                </Col>
                                                <Col className="order-xl-2" xl="4">
                                                    <h6 className="quizHeading text-white mb-4">
                                                        Mark for review:<b className=" text-yellow mb-4" style={{ fontSize: '17px' }}>{marked}</b>

                                                    </h6>
                                                </Col>
                                                <Col className="order-xl-2" xl="2">
                                                    <h6 className="quizHeading text-white mb-4">
                                                        Skipped:<b className=" text-orange mb-4" style={{ fontSize: '17px' }}>{skipped}</b>

                                                    </h6>
                                                </Col>
                                            </Row>
                                            <hr className="my-3" />
                                            <div className="pl-lg-4  text-white ">
                                                <h6 className="quizHeading text-white mb-4">
                                                    {'Question'} {currentQuestionNumber}: {question}
                                                </h6>
                                                {questionType === "Multiple Select" && (
                                                    <p className="quizHeading text-white mb-4">Select all Which is/are correct</p>
                                                )}

                                                <Row className="quiz-container ">

                                                {answer.map((option) => (
    <Col lg="6" key={option.order}>
        <FormGroup>
            {questionType === "Multiple Select" ? (
                <Label className="checkbox-container mb-2">
                    <Input
                        type="checkbox"
                        onChange={() => handleCheckboxChange(Number(option.option_id), option.order)}
                        checked={multiselectedAnswer.includes(Number(option.option_id))} 
                        className="mr-2 custom-checkbox-input-login"
                    />
                    <span className="checkmark"></span>
                    <span className="text-muted-multi text-white">{option.answerText}</span>
                </Label>
            ) : (
                <RadioButton
                    name="dark"
                    id={option.order}
                    value={option.answerText}
                    text={option.answerText}
                    onChange={handleOptionChange}
                    checked={selectedOption === option.answerText}
                />
            )}
        </FormGroup>
    </Col>
))}

                                                </Row>
                                                <Row className="">
                                                    <Col className="order-xl-1 " xl="4">
                                                        <Label className="checkbox-container mb-2">
                                                            <Input
                                                                type="checkbox"
                                                                checked={reviewStatus[currentQuestion]}
                                                                onChange={() => onMarkforReview()}
                                                                className="mr-2 custom-checkbox-input"
                                                            />
                                                            <span className="checkmark"></span>
                                                            <span className="ml-2 ">Mark for review</span>
                                                        </Label>
                                                        {/* </input> */}
                                                    </Col>
                                                    <Col className="order-xl-1 " xl="5"></Col>
                                                    <Col className="order-xl-1 " xl="3">
                                                        <Button
                                                            className="outline text-white bg-gradient-gray"
                                                            disabled={!isSaveNextButtonEnabled}
                                                            onClick={() => isQuizCompleted ? sendFeedbackandSubmit()
                                                                : handleAnswerOptionClick()}
                                                            size="lg"
                                                        >
                                                            {isQuizCompleted ? "Save & Submit" : "Save & Next"} <i className="ni ni-bold-right text-white" />
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </Form>
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

export default Quiz;
