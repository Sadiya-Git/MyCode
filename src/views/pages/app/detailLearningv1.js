import React, { useState, useEffect } from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    FormControl,
    Select,
    MenuItem,
    LinearProgress,
} from '@mui/material';
import {
    Container,
    Row,
    Col,
} from "reactstrap";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import YouTubeIcon from '@mui/icons-material/YouTube';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import { useNavigate } from "react-router-dom";
import YouTubePopup from '../component/youtubepopup';
import { ModalBody, Button } from 'reactstrap';
import { CSSTransition } from 'react-transition-group';
import { Dialog, DialogTitle, IconButton } from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import useFetchData from '../component/fetchData';
import { useSelector } from 'react-redux';
import configData from '../../../config';
import { useLocation } from 'react-router-dom';
import { ThreeDots } from 'react-loader-spinner';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import { LOGOUT } from 'store/actions';

const useStyles = makeStyles({
    tableRow: {
        height: '60px',
        fontWeight: 'bold',
    },
    tableCell: {
        whiteSpace: 'normal',
        wordBreak: 'break-word',
        padding: '8px',
        verticalAlign: 'top',
        fontWeight: 'bold',
    },
    moduleCell: {
        width: '50%',  // Adjust this value as needed
        maxWidth: '0',
    },
    totalQuestionsCell: {
        width: '20%',  // Adjust this value as needed
    },
    learnCell: {
        width: '15%',  // Adjust this value as needed
    },
    quizCell: {
        width: '15%',  // Adjust this value as needed
    },
    boldText: {
        fontWeight: 'bold',
        color: '#32325D',
    },
    link: {
        color: '#32325D',
        textDecoration: 'none',
        display: 'inline-block',
        width: '100%',
    },
    icon: {
        cursor: 'pointer',
    },
});

const YoutubeVideoPopup = ({ isOpen, toggle, YouTubeLink, YouTubeLinkTitle }) => (
    <CSSTransition
        in={isOpen}
        classNames="nice-animation confirmation-container"
        unmountOnExit
    >
        <Dialog open={isOpen} onClose={toggle} fullWidth maxWidth="lg">
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold', color: '#32325D' }}>
                {YouTubeLinkTitle}
                <IconButton onClick={toggle}>
                    <HighlightOffIcon style={{ color: '#FF0000' }} />
                </IconButton>
            </DialogTitle>
            <ModalBody>
                <div className="embed-responsive embed-responsive-16by9">
                    <iframe
                        title="YouTube Video"
                        width="560"
                        height="315"
                        className="embed-responsive-item"
                        src={YouTubeLink}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                    />
                </div>
            </ModalBody>
        </Dialog>
    </CSSTransition>
);

