import React, { useState, useEffect } from 'react';
import {
    Typography,
    Button,
    LinearProgress,
    Box,
    // Chip,
    useTheme,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Paper
} from '@mui/material';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined'; import { Container, Row, Col } from "reactstrap";
import { makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { Chip } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from "axios";
import { useSelector } from 'react-redux';
import useFetchData from '../component/fetchData';
import configData from '../../../config';
import { ThreeDots } from 'react-loader-spinner';

const useStyles = makeStyles((theme) => ({
    container: {
        backgroundColor: '#f8f9fe',
        padding: '20px',
        [theme.breakpoints.down('sm')]: {
            padding: '10px',
        }
    },
    firstCard: {
        background: 'linear-gradient(87deg, #172b4d 0%, #1a174d 100%)',
        color: 'white',
        padding: '20px',
        borderRadius: '10px',
        marginBottom: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        [theme.breakpoints.down('sm')]: {
            padding: '15px',
        },
    },
    buttonRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        flexWrap: 'wrap',
    },
    resumeButton: {
        backgroundColor: '#f0f0f0 !important',
        color: 'black',
        padding: '8px 20px',
        borderRadius: '5px',
        fontWeight: 'bold',
        textTransform: 'none',
        '&:hover': {
            backgroundColor: '#fff',
        },
    },
    resumeButtonColor: {
        background: 'linear-gradient(87deg, #172b4d 0.9%, #1a174d 100%) !important',
        color: 'white',
        padding: '8px 20px',
        borderRadius: '5px',
        fontWeight: 'bold',
        textTransform: 'none',
        '&:hover': {
            background: 'linear-gradient(87deg, #172b4d 0%, #1a174d 100%) !important',
        },
    },
    progressContainer: {
        width: '20%',
        marginTop: '10px',
        [theme.breakpoints.down('sm')]: {
            width: '100%',
        },
    },
    customProgress: {
        height: '8px',
        borderRadius: '5px',
        backgroundColor: '#f0f0f0 !important',
        '& .MuiLinearProgress-bar': {
            backgroundColor: '#2d866d !important',
        },
    },
    moduleCard: {
        background: '#fff',
        padding: '20px',
        borderRadius: '10px',
        marginBottom: '15px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
            alignItems: 'flex-start',
        },
    },
    tabButton: {
        padding: '10px 20px',
        border: 'none',
        backgroundColor: '#f0f0f0',
        cursor: 'pointer',
        fontWeight: 'bold',
        borderRadius: '5px 5px 0 0',
        '&.active': {
            background: 'linear-gradient(87deg, #172b4d 0%, #1a174d 100%)',
            color: 'white',
        },
        [theme.breakpoints.down('sm')]: {
            width: '100%',
            padding: '10px 10px',
        },
    },
    moduleInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
    },

    statusIcon: {
        color: 'white',
        borderRadius: '50%',
        padding: '5px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: '10px',
        background: 'linear-gradient(87deg, #172b4d 0%, #1a174d 100%)',
        width: '30px',
        height: '30px',
    },
    button: {
        padding: '5px 20px',
        fontWeight: 'bold',
        textTransform: 'none',
        backgroundColor: '#172b4d !important',
        color: 'white',
        '&:hover': {
            backgroundColor: '#1a174d ',
        },
    },
    leftSideCard: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        marginBottom: '20px',
    },
    usefulLinksCard: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        marginBottom: '20px',
    },
    certificateAccordion: {
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        marginBottom: '10px',
        marginTop: '20px'
    },
    certificateDetails: {
        padding: '10px',
    },
    detailsContainer: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        marginTop: '20px',
    },
    detailItem: {
        marginBottom: '10px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
            alignItems: 'flex-start',
        },
    },
    certificateDetailsItem:{
        marginBottom: '10px',
        marginTop: '10px',
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
            alignItems: 'flex-start',
        },
    },
    certificateDetailsItemValue:{
        wordBreak: 'break-all',
        color: '#6b6b6b',
    },
    label: {
        fontWeight: 'bold',
        fontSize: '16px',   
    },
    value: {
        color: '#333',
    },
    chipRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
    },
    chipsContainer: {
        display: 'flex',
        gap: '10px',
        justifyContent: 'flex-end',
        [theme.breakpoints.down('sm')]: {
            justifyContent: 'flex-start',
        },
    },
    chip: {
        backgroundColor: '#fff',
        color: '#172b4d',
    },



    // container: {
    //     display: 'flex',
    //     flexDirection: 'column',
    //     gap: '20px',
    //     padding: '20px',
    //     maxWidth: '1200px',
    //     margin: 'auto',
    // },
    card: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        marginTop: '20px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    },

    headerTitle: {
        fontWeight: 'bold',
        color: '#172b4d',
    },
    languagesChip: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        marginTop: '10px',
    },
    langChip: {
        backgroundColor: '#e6f7f3 !important',
        color: '#2d866d',
        borderRadius: '16px',
        fontWeight: 'bold',
        '&:hover': {
            backgroundColor: '#e6f7f3 !important',
        },
    },
    detailItem: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '15px',
    },
    detailLabel: {
        fontWeight: 'bold',
        color: '#172b4d',
    },
    detailValue: {
        color: '#6b6b6b',
    },
    moduleList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    leftSideCard: {
        padding: '15px',
        backgroundColor: '#e8f0fe',
        borderRadius: '8px',
        marginBottom: '15px',
        position: 'absolute',
        bottom: '0'
    },
    anotherCard: {
        padding: '15px',
        backgroundColor: '#e8f0fe',
        borderRadius: '8px',
        marginTop: '15px',
    },
    certificateAccordion: {
        marginTop: '10px',
        border: '1px solid #ddd',
        boxShadow: 'none',
        borderRadius: '5px',
    },
}));

