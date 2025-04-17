
import React, { useEffect, useState, useRef } from 'react';
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
  Modal
} from 'reactstrap';
import configData from '../../../config';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { ThreeDots } from 'react-loader-spinner'
import useFetchData from '../component/fetchData';
import { useNavigate } from "react-router-dom"
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useLocation } from 'react-router-dom';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import BackButton from './BackButton';
import AddIcon from '@mui/icons-material/Add';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
const SubModuleDetails = () => {
  const inputRef = useRef(null);
  const deleteInputRef = useRef(null);
  const [showMessage, setShowMessage] = useState('')
  const [statusMessage, setStatusMessage] = useState(true)
  const { fetchData } = useFetchData();
  const account = useSelector((state) => state.account);
  const navigate = useNavigate();
  const [enableUpdateButton, setenableUpdateButton] = useState(false);
  const [showDeleteTopic, setshowDeleteTopic] = useState(false);
  const modelUrlDelete = configData.API_SERVER + 'deleteCertificate';
  const [inputForTopicForDelete, setInputForTopicDelete] = useState('')
  const [inputForTopicForDeleteReason, setInputForTopicDeleteReason] = useState('')
  const [loading, setloading] = useState(true);
  const [showAddTopic, setShowAddTopic] = useState(false);
  const [inputForModel, setInputForModel] = useState('')
  const [notificationMessage, setNotifcationMessage] = useState('')
  const [errorNotification, setErrorNotification] = useState(false)
  const [showNotificationMessage, setshowNotificationMessage] = useState(false)
  const location = useLocation();
  const url = configData.API_SERVER + 'subModuleDetails';
  var data, method = 'post';
  const urlForSubmodule = configData.API_SERVER + 'updateSubModuleDetails';
  const modelUrl = configData.API_SERVER + 'addNewEntry'
  var dataForModel, methodForModel = 'post';
  var dataSubModule, methodSubModule = 'post';
  data = {
    sub_module_id: location.state.submoduleClicked
  }
  const [topicData, setTopicDetailsData] = useState({})
  const [, setCount] = useState(0);
  const handleModuleClick = (item) => {
    navigate(`/admin/user-topic-details`, { state: { topicClicked: item } })
  }
  const showTopicDetails=(method, url, data, account)=>{
    fetchData(method, url, data, account.token,
      (response) => {
        setloading(false)
        setTopicDetailsData(response.result)
        setCount(c => c + 1)
      },
      (error) => {
        console.error("Error occurred:", error);
      }
    );
  }

  useEffect(() => {
    showTopicDetails(method, url, data, account)
  }, []);
  const isNumericOnly=(input)=> input !== null && input !== undefined && /^\d+$/.test(input);
 
  const handleUpdateButton = () => {
    //setloading(true)
    topicData.sub_module_id = location.state.submoduleClicked;
    const dataIterate = { ...topicData };
    delete dataIterate.topic
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
    console.log(requiredFieldsFilled,'requiredFieldToBeFilledsubwew')
    if(requiredFieldsFilled){
      let obj = {}
      obj.sub_module_id = location.state.submoduleClicked;
      const keysForData = Object.keys(dataIterate);
      keysForData.forEach(item => {
        if (item === "inputFields") {
          dataIterate[item].map(item => {
            obj[item.fieldLabel] = item.fieldValue
          })
        }
      })
      dataSubModule = obj
      setTimeout(() => {
        fetchData(methodSubModule, urlForSubmodule, dataSubModule, account.token,
          (response) => {
            const obj = response.result
            obj.topic = topicData.topic
            setTopicDetailsData(obj)
            setNotifcationMessage('Sub Module Details Updated Successfully!!!')
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
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  const handleChange = (event, item) => {
    const moduleDetailsData = topicData.inputFields.map(itemTemp => {
      if (itemTemp.fieldLabel === item) {
        itemTemp.fieldValue = event.target.value
      }
      return itemTemp
    })
    const deatilsToPass = { topic: topicData.topic, inputFields: moduleDetailsData }
    setTopicDetailsData(deatilsToPass)
  }
  const handleAddModuleClick = () => {
    setShowAddTopic(true)
  }
  const toggleModalCertifcate = () => {
    setShowAddTopic(false)
  }
  const handleSaveModule = () => {
    dataForModel = {
      "parentId": location.state.submoduleClicked,
      "name": inputForModel,
      "type": "Topic",
      "reason": inputForTopicForDeleteReason
    }
    setloading(true)
    fetchData(methodForModel, modelUrl, dataForModel, account.token,
      (response) => {
        setloading(true)
        setShowAddTopic(false)
        fetchData(method, url, data, account.token,
          (response) => {
            setloading(true)
            setTopicDetailsData(response.result)
            setloading(false)
            setInputForModel('')
            setNotifcationMessage('Topic Added Successfully!!!')
            setshowNotificationMessage(true)
            setTimeout(() => {
              setshowNotificationMessage(false)
            }, 2000)
          },
          (error) => {
            console.error("Error occurred:", error);
          },
          (error) => {
            console.error("Error occurred:", error);
          }

        );
      })
  }
  const handleBackClick = () => {
    setShowAddTopic(false)
  }
  const handleChangeForModelInput = (e) => {
    console.log(e.target.value, 'wewewvalue--->')
    setInputForModel(e.target.value)
  }
  const handleBackClickForTopicDelete = () => {
    setshowDeleteTopic(false)
  }
  const toggleDeleteTopic = () => {
    setshowDeleteTopic(false)
    setInputForTopicDelete('')
    setInputForTopicDeleteReason('');
    setShowMessage('')
    setStatusMessage(false)
  }
  const handleChangeForModelInputDeleteTopic = (e) => {
    // console.log(e.target.value, 'wewewvalue--->')
    setInputForTopicDelete(e.target.value)
  }
  const handleChangeForModelInputDeleteTopicReason = (e) => {
    // console.log(e.target.value, 'wewewvalue--->')
    setInputForTopicDeleteReason(e.target.value)
  }
  const handleDeletePopup = () => {
    setshowDeleteTopic(true)
    setInputForTopicDelete('')
    setShowMessage('')
    setStatusMessage(false)
  }
  const handleDeleteTopic = async () => {
    let dataForModelDelete = {
      "name": inputForTopicForDelete,
      "type": 'topic',
      "reason": inputForTopicForDeleteReason,
      "parent_id": location.state.submoduleClicked,
    }
    //setloading(true)
    const response2 = await axios.delete(modelUrlDelete, { data: dataForModelDelete, headers: { 'Authorization': 'Bearer ' + account.token } })
    if(response2.data.status){
      setShowMessage(response2.data.message)
      setStatusMessage(response2.data.status)
      setshowDeleteTopic(false)
      setNotifcationMessage('Topic Deleted Successfully!!!')
      setshowNotificationMessage(true)
      showTopicDetails(method, url, data, account)   
    }else{
      setShowMessage(response2.data.error)
      setStatusMessage(response2.data.status)
    }
    
  }
  const handleOpeninput=()=>{
    inputRef.current.focus()
  }
  const handleDeleteOpeninput=()=>{
    deleteInputRef.current.focus()
  }
  return (
    <>
        {showNotificationMessage === true && errorNotification === false ? <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
             {notificationMessage}
           </Alert> : null}
           {showNotificationMessage === true && errorNotification === true ? <Alert icon={<ClearIcon fontSize="inherit" />} severity="error">
             {notificationMessage}
           </Alert> : null}
      <div className="header pb-8 pt-5 d-flex align-items-center">
        <Container className="mt--10" fluid>
          {showAddTopic ? <Modal
            className="modal-dialog-centered divClassNameForModelPlans"
            contentClassName="bg-gradient-white"
            isOpen={showAddTopic}
            toggle={() => toggleModalCertifcate()}
            onOpened={handleOpeninput}
          >
            <div className="modal-header">
              <h4 className="heading mt-4"><b>Want to add more topics?</b></h4>
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



            <div className="modal-body modelBodyForAddModule">
              <Row className="" xl="8">
                <Col lg="6">
                  <div className="divContainerForModuleName">
                    <div className="textModuleName">Name</div>
                    <Input
                      type="text"
                      onChange={(e) => handleChangeForModelInput(e)}
                      name="moduleName"         // Update to first_name
                      value={inputForModel}
                      placeholder="Topic Name"
                      innerRef={inputRef}

                    />
                  </div>
                </Col>

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
                disabled={inputForModel === ""}
                onClick={() => handleSaveModule('Certificate Member')}
              >
                Save
              </Button>

            </div>
          </Modal> : null}
          {showDeleteTopic ? <Modal
            className="modal-dialog-centered divClassNameForDeleteCertificate"
            contentClassName="bg-gradient-white"
            isOpen={showDeleteTopic}
            toggle={() => toggleDeleteTopic()}
            onOpened={handleDeleteOpeninput}
          >
            <div className="modal-header">
              <h4 className="heading mt-4"><b>Want to delete topic?</b></h4>
              <button
                aria-label="Close"
                className="close"
                data-dismiss="modal"
                type="button"
                onClick={() => toggleDeleteTopic()}
              >
                <span aria-hidden={true}>×</span>
              </button>
            </div>



            <div className="modal-body modelBodyForDeleteModule">
              <Row className="" xl="8">
                <Col lg="6">
                  <div className="divContainerForModuleName">
                    <div className="textModuleName">Name</div>
                    <Input
                      type="text"
                      onChange={(e) => handleChangeForModelInputDeleteTopic(e)}
                      name="moduleName"
                      value={inputForTopicForDelete}
                      placeholder="Topic Name"
                      innerRef={deleteInputRef}

                    />
                  </div>
                  <div style={{ 'marginTop': '12px', gap: '10px' }}>
                    <span className="categoryCss">Category:</span>
                    <Input
                      type="text"
                      disabled
                      name="moduleName"
                      value="Topic"

                    />
                  </div>
                  <div className="divContainerForModuleNameReason">
                    <div className="reasonModuleDelete">Reason For Deletion</div>
                    <Input
                      type="text"
                      onChange={(e) => handleChangeForModelInputDeleteTopicReason(e)}
                      name="moduleName"
                      value={inputForTopicForDeleteReason}
                      placeholder="Reason"

                    />
                  </div>
                  {showMessage !== "" ? <div className={statusMessage === true ? "successDeleteMessage" : "errorDeleteMessage"}>{
                    showMessage}</div> : null}
                </Col>
              </Row>
              <Row className="justify-content-center" xl="4">

              </Row>

            </div>
            <div className="modal-footer">
              <Button
                className=" text-white bg-gradient-default mb-4"
                type="button"
                onClick={handleBackClickForTopicDelete}
              >
                Close
              </Button>
              <Button
                className=" text-white bg-gradient-default mb-4"
                type="button"
                disabled={inputForTopicForDelete === ""}
                onClick={() => handleDeleteTopic('Certificate Member')}
              >
                Delete
              </Button>

            </div>
          </Modal> : null}
         
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
                <Row>

                  {<Col className="order-xl-2 mb-5 mb-xl-0" xl="5">
                    <Card className="card-profile shadow">
                      <div className="conatinerForCardHeader moduleContainer">
                        <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4 textCssForHeaders">
                          Topics
                        </CardHeader>
                        <div className='buttonsContainerAddDelete'>
                        <div className="addText" onClick={()=>handleDeletePopup()}>
                          <DeleteOutlineIcon />
                        </div>
                        <div className="addText" onClick={handleAddModuleClick}>
                          <AddIcon />
                        </div>
                        </div>
                      </div>
                      <CardBody>
                        {topicData && Object.keys(topicData).length > 0 && topicData.topic.length > 0 ? <Row>
                          {
                            topicData.topic.map(item => {
                              return (
                                <Col lg="12" key={item.topicName}>
                                  <div className='d-flex my-2 cursorCss'>
                                    <div onClick={() => handleModuleClick(item.id)}>
                                      {item.topicName}
                                    </div>
                                    <ArrowForwardIosIcon />
                                  </div>

                                </Col>
                              )
                            })
                          }
                        </Row> : null}
                      </CardBody>
                    </Card>
                  </Col>}
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

                          {topicData && Object.keys(topicData).length > 0 && topicData.inputFields.length > 0 ? <Row>
                            {
                              topicData.inputFields.map(item => {
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
                                          type={(item.componentType === "text" || item.componentType === undefined) ? "text" : "textarea"}
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

export default SubModuleDetails;