const GoogleCloudStudyPlan = () => {
    const [accordionItems, setAccordionItems] = useState([]);
    const location = useLocation();
    const classes = useStyles();
    const dispatch = useDispatch();

    const [popupOpen, setPopupOpen] = useState(false);
    const [currentYouTubeLink, setCurrentYouTubeLink] = useState('');
    const [currentYouTubeLinkTitle, setCurrentYouTubeLinkTitle] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const account = useSelector((state) => state.account);
    const { fetchData } = useFetchData();
    const data = { courseId: location.state.id };
    const method = 'post';
    const [loading, setLoading] = useState(true);
    const url = `${configData.API_SERVER}learningPath`;
    const urlforStatus = `${configData.API_SERVER}updateStatus`;
    function createData(name, calories, fat, carbs, protein) {
        return { name, calories, fat, carbs, protein };
      }
      
    const [rows, setRows] = useState([]);

    useEffect(() => {
        fetchData(method, url, data, account.token,
            (response) => {
                setLoading(false);
                setAccordionItems(response.result);
                const mappedData = response.result.articles.map(article =>
                    createData(article.study_id, article.title, article.action, article.youtubeLink)
                  );
                  setRows(mappedData)
            },
            (error) => {
                if (error.response && error.response.status === 500) {              
                    dispatch({
                        type: LOGOUT
                    });
                }
                console.error("Error occurred:", error.response);
            }
        );
    }, []);
    function createData(study_id, title, action, youtubeLink) {
        return { study_id, title, action, youtubeLink };
      }
    const toggleModal = (youtubelink, title) => {
        setIsOpen(!isOpen);
        setCurrentYouTubeLink(youtubelink);
        setCurrentYouTubeLinkTitle(title);
    };

    const navigate = useNavigate();
    const [accordionExpanded, setAccordionExpanded] = useState(true);

    const getQuizDetails = (topicId,studyId,title) => {
        let header = {
            headers: { Authorization: `Bearer ${account.token}` }
        };
        axios.post(`${configData.API_SERVER}enrollUser`, {
            course_id: location.state.id,
            study_id: studyId,
            topic: topicId,
            enroll_type: "study",
            no_of_question: 5
        }, header)
        .then(function (response) {
            navigate(`/admin/quiz`, {
                state: {
                    id: location.state.id,
                    enroll: response.data.enrollment_id,
                    courseLevel: "easy",
                    domainetail: response.data,
                    randomquestion: response.data.questions_random,
                    currentQuestion: response.data.questions_random[0].id,
                    questionid: response.data.questions_random[0].question_id,
                    currentObj: response.data.questions_random[0],
                    no_OfQuestion: 5,
                    quizName: location.state.coursename,
                    quizDuration: 5,
                    skill:title
                }
            });
        })
    };

    const handleActionChange = (dayIndex, articleIndex, value, article) => {
        const newAccordionItems = [...accordionItems];
        newAccordionItems[dayIndex].articles[articleIndex].action = value;
        fetchData(method, urlforStatus, { study_id: article.study_id, status: value }, account.token,
            (response) => {
                setLoading(false);
            },
            (error) => {
                console.error("Error occurred:", error);
            }
        );
    };

    const calculateCompletion = (articles) => {
        const completedCount = articles.filter((article) => article.action === 'Done').length;
        return (completedCount / articles.length) * 100;
    };

    const handleAccordionChange = (event, expanded, dayIndex) => {
        setAccordionExpanded(expanded);
    };

    const handleClosePopup = () => {
        setCurrentYouTubeLink('');
        setPopupOpen(false);
    };

    return (
        <>
        {loading ? (
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
                        />
                    </div>
                </Container>
            </div>
        ) : (
            <div className="header pb-8 pt-5 pt-md-5">
                <Container className="align-items-center" fluid>
                    <Row>
                        <Col lg="7" xl="10">
                            <h2 className="display-3 text-gradient-darker"> {location.state.coursename}</h2>
                        </Col>
                    </Row>
                </Container>
                <Container fluid>
                    <YoutubeVideoPopup isOpen={isOpen} toggle={toggleModal} YouTubeLink={currentYouTubeLink} YouTubeLinkTitle={currentYouTubeLinkTitle} />
                    <Row>
                        <Col lg="12" xl="12">
                            <Grid container spacing={3}>
                                {accordionItems.map((item, dayIndex) => (
                                    <Grid item xs={12} key={dayIndex}>
                                        <Accordion
                                            style={{ backgroundColor: '#f0f0f0', color: '#32325D' }}
                                            defaultExpanded={dayIndex === 0}
                                            onChange={(event, expanded) => handleAccordionChange(dayIndex, expanded)}
                                        >
                                            <AccordionSummary expandIcon={<ExpandMoreIcon style={{ color: '#32325D' }} />}>
                                                <Typography variant="h6" style={{ color: '#32325D' }}>
                                                    <strong>Module {dayIndex + 1}: {item.modules[0]}</strong>
                                                </Typography>
                                                 {/* <LinearProgress
                                                    variant="determinate"
                                                    value={calculateCompletion(item.articles)}
                                                    sx={{ height: '10px', borderRadius: '5px', marginTop: '5px' }}
                                                    style={{
                                                        position: 'absolute',
                                                        bottom: 0,
                                                        left: 0,
                                                        right: 0,
                                                    }}
                                                /> */}
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <TableContainer component={Paper}>
                                                    <Table>
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell className={`${classes.tableCell} ${classes.moduleCell}`}>Module</TableCell>
                                                                <TableCell className={`${classes.tableCell} ${classes.learnCell}`}>Learn</TableCell>
                                                                <TableCell className={`${classes.tableCell} ${classes.quizCell}`}>Quiz</TableCell>
                                                                <TableCell className={`${classes.tableCell} ${classes.totalQuestionsCell}`}>Last Score</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {item.articles.map((article, articleIndex) => (
                                                                <TableRow key={article.study_id}>
                                                                    <TableCell className={`${classes.tableCell} ${classes.moduleCell}`}>
                                                                        {/* <a href='/admin/learning/detailsmodule' target="_blank" rel="noopener noreferrer"> */}
                                                                            {article.title}
                                                                        {/* </a> */}
                                                                    </TableCell>
                                                                    <TableCell className={`${classes.tableCell} ${classes.learnCell}`}>
                                                                        <YouTubeIcon
                                                                            onClick={() => toggleModal(article.youtubeLink, article.title)}
                                                                            style={{ color: '#FF0000', cursor: 'pointer' }}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell className={`${classes.tableCell} ${classes.quizCell}`}>
                                                                        <a onClick={() => getQuizDetails(article.topic,article.study_id,article.title)} target="_blank" rel="noopener noreferrer">
                                                                            <PlaylistAddCheckIcon  style={{ cursor: 'pointer'}}/>
                                                                        </a>
                                                                    </TableCell>
                                                                    <TableCell className={`${classes.tableCell} ${classes.totalQuestionsCell}`}>{article.last_score}</TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </AccordionDetails>
                                        </Accordion>
                                    </Grid>
                                ))}
                            </Grid>
                        </Col>
                    </Row>
                </Container>
            </div>
        )}
    </>
    );
};

export default GoogleCloudStudyPlan;