const LearningPath = () => {
    const classes = useStyles();
    const navigate = useNavigate();
    const location = useLocation();
    const [expanded, setExpanded] = useState(true);
    const [modules, setModules] = useState([]);
    const [examInfo, setExamInfo] = useState({});
    const [progress, setProgress] = useState(0);
    const [activeTab, setActiveTab] = useState("Modules");
    // const { fetchData } = useFetchData();
    const account = useSelector((state) => state.account);
    const isAdmin = useSelector((state) => state.account.isAdmin);
    const [loading, setLoading] = useState(true)
    const [certificate, setCertificate] = useState([])
    const [recom, setRecom] = useState([])

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };
    const { fetchData } = useFetchData();
    const url = configData.API_SERVER + 'certificateInfo';
    const learniurl = configData.API_SERVER + 'certificateDetail';
    const apidata = isAdmin ? { courseId: location.state.id } : { courseId: location.state.id };
    const method = 'POST';
    const recomurl = configData.API_SERVER + 'certificateRecomm';
    const [selectedModuleId, setSelectedModuleId] = useState('');
    const methodForFetchingRecommendation = 'POST';


    useEffect(() => {
        const fetchCertificateInfo = async () => {
            try {
                fetchData(method, url, apidata, account.token, (response) => {
                    setLoading(false);
                    setModules(response.result.data);
                    console.log("module id is", response.result.data[0].moduleId)
                    setSelectedModuleId(response.result.data[0].moduleId);
                    setCertificate(response.result);

                }, (error) => console.error("Error occurred:", error));
            }
            catch (error) {
                console.error("Error fetching certificate info:", error);
            }
        };
        const fetchRecommendation = async () => {
            try {
                fetchData(method, recomurl, apidata, account.token, (response) => {
                    console.log("recommendation is", response)
                    setRecom(response.recommended_courses);
                }, (error) => console.error("Error occurred:", error));
            }
            catch (error) {
                console.error("Error fetching certificate info:", error);
            }
        }
        const fetchLearningDetails = async () => {

            try {
                fetchData(method, learniurl, apidata, account.token, (response) => {
                    const { inputFields } = response.result;
                    const mappedFields = inputFields.reduce((acc, field) => {
                        acc[field.fieldLabel] = field.fieldValue;
                        return acc;
                    }, {});
                    console.log(mappedFields, 'mappedFieldsData---->')
                    setExamInfo({
                        courseName: mappedFields.courseName,
                        duration: mappedFields["duration (mins)"],
                        difficulty: mappedFields.difficulty,
                        noOfQuestions: mappedFields.noOfQuestions,
                        category: mappedFields.category,
                        passingScore: mappedFields.passingScore,
                        examType: mappedFields.examType,
                        referenceLink: mappedFields.reference_link,
                        //   moduleNames: moduleNames,
                    });
                }, (error) => console.error("Error occurred:", error));
            }
            catch (error) {
                console.error("Error fetching certificate info:", error);
            }

        }
        fetchRecommendation();
        fetchCertificateInfo();
        fetchLearningDetails();
    }, []);
    const fetchCertificateInfoForSelectedRecommendation = async (apiData) => {
        try {
            fetchData(methodForFetchingRecommendation, url, apiData, account.token, (response) => {
                setModules(response.result.data);
                setSelectedModuleId(response.result.data[0].moduleId);
                setCertificate(response.result);

            }, (error) => console.error("Error occurred:", error));
        }
        catch (error) {
            console.error("Error fetching certificate info:", error);
        }
    };
    const fetchRecommendationForSelectedRecommendation = async (apiData) => {
        try {
            fetchData(methodForFetchingRecommendation, recomurl, apiData, account.token, (response) => {
                setRecom(response.recommended_courses);
            }, (error) => console.error("Error occurred:", error));
        }
        catch (error) {
            console.error("Error fetching certificate info:", error);
        }
    }
    const fetchLearningDetailsForSelectedRecommendation = async (apiData) => {
        try {
            fetchData(methodForFetchingRecommendation, learniurl, apiData, account.token, (response) => {
                const { inputFields } = response.result;
                const mappedFields = inputFields.reduce((acc, field) => {
                    acc[field.fieldLabel] = field.fieldValue;
                    return acc;
                }, {});

                setExamInfo({
                    courseName: mappedFields.courseName,
                    duration: mappedFields.duration,
                    difficulty: mappedFields.difficulty,
                    noOfQuestions: mappedFields.noOfQuestions,
                    category: mappedFields.category,
                    passingScore: mappedFields.passingScore,
                    examType: mappedFields.examType,
                    //   moduleNames: moduleNames,
                });
                //  setLoading(false);
            }, (error) => console.error("Error occurred:", error));
        }
        catch (error) {
            console.error("Error fetching certificate info:", error);
        }

    }
    const fetchDataForRecommend = (data) => {
        fetchCertificateInfoForSelectedRecommendation({ courseId: data.courseId })
        fetchRecommendationForSelectedRecommendation({ courseId: data.courseId })
        fetchLearningDetailsForSelectedRecommendation({ courseId: data.courseId })
    }
    const handleRecommendedCourseName = (data) => {
        setLoading(true)
        navigate(null, { state: { id: data.courseId } })
        fetchDataForRecommend(data)
        setTimeout(() => {
            setLoading(false)
        }, 500)
    }
    const handleButtonClick = (buttonType) => {
        const path = buttonType === "Mock" || buttonType === "Practice"
            ? `/admin/certifications/details`
            : `/admin/learning/details`;
        navigate(path, { state: { id: location.state.id, type: buttonType, coursename: location.state.coursename } });
    };
    const resumeCertificate = (id, CourseName) => {
        console.log("my certificate id is", id)
        navigate('/admin/submodule-certificate-details', { state: { moduleId: id, courseName: CourseName, courseId: location.state.id } })
    }
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
                                wrapperStyle={{}}
                                wrapperClass=""
                            />
                        </div>
                    </Container>
                </div>
            ) : (
                <Container fluid className={classes.container}>
                    <Row>
                        <Col lg="9" sm="12">
                            <div className={classes.firstCard}>
                                <div className={classes.chipRow}>
                                    <Typography variant="h5" style={{ fontWeight: 'bold', color: 'white' }}>
                                        {certificate.courseName}
                                    </Typography>
                                    <div className={classes.chipsContainer}>

                                        <Chip
                                            label={
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <span>Practice</span>
                                                    <ArrowOutwardIcon style={{ marginLeft: '8px', color: '#2d866d' }} sx={{ fontSize: 20 }} />
                                                </div>
                                            }
                                            onClick={() => handleButtonClick('Practice')}
                                            className={classes.langChip}
                                        />
                                        <Chip
                                            label={
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <span>Mock</span>
                                                    <ArrowOutwardIcon style={{ marginLeft: '8px', color: '#2d866d' }} sx={{ fontSize: 20 }} />
                                                </div>
                                            }
                                            onClick={() => handleButtonClick('Mock')}
                                            className={classes.langChip}
                                        />
                                    </div>
                                </div>

                                <Typography variant="body2">{certificate.courseCode}
                                </Typography>
                                <div className={classes.buttonRow}>
                                    <Button className={classes.resumeButton} onClick={() => resumeCertificate(selectedModuleId, certificate.courseName)} style={{ color: 'black', fontWeight: 'bold' }}>Resume Certificate</Button>
                                    <div className={classes.progressContainer}>
                                        <LinearProgress
                                            variant="determinate"
                                            value={progress}
                                            className={classes.customProgress}
                                        />
                                    </div>
                                    <Box>{`${certificate.course_status}% Complete`}</Box>
                                </div>
                            </div>

                            <div>
                                <button
                                    className={`${classes.tabButton} ${activeTab === "Modules" ? "active" : ""}`}
                                    onClick={() => setActiveTab("Modules")}
                                >
                                    Modules
                                </button>
                                <button
                                    className={`${classes.tabButton} ${activeTab === "Exam Info" ? "active" : ""}`}
                                    onClick={() => setActiveTab("Exam Info")}
                                >
                                    Exam Info
                                </button>
                            </div>
                            {activeTab === "Modules" && (
                                <div className="modulesLearningHeight">
                                    {modules.length && modules.map((module, index) => (
                                        <div key={index} className={classes.moduleCard}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', flexGrow: 1, flexBasis: '200px', marginBottom: '10px' }}>
                                                    {module.progress === 100 ? (
                                                        <div className={classes.statusIcon}>
                                                            <CheckOutlinedIcon />
                                                        </div>
                                                    ) : (
                                                        <Box className={classes.statusIcon}>{index + 1}</Box>
                                                    )}
                                                    <div className={classes.moduleInfo}>
                                                        <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                                                            {module.ModName}
                                                        </Typography>
                                                    </div>
                                                </div>

                                                <div style={{ width: '150px', marginRight: '10px', flexBasis: '150px', marginBottom: '10px' }}>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={module.progress}
                                                        className={classes.customProgress}
                                                    />
                                                </div>

                                                <Box style={{ width: '50px', textAlign: 'center', flexBasis: '50px', marginBottom: '10px' }}>
                                                    {`${module.progress}%`}
                                                </Box>

                                                <Button
                                                    className={classes.button}
                                                    style={{ width: '100px', marginLeft: '10px', flexBasis: '100px', marginBottom: '10px', color: '#f0f0f0' }}
                                                    onClick={() => resumeCertificate(module.moduleId, certificate.courseName)}
                                                >
                                                    {module.progress === 100 ? "Complete" : module.progress > 0 ? "Resume" : "Start"}
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}


                            {activeTab === "Exam Info" && (
                                <div className={classes.container}>
                                    <Paper className={classes.card}>
                                        <Typography variant="h5" className={classes.headerTitle}>
                                            Take the Exam
                                        </Typography>
                                        <Typography variant="body1" paragraph>
                                            You will have {examInfo.duration} minutes to complete this assessment.
                                        </Typography>
                                    </Paper>

                                    <Paper className={classes.card}>
                                        <Typography variant="h6" className={classes.headerTitle}>
                                            Exam Details
                                        </Typography>
                                        <div className={classes.detailItem}>
                                            <Typography className={classes.detailLabel}>Course Name:</Typography>
                                            <Typography className={classes.detailValue}>{examInfo.courseName}</Typography>
                                        </div>
                                        <div className={classes.detailItem}>
                                            <Typography className={classes.detailLabel}>Duration:</Typography>
                                            <Typography className={classes.detailValue}>{examInfo.duration} minutes</Typography>
                                        </div>
                                        <div className={classes.detailItem}>
                                            <Typography className={classes.detailLabel}>Difficulty:</Typography>
                                            <Typography className={classes.detailValue}>{examInfo.difficulty}</Typography>
                                        </div>
                                        <div className={classes.detailItem}>
                                            <Typography className={classes.detailLabel}>No. of Questions:</Typography>
                                            <Typography className={classes.detailValue}>{examInfo.noOfQuestions}</Typography>
                                        </div>
                                        <div className={classes.detailItem}>
                                            <Typography className={classes.detailLabel}>Category:</Typography>
                                            <Typography className={classes.detailValue}>{examInfo.category}</Typography>
                                        </div>
                                        <div className={classes.detailItem}>
                                            <Typography className={classes.detailLabel}>Passing Score:</Typography>
                                            <Typography className={classes.detailValue}>{examInfo.passingScore}</Typography>
                                        </div>
                                        <div className={classes.detailItem}>
                                            <Typography className={classes.detailLabel}>Exam Type:</Typography>
                                            <Typography className={classes.detailValue}>{examInfo.examType}</Typography>
                                        </div>
                                    </Paper>
                                </div>
                            )}

                        </Col>
                        <Col lg="3" sm="12">
                            <div className={classes.usefulLinksCard}>
                                <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                                    Certificate Details
                                </Typography>
                                <div className={classes.certificateDetailsItem}>
                                    <Typography className={classes.detailLabel}>Duration:</Typography>
                                    <Typography className={classes.certificateDetailsItemValue}>{examInfo.duration} minutes</Typography>
                                </div>
                                <div className={classes.certificateDetailsItem}>
                                    <Typography className={classes.detailLabel}>No of Questions:</Typography>
                                    <Typography className={classes.certificateDetailsItemValue}>{examInfo.noOfQuestions}</Typography>
                                </div>
                               

                                <div className={classes.certificateDetailsItem}>
                                    <Typography className={classes.detailLabel}>Passing Score:</Typography>
                                    <Typography className={classes.certificateDetailsItemValue}>{examInfo.passingScore}</Typography>
                                </div>
                                <div className={classes.certificateDetailsItem}>
                                    <Typography className={classes.certificateDetailsItemValue}>
                                        <a href={examInfo.referenceLink}>Click here</a> to get more details about the Certification.
                                        </Typography>
                                </div>
                            </div>
                            <div className={classes.leftSideCard}>
                                <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                                    Recommendations
                                </Typography>
                                {recom.length > 0 && recom.map((recommend) => (
                                    <Accordion className={classes.certificateAccordion} key={recommend.courseName}>
                                        <AccordionSummary
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <Typography onClick={() => handleRecommendedCourseName(recommend)}>{recommend.courseName}</Typography>
                                        </AccordionSummary>
                                    </Accordion>
                                ))}
                            </div>

                            {/* New Card below Recommendations
                            <div className={classes.anotherCard}>
                                <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                                    My Bookmarks
                                </Typography>
                                {/* <Typography variant="body2" style={{ marginTop: '10px' }}>
        AWS Certified Solution Architect-Associate
        </Typography>
        <Typography variant="body2" style={{ marginTop: '10px' }}>
        Google Cloud Professional Cloud Architect
        </Typography> 
                                <Accordion className={classes.certificateAccordion} key={1}>
                                    <AccordionSummary
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                    >
                                        <Typography>        AWS Certified Solution Architect-Associate
                                        </Typography>
                                    </AccordionSummary>
                                </Accordion>
                            </div> */}
                        </Col>

                    </Row>
                </Container>
            )}
        </>
    );
};

export default LearningPath;
