import React,{useEffect,useState} from "react";
import {
  Button,
  Card,
  CardBody,
  Container,
  Row,
  Col,
  CardTitle,
} from "reactstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faChartBar, faBookOpen } from "@fortawesome/free-solid-svg-icons";
import GoogleImg from '../../../assets/img/theme/google.png'
import AWSImg from '../../../assets/img/theme/aws.jpg'
import configData from '../../../config';
import useFetchData from '../component/fetchData';
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom"
import { ThreeDots } from 'react-loader-spinner'

const Profile = () => {
  const topics = [
    {
      title: "Google Cloud Certificate",
      description:
        "Earn a recognized certificate in Google Cloud technologies.",
      icon: faBookOpen,
      duration: "10 hours",
      level: "Advanced",
      img: GoogleImg,
      courseId:1
    },
    {
      courseName: "AWS Certificate",
      description:
        "Achieve certification in Amazon Web Services for cloud computing.",
      icon: faBookOpen,
      duration: "8 hours",
      level: "Advanced",
      img:AWSImg,
      courseId:1
    },
  ];
  const url = configData.API_SERVER + 'getSubDomain';
  const data = { "domainId": 1 }, method = 'post';
  const { fetchData } = useFetchData();
  const account = useSelector((state) => state.account);
  const [loading, setLoading] = useState(true);
  const [certificate, setCertificate] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData(method, url, data, account.token,
      (response) => {
        setLoading(false)
        setCertificate(response)

       },
      (error) => {
        console.error("Error occurred:", error);
      }
    );
  }, [])
  const handleButtonClick = (buttonType, courseId,courseName) => {
    navigate(`/admin/learning/details`, { state: { id: courseId,coursename:courseName } });
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
      <div className="header pb-8 pt-5 pt-md-5">
        <Container className="align-items-center" fluid>
          <Row>
            {certificate.map((topic, index) => (
               <Col key={index} lg="6" xl="6">
               <Card className="card-stats mb-6 mb-xl-0">
                 <div
                   className="card-bg"
                   style={{
                     backgroundImage: `url(${topic.img})`,
                     height: "100px", // Set your desired height
                     width: "14%", // Set your desired width
                     backgroundSize: "cover",
                     backgroundPosition: "center",

                     
                   }}
                 ></div>
                  <CardBody>
                    
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          <FontAwesomeIcon icon={faBookOpen} /> {topic.category}
                        </CardTitle>

                        <h2 className="text-gradient-default" style={{ fontWeight: 'bolder' }}>
                          {topic.courseName}
                        </h2>
                      </div>
                    </Row>
                    {/* <p className="mt-3 mb-0 text-sm">
                      <span className="text-default font-weight-bold mr-2">
                      </span>{" "}
                    </p> */}
                    <br />
                    {/* <Row>
                      <div className="col" xl="2">
                        <div className="card-profile-stats d-flex ">
                          <h4 className="text-gradient-default" style={{ fontWeight: 'bolder' }}>
                            <FontAwesomeIcon icon={faClock} /> Duration: {topic.duration}
                          </h4>
                        </div>
                      </div>
                      <div className="col" xl="3">
                        <div className="card-profile-stats d-flex ">
                          <h4 className="text-gradient-default" style={{ fontWeight: 'bolder' }}>
                            <FontAwesomeIcon icon={faChartBar} /> Level: {topic.level}
                          </h4>
                        </div>
                      </div>
                    </Row> */}
                    <Row className="justify-content-center">
                      <Col xs="3">
                        <div className="card-profile-image">
                        <Button
                                
                                onClick={() => handleButtonClick("Study", topic.courseId,topic.courseName)}
                                className="text-white bg-gradient-default"
                            size="lg"
                            
                              >
                            Start Learning
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
                <br></br>
              </Col>
             
            ))}
          </Row>
        </Container>
      </div>
      )}
    </>
  );
};

export default Profile;
