
// javascipt plugin for creating charts
import Chart from "chart.js";
// reactstrap componens
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
} from "reactstrap";
import {
  Media,
  Progress,
  Table,
} from "reactstrap";
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react";
import Pagination from '@mui/material/Pagination';
// core components
import {
  chartOptions,
  parseOptions,
} from "variables/charts.js";
import Loader from 'react-spinner-loader';
import { LOGOUT } from "store/actions";
import toast, { Toaster } from 'react-hot-toast';

import axios from 'axios';
import configData from '../config';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useEffect } from "react";
import { ACCOUNT_INITIALIZE } from '../store/actions';
const Index = (props) => {
 
  const navigate = useNavigate();

  const [initialValues, setInitialValues] = useState({});
  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }
  const [tableData, settableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const [totalPages, setTotalPages] = useState(0)
  const account = useSelector((state) => state.account);
  const [loading, setLoading] = useState(true);
  const notify = () => toast.error("Something went wrong...!");

  let header = {
    headers: { 'Authorization': "Bearer " + account.token }
  };
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(configData.API_SERVER + 'users', header);
        const userProfileData = response.data.user;

        axios
          .get(configData.API_SERVER + 'getUserScores', header)
          .then(function (response) {
            if (response.data) {
              setLoading(false)
              settableData(response.data);
            }
          })

        // Dispatch action to update user profile in Redux store
        setInitialValues({
          username:userProfileData.username,
          first_name: userProfileData.first_name,
          last_name: userProfileData.last_name,
          address: userProfileData.address,
          city: userProfileData.city,
          country: userProfileData.country,
          postal_code: userProfileData.postal_code,
          about_me: userProfileData.about_me,
        });

        // setLoading(false);
      } catch (error) {
        // Handle error
        console.error('Error fetching user profile:', error);
        if (error.response && error.response.status === 400) {
          notify();
          dispatch({
              type: LOGOUT
          });
          await axios.post(configData.API_SERVER + 'users/logout', {}, header);
      }
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [account.token, dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    const isSubscribed = JSON.parse(localStorage.getItem("isSubscribed"));

    if (token && user) {
      dispatch({
        type: ACCOUNT_INITIALIZE,
        payload: {
          isLoggedIn: true,
          user,
          token,
          isGoogleLogin: false,
          isAdmin,
          isSubscribed,
        },
      });
    }
  }, []);




  return (

    <>
      {loading ? <div
        className="header pb-8 pt-5 pt-lg-6 d-flex align-items-center"

      >
        <Container className="mt--10" fluid>
          <Loader show={loading} type="box" spinnerStyle={{
            primary: '#46B597',
            secondary: '#2D866D'
          }} />

          {/* <Loader type="Circles" color="Red" height={180} width={180} /> */}
        </Container>
      </div> : tableData.length === 0 ? (
        // No data, show Start Quiz card
        <div className="d-flex align-items-center justify-content-center" style={{ height: '80vh' }}>
          <Card className="text-center">
            <CardBody>
              {/* <h3 className="mb-4">Welcome Sadiya!</h3> */}
              <h3 className="mb-4">{`Welcome ${initialValues.username}!`}</h3>

              <p className="mb-4">It seems you haven't started any quizzes yet.</p>
              <button className="btn btn-primary" onClick={() => navigate('/admin/category')}>Start Quiz</button>
            </CardBody>
          </Card>
        </div>
      ) :
        <div>
          <div className="header  pb-6 pt-5 pt-md-6">
            <Container fluid>
            <div>
      <Toaster   position="top-right"
  reverseOrder={false}/>
    </div>
              <div className="header-body">
                {/* Card stats */}
                <Row>

                  <Col lg="12" xl="12">
                    <Card className="card-stats bg-gradient-blue mb-4 mb-xl-0">
                      <CardBody>
                        <Row>
                          <div className="col">
                            {/* <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Traffic
                        </CardTitle> */}
                            <span className="h2 font-weight-bold  text-white mb-0">
                              {`Welcome ${initialValues.username}!`}
                            </span>
                          </div>
                          <Col className="col-auto">
                            {/* <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                              <i className="fas fa-chart-bar" />
                            </div> */}
                          </Col>
                        </Row>
                        {/* <p className="mt-3 mb-0  text-sm">
                          <span className="text-success mr-2">
                            {/* <i className="fa fa-arrow-up" /> 
                            Continue with Certify360..!
                          </span>{" "}
                          <span className="text-nowrap"></span>
                        </p> */}
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
                <br />
                <Row>
                  <Col lg="12" xl="12">


                    <Card className="shadow">
                      <CardHeader className="border-0">
                        <h3 className="mb-0">Result</h3>
                      </CardHeader>
                      <Table className="align-items-center table-flush tableCss" responsive>
                        <thead className="thead-light">
                          <tr>
                            <th scope="col">Course</th>
                            <th scope="col">Total Questions</th>
                            <th scope="col">Score</th>
                            <th scope="col">Percentage</th>
                            {/* <th scope="col">Graph</th> */}
                          </tr>
                        </thead>
                        {tableData.map((item, key) => {


                          return <tbody key={key}>
                            <tr>
                              <th scope="row">
                                <Media className="align-items-center">

                                  <div className="icon icon-shape bg-default text-white rounded-circle shadow">
                                    <i className={`${item.icon}`}></i>
                                  </div>&nbsp;&nbsp;
                                  <Media>
                                    <span className="mb-0 text-sm">
                                      {item.courseName}
                                    </span>
                                  </Media>
                                </Media>
                              </th>
                              <td >{item.total_score}</td>
                              <td>{item.user_score}</td>

                              <td>
                                <div className="d-flex align-items-center">
                                  <span className="mr-2">{item.percentage}%</span>
                                  <div>
                                    <Progress
                                      max="100"
                                      value={item.percentage}
                                      barClassName={item.percentage > 40 ? "bg-green" : "bg-danger"}
                                    />
                                  </div>
                                </div>
                              </td>
                              {/* <td className="col-auto" >
                                <a href="/admin/learning/graph"><div className="d-flex align-items-center" >
                                  <div className="icon icon-shape bg-danger text-white rounded-circle shadow" >
                                    <i class="fa-solid fa-chart-column" />
                                  </div>

                                </div>
                                </a>
                              </td> */}

                            </tr>
                          </tbody>
                        })}
                      </Table>

                    </Card>
                  </Col>
                </Row>

              </div>   

            </Container>
          </div>

          {/* <Container className="mt--08" fluid>
            <Row>
              <Col className="mb-5 mb-xl-0" xl="12">
                <Card className="bg-gradient-default shadow">
                  <CardHeader className="bg-transparent">
                    <Row className="align-items-center">
                      <div className="col">
                      
                        <h2 className="text-white mb-0">PERFORMANCE </h2>
                      </div>
                    
                    </Row>
                  </CardHeader>
                  <CardBody>
                    <div className="chart">
                      <Line
                        data={chartExample1[chartExample1Data]}
                        options={chartExample1.options}
                        getDatasetAtEvent={(e) => console.log(e)}
                      />
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container> */}
        </div>
      }
    </>
  );
};

export default Index;
