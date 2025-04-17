

// reactstrap components
import {
  Button,
  Card,
  CardBody,
  Container,
  Row,
  Col,
  CardTitle
} from "reactstrap";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { useSelector } from 'react-redux';
import { ThreeDots } from 'react-loader-spinner'
import useFetchData from '../component/fetchData';

// core components
import configData from '../../../config';

const Profile = () => {
  const navigate = useNavigate();
  const { fetchData } = useFetchData();

  const [certificate, setcertificate] = useState([]);
  const [loading, setloading] = useState(true);
  const account = useSelector((state) => state.account);
  const url = configData.API_SERVER + 'getSubDomain';
  const data = { "domainId": 1 },method='post';

  useEffect(() => {
    fetchData(method,url, data, account.token, 
      (responseData) => {
        console.log("fetch data is",responseData)
        setloading(false);
          setcertificate(responseData);
          responseData.map((item) => {
            console.log("certification is", item.courseName);
          });
      },
      (error) => {
        console.error("Error occurred:", error);
      }
    );
   
  }, []);  // <-- Add account.token to the dependency array
  
  const getQuizDetails = (courseId) => {
    console.log("quiz details are")
    navigate(`/admin/certifications/details`, { state: { id: courseId } });
  };
  return (
    <>
      {loading ? <div
        className="header pb-8 pt-5 pt-lg-6 d-flex align-items-center"

      >
        <Container className="mt--10" fluid>
          {/* <Loader show={loading} type="box" spinnerStyle={{
            primary: '#46B597',
            secondary: '#2D866D'
          }} /> */}
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
          {/* <Loader type="Circles" color="Red" height={180} width={180} /> */}
        </Container>
      </div> :
        <div className="header pb-8 pt-5 pt-md-5">
          <Container className="align-items-center" fluid>
            <Row>
              <Col lg="7" xl="10">
                <h1 className="display-3 text-gradient-darker">Certifications</h1>
              </Col>
            </Row>
          </Container>

          <Container fluid>

            <div className="header-body pt-md-5">
              {/* Card stats */}

              <Row>
                {certificate.map((item, key) => {
                 return key < 5 &&
                  (
                   <Col lg="8" xl="4" key={key}>
                    <hr className="my-4" />
                    <Card className="card-stats  mb-6 mb-xl-0">
                      <CardBody>
                        <Row>
                          <div className="col ">
                            <CardTitle
                              tag="h5"
                              className="text-uppercase text-muted mb-0"
                            >
                            </CardTitle>
                            <span className="h2 font-weight-bold text-black mb-0">
                              {item.courseName}
                            </span>
                          </div>
                          <Col className="col-auto">
                            <div className="icon icon-shape bg-default text-white rounded-circle shadow">
                              <i className={`${item.icon} fa-beat`}></i>
                            </div>
                          </Col>
                        </Row>
                        <p className="mt-3 mb-0  text-sm">

                          <Button
                            className=" text-white bg-gradient-default"
                            //  to="/admin/certifications"
                            size="sm"
                            //  tag={Link}
                            onClick={() => getQuizDetails(item.courseId)}

                          >
                            Get Quiz
                          </Button>
                        </p>
                      </CardBody>
                    </Card>
                  </Col>
                 )

                })}
                {certificate.length >= 5 && (
                
                <Col lg="8" xl="4">
                  <hr className="my-4" />

                  <Card className="card-stats bg-gradient-default mb-4 mb-xl-0">
                    <CardBody >
                      <Row>
                        <div className="col">
                          <CardTitle
                            tag="h5"
                            className="text-uppercase text-muted mb-0"
                          >
                            {/* Sales */}
                          </CardTitle>
                          <span className="h2 font-weight-bold text-white mb-0">Stand out from crowd take Certify360 skill certification test </span>
                        </div>
                        <p className="mt-3 mb-0 text-muted text-sm">
                          <span className="text-white mr-2">

                          </span>
                        </p>
                      </Row>
                      <p className="mt-3 mb-0  text-sm">
                        {/* <span className="text-danger mr-2"> */}
                        <Button
                          className="text-default bg-gradient-white"
                          // onClick={() => handleAnswerOptionClick()}
                          to="/admin/certifications"
                          size="sm"
                          tag={Link}
                        >
                          View All Certifications
                        </Button>
                        {/* </span>{" "} */}
                        {/* <span className="text-nowrap">Since last week</span> */}
                      </p>
                    </CardBody>
                  </Card>
                </Col>

                )}

              </Row>
            </div>
          </Container>
        </div>
      }


    </>
  );
};

export default Profile;
