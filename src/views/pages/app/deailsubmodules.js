import React, { useState, useEffect } from 'react';
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Paper,
  Box
} from '@mui/material';
import { Container } from 'reactstrap';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { makeStyles } from '@material-ui/core/styles';
import { useLocation, useNavigate } from 'react-router-dom';
import useFetchData from '../component/fetchData';
import configData from '../../../config';
import { useSelector } from 'react-redux';
import { ThreeDots } from 'react-loader-spinner';
import axios from 'axios';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ToggleButton from '@mui/material/ToggleButton';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteConfirmationModal from "../component/deletePopup";

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    height: '100vh',
    padding: theme.spacing(2),
    gap: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      height: 'auto',
    },
  },
  sidebar: {
    width: '28%',
    backgroundColor: '#fff',
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    boxShadow: theme.shadows[3],
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginBottom: theme.spacing(2),
    },
  },
  mainContent: {
    flex: 1,
    padding: theme.spacing(2),
    display: 'flex',
    height: '700px',
    overflowY: 'auto',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(2),
    borderRadius: theme.spacing(1),
    boxShadow: theme.shadows[3],
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1),
    },
  },
  video: {
    width: '100%',
    height: '450px',
    borderRadius: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      height: '250px',
    },
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: theme.spacing(2),
    marginTop: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      width: '100%',
    },
  },
  listItem: {
    cursor: 'pointer',
    borderRadius: theme.spacing(0.5),
    '&:hover': {
      backgroundColor: '#e0e0e0',
    },
  },
  activeListItem: {
    backgroundColor: '#172b4d',
    color: 'black',
  },
  statusIcon: {
    color: '#172b4d',
    borderRadius: '50%',
    padding: '5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '10px',
    background: 'linear-gradient(87deg, #fff 0%, #fff 100%)',
    width: '30px',
    height: '30px',
    fontWeight: 'bold'
  },
  completeButton: {
    backgroundColor: '#172b4d ',
    color: '#fff ',
    textTransform: 'none',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  practiceButton: {
    backgroundColor: '#172b4d !important',
    color: '#fff',
    textTransform: 'none',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  videoContainer: {
    display: 'flex-end',
    flexDirection: 'column',
    alignItems: 'flex-end', /* Center aligns the icon below video */
    marginBottom: '16px'
  },
  deleteIcon: {
    marginTop: '8px',
    cursor: 'pointer',
    color: 'red',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    padding: '8px',
    transition: 'color 0.3s ease-in-out',
  }

}));

