

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
  Table,
  Modal
} from 'reactstrap';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { ThreeDots } from 'react-loader-spinner'
import useFetchData from '../component/fetchData';
import { useNavigate } from "react-router-dom"
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useLocation } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import configData from '../../../config';
import Select from 'react-select'
import toast, { Toaster } from 'react-hot-toast';
import BackButton from './BackButton';
import { convertToObject } from 'typescript';
const CeriticateSpecificDetails = () => {
  const [showMessage, setShowMessage] = useState('')
  const inputRef = useRef(null);
  const deleteInputRef = useRef(null);
  const [statusMessage, setStatusMessage] = useState(true)
  const url = configData.API_SERVER + 'certificateDetail';
  const updateUrl = configData.API_SERVER + 'updateCertificateDetails'
  const modelUrl = configData.API_SERVER + 'addNewEntry'
  var data, method = 'post';
  const modelUrlDelete = configData.API_SERVER + 'deleteCertificate';
  var dataForModel, methodForModel = 'post';
  var dataForCertificate, methodForUpdateCertificate = 'post';
  const urlCertificate = configData.API_SERVER + 'getSubDomain';
  const isAdmin = useSelector((state) => state.account.isAdmin);
  const dataCertificate = { "domainId": 1, "active": null }, methodCertificate = 'post';
  const { fetchData } = useFetchData();
  const account = useSelector((state) => state.account);
  const navigate = useNavigate();
  const [enableUpdateButton, setenableUpdateButton] = useState(false);
  const [isPopupOpenForSuccess, setPopupOpenForSuccess] = useState(false);
  const togglePopupForSuccess = () => setPopupOpenForSuccess(!isPopupOpenForSuccess);
  const [loading, setloading] = useState(true);
  const [showDeleteModule, setshowDeleteModule] = useState(false);
  const location = useLocation();
  const [dropdownVal, setDropdownVal] = useState({ label: 'Select Certificate', value: 'Select Certificate' })
  const [inputForModuleForDelete, setInputForModuleDelete] = useState('')
  const [inputForModuleForDeleteReason, setInputForModuleDeleteReason] = useState('')
  const [courseSelected, setCourseSelected] = useState('')
  const categories = useSelector((state) => state.domainCeretifctaes);
  const [coursesForDropdown, setCoursesForDropdown] = useState([])
  const [modulesData, setModulesData] = useState({})
  const [notificationMessage, setNotifcationMessage] = useState('')
  const [showNotificationMessage, setshowNotificationMessage] = useState(false)
  const [showAddModule, setShowAddModule] = useState(false);
  const [showAddCertifcate, setShowAddCertificate] = useState(false);
  const [inputForModel, setInputForModel] = useState('')
  const [inputForCertificate, setInputForCertificate] = useState('')
  const [errorNotification, setErrorNotification] = useState(false)
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  const commonMethodForApiCall = (method, url, data, account) => {
    setInputForCertificate('')
    fetchData(method, url, data, account.token,
      (response) => {
        setloading(true)
        setModulesData(response.result)
        setloading(false)
        setshowNotificationMessage(false)
      },
      (error) => {
        notify();
        console.error("Error occurred:", error);
      }

    );
  }
  const notify = () => toast.error("Something went wrong...!");
  const handleSelect = (e) => {
    setloading(true)
    setModulesData({})
    setshowNotificationMessage(false)
    setDropdownVal({ label: e.value, value: e.value })
    setCourseSelected(e.id)
    data = {
      courseId: e.id
    }
    setInputForCertificate('')
    fetchData(method, url, data, account.token,
      (response) => {
        setloading(true)
        console.log(response, 'eere--->')
        setModulesData(response.result)
        setloading(false)
      },
      (error) => {
        console.error("Error occurred:", error);
      }

    );
    setloading(false)
  }



  const handleModuleClick = (moduleSelected) => {
    console.log(moduleSelected, 'wewew--->')
    navigate(`/admin/user-modules-details`, { state: { moduleClicked: moduleSelected } })
  }

  const certificateCall = (e) => {
    setloading(true)
    setModulesData({})
    setshowNotificationMessage(false)
    setCourseSelected(e)
    data = {
      courseId: e
    }
    setloading(true)
    fetchData(method, url, data, account.token,
      (response) => {
        setloading(true)
        setModulesData(response.result)
        setloading(false)
      },
      (error) => {
        console.error("Error occurred:", error);
      }

    );
    setloading(false)
  }

  useEffect(() => {
    certificateCall(location.state.certificateClicked)
  }, []);

  const isNumericOnly=(input)=> input !== null && input !== undefined && /^\d+$/.test(input);

  const handleUpdateButton = () => {
    setloading(true)
    modulesData.courseId = courseSelected;
    const dataIterate = { ...modulesData };
    delete dataIterate.module
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
    console.log(requiredFieldsFilled,'w33')
    if(requiredFieldsFilled){
      let obj = {}
      obj.courseId = dataIterate.courseId;
      const keysForData = Object.keys(dataIterate);
      keysForData.forEach(item => {
        if (item === "inputFields") {
          dataIterate[item].map(item => {
            if(item.fieldLabel=="active" || item.fieldLabel=="published"){
              obj[item.fieldLabel] = Number(item.fieldValue)
            }else{
              obj[item.fieldLabel] = item.fieldValue
            }
          })
        }
      })
      dataForCertificate = obj
      setTimeout(() => {
        fetchData(methodForUpdateCertificate, updateUrl, dataForCertificate, account.token,
          (response) => {
            const obj = response.result
            obj.module = modulesData.module
            setModulesData(obj)
            setNotifcationMessage('Certificate Details Updated Successfully!!!')
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
    setloading(false)
   
  }
  const handleBackClickForModuleDelete = () => {
    setshowDeleteModule(false)
    setShowMessage('')
    setStatusMessage(false)
  }
  const handleDeleteModule = async () => {
    let dataForModelDelete = {

      "name": inputForModuleForDelete,
      "type": 'module',
      "reason": inputForModuleForDeleteReason,
      "parent_id": courseSelected
    }
    //setloading(true)
    const response2 = await axios.delete(modelUrlDelete, { data: dataForModelDelete, headers: { 'Authorization': 'Bearer ' + account.token } })
    if (response2.data.status) {
      setNotifcationMessage('Module Deleted Successfully!')
      setshowNotificationMessage(true)
      setShowMessage(response2.data.message)
      setStatusMessage(response2.data.status)
      data = {
        courseId: courseSelected
      }
      setshowDeleteModule(false)
      commonMethodForApiCall(method, url, data, account)
    } else {
      setShowMessage(response2.data.error)
      setStatusMessage(response2.data.status)
    }
  }
  const handleChange = (event, item) => {
    const moduleDetailsData = modulesData.inputFields.map(itemTemp => {
      if (itemTemp.fieldLabel === item) {
        itemTemp.fieldValue = event.target.value
      }
      return itemTemp
    })
    const deatilsToPass = { module: modulesData.module, inputFields: moduleDetailsData }
    console.log(deatilsToPass, 'deatilsToPass')
    setModulesData(deatilsToPass)
  }
  const toggleDeleteModule = () => {
    setshowDeleteModule(false)
    setInputForModuleDelete('')
    setInputForModuleDeleteReason('');
  }
  const handleAddModuleClick = () => {
    setShowAddModule(true)
  }
  const handleAddCerificateClick = () => {
    setShowAddCertificate(true)
  }
  const toggleModalCertifcate = () => {
    setShowAddModule(false)
    setInputForModel('')
  }
  const toggleCertifcate = () => {
    setShowAddCertificate(false)
    setInputForCertificate('')
  }
  const handleSaveModule = () => {
    dataForModel = {
      "parentId": courseSelected,
      "name": inputForModel,
      "type": "Module"
    }
    setloading(true)
    fetchData(methodForModel, modelUrl, dataForModel, account.token,
      (response) => {
        setloading(true)
        setShowAddModule(false)
        setNotifcationMessage('Module Added Successfully!!!')
        setshowNotificationMessage(true)
        setTimeout(() => {
          setshowNotificationMessage(false)
        }, 2000)
        fetchData(method, url, data, account.token,
          (response) => {
            setloading(true)
            setModulesData(response.result)
            setloading(false)
            setShowAddModule(false)
            setInputForModel('')
          },
          (error) => {
            console.error("Error occurred:", error);
          },
          (error) => {
            console.error("Error occurred:", error);
          }

        );
      })
    setloading(false)
    data = {
      courseId: courseSelected
    }
    commonMethodForApiCall(method, url, data, account)
  }
  const handleBackClickForCertifcate = () => {
    setShowAddCertificate(false)
  }
  const handleSaveCertifcate = () => {
    dataForModel = {
      "parentId": 1,
      "name": inputForCertificate,
      "type": "Certificate"
    }
    setloading(true)
    fetchData(methodForModel, modelUrl, dataForModel, account.token,
      (response) => {
        setloading(true)
        setShowAddCertificate(false)
        setDropdownVal({ label: inputForCertificate, value: inputForCertificate })
        fetchData(methodCertificate, urlCertificate, dataCertificate, account.token,
          (responseData) => {
            console.log("fetch data is", responseData)
            setloading(false);
            // setcertificate(responseData);
            const data = responseData.map((item) => {
              let obj = {};
              obj.label = item.courseName;
              obj.value = item.courseName;
              obj.id = item.courseId;
              return obj
            });
            // console
            //setDropdownVal(data)
            setCoursesForDropdown(data)

            const checkCertificateAdded = responseData.filter((item => item.courseName === inputForCertificate))

            const data2 = {
              courseId: checkCertificateAdded[0].courseId
            }
            commonMethodForApiCall(method, url, data2, account)

          },
          (error) => {
            console.error("Error occurred:", error);
          }
        );
      })
    setloading(false)
  }
  const handleChangeForModelInputDeleteModule = (e) => {
    //console.log(e.target.value, 'wewewvalue--->')
    setInputForModuleDelete(e.target.value)
  }
  const handleChangeForModelInputDeleteModuleReason = (e) => {
    //console.log(e.target.value, 'wewewvalue--->')
    setInputForModuleDeleteReason(e.target.value)
  }

  const handleDeletePopup = () => {
    setshowDeleteModule(true)
    setInputForModuleDelete('')
    setInputForModuleDeleteReason('')
    setShowMessage('')
    setStatusMessage(false)
  }
  const handleBackClick = () => {
    setShowAddModule(false)
  }
  const handleChangeForModelInput = (e) => {
    console.log(e.target.value, 'wewewvalue--->')
    setInputForModel(e.target.value)
  }
  const handleChangeForModelInputCertificate = (e) => {
    console.log(e.target.value, 'wewewvalue--->')
    setInputForCertificate(e.target.value)
  }
  const handleOpeninput = () => {
    inputRef.current.focus()
  }
  const handleDeleteOpeninput = () => {
    deleteInputRef.current.focus()
  }
  const handleDropDownOptions = (item) => {
    if (item.fieldLabel == "difficulty") {
      return (
        <>
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </>
      )
    } else {
      return (
        <>
          <option>0</option>
          <option>1</option>
        </>
      )
    }
  }
  const handleSelectInput = (event, item) => {
    const moduleDetailsData = modulesData.inputFields.map(itemTemp => {
      if (itemTemp.fieldLabel === item) {
        itemTemp.fieldValue = event.target.value
      }
      return itemTemp
    })
    const deatilsToPass = { module: modulesData.module, inputFields: moduleDetailsData }
    console.log(deatilsToPass, 'deatilsToPass')
    setModulesData(deatilsToPass)
  }
  return (
    <>
      <div className="header pb-8 pt-5 d-flex align-items-center">
        <Toaster position="top-right"
          reverseOrder={false} />
        <Container className="mt--10" fluid>
          {showAddModule ? <Modal
            className="modal-dialog-centered divClassNameForModelPlans"
            contentClassName="bg-gradient-white"
            isOpen={showAddModule}
            toggle={() => toggleModalCertifcate()}
            onOpened={handleOpeninput}
          >
            <div className="modal-header">
              <h4 className="heading mt-4"><b>Want to add more modules?</b></h4>
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
                      placeholder="Module Name"
                      required="true"
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
                Close
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
          {showDeleteModule ? <Modal
            className="modal-dialog-centered divClassNameForDeleteCertificate"
            contentClassName="bg-gradient-white"
            isOpen={showDeleteModule}
            toggle={() => toggleDeleteModule()}
            onOpened={handleDeleteOpeninput}
          >
            <div className="modal-header">
              <h4 className="heading mt-4"><b>Want to delete module?</b></h4>
              <button
                aria-label="Close"
                className="close"
                data-dismiss="modal"
                type="button"
                onClick={() => toggleDeleteModule()}
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
                      onChange={(e) => handleChangeForModelInputDeleteModule(e)}
                      name="moduleName"
                      value={inputForModuleForDelete}
                      placeholder="Module Name"
                      innerRef={deleteInputRef}

                    />
                  </div>
                  <div style={{ 'marginTop': '12px', gap: '10px' }}>
                    <span className="categoryCss">Category:</span>
                    <Input
                      type="text"
                      disabled
                      name="moduleName"
                      value="Module"

                    />
                  </div>
                  <div className="divContainerForModuleNameReason">
                    <div className="reasonModuleDelete">Reason For Deletion</div>
                    <Input
                      type="text"
                      onChange={(e) => handleChangeForModelInputDeleteModuleReason(e)}
                      name="moduleName"
                      value={inputForModuleForDeleteReason}
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
                onClick={handleBackClickForModuleDelete}
              >
                Close
              </Button>
              <Button
                className=" text-white bg-gradient-default mb-4"
                type="button"
                disabled={inputForModuleForDelete === ""}
                onClick={() => handleDeleteModule('Certificate Member')}
              >
                Delete
              </Button>

            </div>
          </Modal> : null}
          {showAddCertifcate ? <Modal
            className="modal-dialog-centered divClassNameForModelPlans"
            contentClassName="bg-gradient-white"
            isOpen={showAddCertifcate}
            toggle={() => toggleCertifcate()}
            onOpened={handleOpeninput}

          >
            <div className="modal-header">
              <h4 className="heading mt-4"><b>Want to add more certificate?</b></h4>
              <button
                aria-label="Close"
                className="close"
                data-dismiss="modal"
                type="button"
                onClick={() => toggleCertifcate()}
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
                      onChange={(e) => handleChangeForModelInputCertificate(e)}
                      name="moduleName"         // Update to first_name
                      value={inputForCertificate}
                      placeholder="Certifcate Name"


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
                onClick={handleBackClickForCertifcate}
              >
                Back
              </Button>
              <Button
                className=" text-white bg-gradient-default mb-4"
                type="button"
                onClick={() => handleSaveCertifcate('Certificate Member')}
              >
                Save
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
                {showNotificationMessage === true && errorNotification === false ? <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                  {notificationMessage}
                </Alert> : null}
                {showNotificationMessage === true && errorNotification === true ? <Alert icon={<ClearIcon fontSize="inherit" />} severity="error">
                  {notificationMessage}
                </Alert> : null}
                <Row>

                  <Col className="order-xl-2 mb-5 mb-xl-0" xl="5">
                    <Card className="card-profile shadow ">
                      <div className="conatinerForCardHeader moduleContainer">
                        <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4 textCssForHeaders">
                          Modules
                        </CardHeader>
                        <div className='buttonsContainerAddDelete'>
                          <div className="addText" onClick={() => handleDeletePopup()}>
                            <DeleteOutlineIcon />
                          </div>
                          <div className="addText" onClick={handleAddModuleClick}>
                            <AddIcon />
                          </div>
                        </div>

                      </div>

                      <CardBody>
                        {modulesData && Object.keys(modulesData).length > 0 && modulesData.module.length > 0 ? <Row>
                          {
                            modulesData.module.map(item => {
                              return (
                                <Col lg="12" key={item.ModName}>
                                  <div className='d-flex my-2 cursorCss'>
                                    <div onClick={() => handleModuleClick(item.moduleId)}>
                                      {item.ModName}
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
                  </Col>
                  <Col className="order-xl-1" xl="7">
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

                          {modulesData && Object.keys(modulesData).length > 0 && modulesData.inputFields.length > 0 ? <Row>
                            {
                              modulesData.inputFields.map(item => {
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

                                        {item.componentType !== "dropdown" ? <Input
                                          type={(item.componentType === "text") ? "text" : "textarea"}
                                          onChange={(e) => handleChange(e, item.fieldLabel)}
                                          name={item.fieldLabel}         // Update to first_name
                                          value={item.fieldValue}
                                          placeholder={""}

                                        /> :
                                          <Input
                                            name={item.fieldLabel}
                                            type="select"
                                            value={item.fieldValue}
                                            onChange={(e) => handleSelectInput(e, item.fieldLabel)}
                                          >
                                            {handleDropDownOptions(item)}
                                          </Input>}
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
                  </Col>
                </Row>

              </>
          }
        </Container>
      </div >
    </>
  );
};

export default CeriticateSpecificDetails;
