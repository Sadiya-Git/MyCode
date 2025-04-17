
import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Input,
  InputGroup,
  Container,
  Row,
  Col,
  Table
} from 'reactstrap';
import configData from '../../../config';
import { useSelector } from 'react-redux';
import { ThreeDots } from 'react-loader-spinner'
import useFetchData from '../component/fetchData';
import { useNavigate } from "react-router-dom"
import { useLocation } from 'react-router-dom';
import BackButton from './BackButton';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

const TopicDetails = () => {
  const { fetchData } = useFetchData();
  const account = useSelector((state) => state.account);
  const navigate = useNavigate();
  const [enableUpdateButton, setenableUpdateButton] = useState(false);
  const [loading, setloading] = useState(true);
  const location = useLocation();
  const [topicDetailsData, setTopicDetailsData] = useState({})
  const [errorNotification, setErrorNotification] = useState(false)
  const [notificationMessage, setNotifcationMessage] = useState('')
  const [showNotificationMessage, setshowNotificationMessage] = useState(false)
  const url = configData.API_SERVER + 'topicDetails';
  var data, method = 'post';
  const urlTopic = configData.API_SERVER + 'updateTopicDetails';
  var dataTopic, methodTopic = 'post';
  data = {
    topic_id: location.state.topicClicked
  }
  const isNumericOnly=(input)=> input !== null && input !== undefined && /^\d+$/.test(input);

  const handleUpdateButton = () => {
    //setloading(true)

    //topicData.topic_id = location.state.submoduleClicked;
    const dataIterate = { ...topicDetailsData };
    let requiredFieldsFilled = true,requiredFieldToBeFilled='';
    dataIterate.inputFields.forEach(itemContent => { 
      if (itemContent.required === true){ 
        if (!itemContent.fieldValue) {
          requiredFieldsFilled = false;
          requiredFieldToBeFilled = capitalizeFirstLetter(itemContent.fieldLabel)
          setNotifcationMessage(`Please Enter ${requiredFieldToBeFilled} to Proceed!`)
          setshowNotificationMessage(true)
          setErrorNotification(true)
          setTimeout(() => {
            setNotifcationMessage('')
            setshowNotificationMessage(false)
            setErrorNotification(false)
          }, 3000)
          return; 
        }
        else if (itemContent.dataType == "string") {
          const regex = /^[a-zA-Z0-9,\-\/ ._]+$/;
          const test = regex.test(itemContent.fieldValue)
          if (!test) {
            requiredFieldsFilled = false;
            requiredFieldToBeFilled = capitalizeFirstLetter(itemContent.fieldLabel)
            setNotifcationMessage(`Please Enter ${requiredFieldToBeFilled} in Correct Format to Proceed!`)
            setshowNotificationMessage(true)
            setErrorNotification(true)
            setTimeout(() => {
              setNotifcationMessage('')
              setshowNotificationMessage(false)
              setErrorNotification(false)
            }, 3000)
            return; 
          }
        } 
        else if (itemContent.dataType === "integer") {
          if (!isNumericOnly(itemContent.fieldValue)) {
            requiredFieldsFilled = false;
            requiredFieldToBeFilled = capitalizeFirstLetter(itemContent.fieldLabel)
            setNotifcationMessage(`Please Enter ${requiredFieldToBeFilled} in Correct Format to Proceed!`)
            setshowNotificationMessage(true)
            setErrorNotification(true)
            setTimeout(() => {
              setNotifcationMessage('')
              setshowNotificationMessage(false)
              setErrorNotification(false)
            }, 3000)
            return; 
          }
        }
      }
     
    })
    if (requiredFieldsFilled) {
      let obj = {}
      obj.topic_id = location.state.topicClicked;
      const keysForData = Object.keys(dataIterate);
      keysForData.forEach(item => {
        if (item === "inputFields") {
          dataIterate[item].map(item => {
            obj[item.fieldLabel] = item.fieldValue
          })
        }
      })
      dataTopic = obj
      setTimeout(() => {
        fetchData(methodTopic, urlTopic, dataTopic, account.token,
          (response) => {
            setTopicDetailsData({})
            const obj = response.result
            setTopicDetailsData(obj)
            setNotifcationMessage('Topic Details Updated Successfully!!!')
            setshowNotificationMessage(true)
            setTimeout(() => {
              setshowNotificationMessage(false)
            }, 2000)
          },
          (error) => {
            console.error("Error occurred:", error);
          }

        );
        setloading(false)
      }, 1000)
    }

  }
  useEffect(() => {
    fetchData(method, url, data, account.token,
      (response) => {
        setloading(false)
        setTopicDetailsData(response.result)
      },
      (error) => {
        console.error("Error occurred:", error);
      }
    );
    setloading(false)
  }, []);
  const handleChange = (event, item) => {
    const topicDetailsDataPass = topicDetailsData.inputFields.map(itemTemp => {
      if (itemTemp.fieldLabel === item) {
        itemTemp.fieldValue = event.target.value
      }
      return itemTemp
    })
    const deatilsToPass = { inputFields: topicDetailsDataPass }
    setTopicDetailsData(deatilsToPass)
  }
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  return (
    <>
      <div className="header pb-8 pt-5 d-flex align-items-center">
        <Container className="mt--10" fluid>

          <BackButton />
          {
            loading ? <div
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
              <>
                {showNotificationMessage === true && errorNotification === false ? <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                             {notificationMessage}
                           </Alert> : null}
                           {showNotificationMessage === true && errorNotification === true ? <Alert icon={<ClearIcon fontSize="inherit" />} severity="error">
                             {notificationMessage}
                           </Alert> : null}
                <Row>
                  {<Col className="order-xl-1" xl="7">
                    <Card className="bg-gradient-default shadow">
                      <CardHeader className="bg-gradient-default  border-0">
                        <Row className="align-items-center">
                          <Col xs="8">
                            <h3 className="mb-0 text-white">Details</h3>
                          </Col>
                        </Row>
                      </CardHeader>
                      <CardBody>
                        <div className="pl-lg-4">

                          {topicDetailsData && Object.keys(topicDetailsData).length > 0 && topicDetailsData.inputFields.length > 0 ?
                            <Row>
                              {
                                topicDetailsData.inputFields.map(item => {
                                  return (
                                    <Col lg="6">
                                      <FormGroup className="mb-3" disabled={!enableUpdateButton}>
                                        <label
                                         className={item.required === true ? "form-control-label text-white required-field" : "form-control-label text-white"}
                                          htmlFor=""

                                        >
                                          {capitalizeFirstLetter(item.fieldLabel)}
                                        </label>

                                        <InputGroup className="input-group-alternative inputClassCss">

                                          <Input
                                            type={(item.componentType === "text-box" || item.componentType === undefined) ? "text" : "textarea"}
                                            onChange={(e) => handleChange(e, item.fieldLabel)}
                                            name={item.fieldLabel}         // Update to first_name
                                            value={item.fieldValue}
                                            placeholder={item.fieldLabel}

                                          />

                                        </InputGroup>
                                      </FormGroup>


                                    </Col>
                                  )
                                })
                              }
                            </Row> : null}
                          <Row>
                            <Col xs="4">
                              <Button
                                color="primary"
                                // href="#pablo"
                                onClick={() => handleUpdateButton()}
                                size="lg"
                              >
                                Update
                              </Button>
                            </Col>
                          </Row>

                        </div>
                        <hr className="my-4" />
                        {/* Address */}


                      </CardBody>
                    </Card>
                  </Col>}
                </Row>

              </>
          }
        </Container>
      </div >
    </>
  );
};

export default TopicDetails;