const GoogleCloudStudyPlan = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const account = useSelector((state) => state.account);
  const isAdmin = useSelector((state) => state.account.isAdmin);
  const location = useLocation();
  const { fetchData } = useFetchData();
  const url = configData.API_SERVER + 'moduletopicstatus';
  const apidata = isAdmin ? { moduleId: location.state.moduleId } : { moduleId: location.state.moduleId };
  const method = 'POST';
  const urlTopic = configData.API_SERVER + 'updateTopicDetails';
  const [notificationMessage, setNotifcationMessage] = useState('')
  const [showNotificationMessage, setshowNotificationMessage] = useState(false)
  const [currentVideo, setCurrentVideo] = useState([]);
  const [currentTitle, setCurrentTitle] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [errorNotification, setErrorNotification] = useState(false)
  const [subModules, setSubModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(false);
  const isUserLoggedInIsAdmin = localStorage.getItem('isAdmin')
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null);


  useEffect(() => {
    fetchTopicInfo();
  }, []);
  const fetchTopicInfo = async () => {
    try {
      fetchData(method, url, apidata, account.token, (response) => {
        console.log("response data is", response.topic_data);
        setSubModules(response.topic_data);
        setLoading(false)
      }, (error) => console.error("Error occurred:", error));
    } catch (error) {
      console.error("Error fetching certificate info:", error);
    }
  };
  useEffect(() => {
    if (subModules.length > 0) {
      let selectedIndex = -1;

      if (location.state.moduleId) {
        console.log("Selected topic ID is", location.state.moduleId);
        selectedIndex = subModules.findIndex(
          (module) => module.topic === location.state.moduleId
        );
      }

      if (selectedIndex === -1) {
        selectedIndex = subModules.findIndex((module) => module.action === "Pending");
      }

      if (selectedIndex === -1) {
        selectedIndex = 0;
      }

      setCurrentVideo(subModules[selectedIndex].youtubeLink);
      setCurrentTitle(subModules[selectedIndex].title);
      setCurrentIndex(selectedIndex);
    }
  }, [subModules, location.state.moduleId]);
  const handleVideoClick = (youtubeLink, title, index) => {
    // Ensure that youtubeLink is properly checked
    const hasValidVideo = youtubeLink && youtubeLink.length > 0 && youtubeLink.some(link => link.trim() !== "");

    if (!hasValidVideo) {
      // console.warn("No valid video available for this topic");
      setCurrentVideo([]); // Set empty array to avoid rendering broken iframes
      setCurrentTitle(title);
      setCurrentIndex(index);
      return;
    }

    setCurrentVideo(youtubeLink);
    setCurrentTitle(title);
    setCurrentIndex(index);
  };

  const handleBackClick = () => {
    navigate('/admin/learning/details', { state: { id: location.state.courseId, coursename: location.state.coursename } });
  };

  const handleDeleteClick = (item) => {
    setVideoToDelete(item);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (videoToDelete) {
      handleDeleteCall(videoToDelete, subModules); 
    }
    setDeleteModalOpen(false);
  };


  const handleDeleteCall = async (linkToRemove, subModules) => {
    console.log("Deleting video:", linkToRemove, "from", subModules[currentIndex].topic);
    setDeleteModalOpen(true);
    if (!videoToDelete) return;
    // const isConfirmed = window.confirm("Are you sure you want to delete this video?");
    // if (!isConfirmed) return;
    let updatedLinks = [...subModules[currentIndex].youtubeLink];
    const deletedIndex = updatedLinks.indexOf(linkToRemove);

    if (deletedIndex !== -1) {
      updatedLinks.splice(deletedIndex, 1);
    }

    var obj = {
      "topic_id": subModules[currentIndex].topic,
      "Topic Name": subModules[currentIndex].title,
      "Youtube Video 1": updatedLinks.length > 0 ? updatedLinks[0] : "",
      "Youtube Video 2": updatedLinks.length > 1 ? updatedLinks[1] : "",
      "Youtube Video 3": updatedLinks.length > 2 ? updatedLinks[2] : "",
      "Study URL": "NA"
    };

    fetchData(method, urlTopic, obj, account.token,
      (response) => {
        setLoading(true);
        setNotifcationMessage('Video Deleted Successfully!!!');
        setshowNotificationMessage(true);

        // Check if the deleted video is the current one
        if (linkToRemove === subModules[currentIndex].youtubeLink[0]) {
          if (updatedLinks.length > 0) {
            setCurrentVideo([updatedLinks[0]]); // Play next available video
          } else {
            setCurrentVideo([]); // No videos left
          }
        }

        // Update index to stay on the same position
        if (deletedIndex === currentIndex) {
          setCurrentIndex(deletedIndex < updatedLinks.length ? deletedIndex : Math.max(0, updatedLinks.length - 1));
        }

        fetchTopicInfo();

        setTimeout(() => {
          setshowNotificationMessage(false);
          setLoading(false);
        }, 2000);
        setDeleteModalOpen(false);
      },
      (error) => {
        console.error("Error occurred:", error);
      }
    );
  };


  const handleMarkAsComplete = () => {
    const currentTopicId = subModules[currentIndex].topic;
    const method = "POST";
    const urllearning = configData.API_SERVER + "learningProgress";
    const apidata = { topic_id: currentTopicId };

    try {
      fetchData(
        method,
        urllearning,
        apidata,
        account.token,
        (response) => {
          if (response.success) {
            const updatedSubModules = [...subModules];
            updatedSubModules[currentIndex].action = "Complete";
            setSubModules(updatedSubModules);

            if (currentIndex < subModules.length - 1) {
              setCurrentIndex(currentIndex + 1);
            } else {
              console.log("No more topics to navigate.");
            }
          } else {
            console.error("Failed to mark as complete:", response.msg);
          }
        },
        (error) => {
          console.error("Error occurred:", error);
        }
      );
    } catch (error) {
      console.error("Error while making API call:", error);
    }
  };


  const getQuizDetails = async (title, topic_id) => {
    try {
      const header = {
        headers: { Authorization: `Bearer ${account.token}` },
      };

      const response = await axios.post(
        `${configData.API_SERVER}enrollUser`,
        {
          course_id: location.state.courseId,
          study_id: location.state.moduleId,
          topic: topic_id,
          enroll_type: "study",
          no_of_question: 5,
        },
        header
      );

      // Navigate to the quiz page with the response data
      navigate(`/admin/quiz`, {
        state: {
          id: location.state.courseId,
          enroll: response.data.enrollment_id,
          courseLevel: "easy",
          domainetail: response.data,
          randomquestion: response.data.questions_random,
          currentQuestion: response.data.questions_random[0].id,
          questionid: response.data.questions_random[0].question_id,
          currentObj: response.data.questions_random[0],
          no_OfQuestion: 5,
          quizName: title,
          quizDuration: 5,
          skill: title,
        },
      });
    } catch (error) {
      console.error("Error occurred while fetching quiz details:", error);
    }
  };

  const loadYoutubeLinks = (currentVideo, currentTitle, subModules) => {
    return currentVideo.map((item, index) => (
      <div key={index} className={classes.videoContainer}>
        <iframe
          className={classes.video}
          src={`${item}?rel=0&modestbranding=1&controls=1&fs=0&iv_load_policy=3`}
          title={currentTitle || "Video"}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
        {/* Delete Icon Below Video */}
        {isUserLoggedInIsAdmin === "true" ? <div className={classes.deleteIcon} onClick={() => handleDeleteClick(item)}>
          <DeleteOutlineIcon />
        </div> : null}
      </div>
    ));
  };

  const classForContent = selected ? "hideContent" : ""
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
        <div className={classes.container}>

          {/* Main Content Section */}
          <div className={classes.mainContent}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2} width="100%">
              <Typography variant="h6" style={{ fontWeight: "bold" }}>
                {currentTitle || "Loading..."}
              </Typography>
              <Button variant="contained" className={classes.practiceButton} onClick={handleBackClick}>
                Back
              </Button>
            </Box>

            {/* Notification Message */}
            {showNotificationMessage && (
              <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                {notificationMessage}
              </Alert>
            )}
            <DeleteConfirmationModal
              open={deleteModalOpen}
              onClose={() => setDeleteModalOpen(false)}
            onConfirm={handleDeleteConfirm}
            />
            {/* Action Buttons */}
            <div className={classes.buttonContainer}>
              {subModules?.[currentIndex] ? (
                <>
                  <Button
                    variant="contained"
                    className={classes.completeButton}
                    onClick={handleMarkAsComplete}
                    disabled={subModules[currentIndex].action === "Complete"}
                  >
                    {subModules[currentIndex].action === "Complete" ? "Completed" : "Mark as Complete"}
                  </Button>
                  <Button
                    variant="contained"
                    className={classes.practiceButton}
                    onClick={() => getQuizDetails(currentTitle, subModules[currentIndex].topic)}
                  >
                    Take a Quiz
                  </Button>
                </>
              ) : (
                <Typography>Loading actions...</Typography>
              )}
            </div>

            {/* Video Section */}
            {currentVideo && currentVideo.length > 0 ? (
              <div className='youtubeLinksContainer'>
                {loadYoutubeLinks(currentVideo, currentTitle, subModules)}
              </div>
            ) : (
              <Typography variant="h6" style={{ color: "red", textAlign: "center", marginTop: "80px" }}>
                No Video Available
              </Typography>
            )}

          </div>

          {/* Sidebar */}
          <Paper
            className={classes.sidebar}
            style={{
              height: `${subModules?.length * 80}px`,
              maxHeight: "95vh",
              overflowY: "auto",
              width: selected ? '80px' : ''
            }}
          >
            <ToggleButton value="check" selected={selected} onChange={() => setSelected((prev) => !prev)}>
              {!selected ? <ArrowForwardIcon color="primary" /> : <ArrowBackIcon color="primary" />}
            </ToggleButton>

            <div className={classForContent}>
              <Typography variant="h6" style={{ fontWeight: 'bold' }} gutterBottom>
                {location?.state?.courseName || "Course"}
              </Typography>

              <List>
                {subModules?.map((subModule, index) => (
                  <ListItem
                    key={index}
                    className={`${classes.listItem} ${currentIndex === index ? classes.activeListItem : ""}`}
                    onClick={() => handleVideoClick(subModule.youtubeLink, subModule.title, index)}
                  >
                    <Box className={classes.statusIcon}>{index + 1}</Box>
                    <ListItemText
                      style={
                        currentIndex === index ? { fontWeight: "bold", color: "#fff" } : { fontWeight: "bold" }
                      }
                      primary={subModule.title}
                      secondary={`Last Score: ${subModule.last_score > 0 ? `${subModule.last_score}/5` : "N/A"}`}
                      secondaryTypographyProps={{
                        style: currentIndex === index ? { fontWeight: "bold", color: "#fff" } : { fontWeight: "bold" }
                      }}
                    />
                    {subModule.action === "Complete" && <CheckCircleIcon style={{ color: "#2d866d" }} />}
                  </ListItem>
                ))}
              </List>
            </div>
          </Paper>
        </div>
      )}
    </>
  );

};


export default GoogleCloudStudyPlan;