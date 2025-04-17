
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
import axios from 'axios';
import configData from '../../../config';
import { useSelector } from 'react-redux';
import { ThreeDots } from 'react-loader-spinner'
import useFetchData from '../component/fetchData';
import { useNavigate } from "react-router-dom"
import { useLocation } from 'react-router-dom';
import BackButton from './BackButton';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AddIcon from '@mui/icons-material/Add';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
const ModuleDetails = () => {
  const [showMessage, setShowMessage] = useState('')
  const [statusMessage, setStatusMessage] = useState(true)
  const inputRef = useRef(null);
  const deleteInputRef = useRef(null);
  const { fetchData } = useFetchData();
  const account = useSelector((state) => state.account);
  const navigate = useNavigate();
  const modelUrlDelete = configData.API_SERVER + 'deleteCertificate';
  const [enableUpdateButton, setenableUpdateButton] = useState(false);
  const [loading, setloading] = useState(true);
  const [showDeleteSubModule, setshowDeleteSubModule] = useState(false);
  const location = useLocation();
  const [dropdownVal, setDropdownVal] = useState({ label: 'Select Certificate', value: 'Select Certificate' })
  const [inputForSubModuleForDelete, setInputForSubModuleDelete] = useState('')
  const [inputForSubModuleForDeleteReason, setInputForSubModuleDeleteReason] = useState('')
  const [showAddSubModules, setShowAddSubModules] = useState(false);
  const [inputForModel, setInputForModel] = useState('')
  const [notificationMessage, setNotifcationMessage] = useState('')
  const [showNotificationMessage, setshowNotificationMessage] = useState(false)
  const [showAddModule, setShowAddModule] = useState(false);
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  const [errorNotification, setErrorNotification] = useState(false)
  const [subModuleDetails, setSubModuleDetails] = useState({})
  const url = configData.API_SERVER + 'moduleDetails';
  const urlModule = configData.API_SERVER + 'updateModuleDetails';
  const modelUrl = configData.API_SERVER + 'addNewEntry'
  var dataForModel, methodForModel = 'post';
  var data, method = 'post';
  var dataModule, methodModule = 'post';
  data = {
    module_id: location.state.moduleClicked
  }
  const handleModuleClick = (item) => {
    navigate(`/admin/user-sub-modules-details`, { state: { submoduleClicked: item } })
  }
  const handleOpeninput = () => {
    inputRef.current.focus()
  }
  const handleDeleteOpeninput = () => {
    deleteInputRef.current.focus()
  }
  const isNumericOnly=(input)=> input !== null && input !== undefined && /^\d+$/.test(input);

  const handleUpdateButton = () => {
  //  setloading(true)
    subModuleDetails.module_id = location.state.moduleClicked;
    const dataIterate = { ...subModuleDetails };
    delete dataIterate.sub_module
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
      obj.module_id = dataIterate.module_id;
      const keysForData = Object.keys(dataIterate);
      keysForData.forEach(item => {
        if (item === "inputFields") {
          dataIterate[item].map(item => {
            obj[item.fieldLabel] = item.fieldValue
          
          })
        }
      })
      dataModule = obj
      setTimeout(() => {
        fetchData(methodModule, urlModule, dataModule, account.token,
          (response) => {
            setSubModuleDetails({})
            const obj = response.result
            obj.sub_module = subModuleDetails.sub_module
            setSubModuleDetails(obj)
            setNotifcationMessage('Module Details Updated Successfully!!!')
            setshowNotificationMessage(true)
            setTimeout(() => {
              setshowNotificationMessage(false)
            }, 2000)
          },
          (error) => {
            console.error("Error occurred:", error);
          }

        )
        setloading(false)
          ;
      }
        , 2000)
    }


  }
  useEffect(() => {
    fetchData(method, url, data, account.token,
      (response) => {
        setloading(false)
        setSubModuleDetails(response.result)
      },
      (error) => {
        console.error("Error occurred:", error);
      }

    );
  }, []);

  const handleChange = (event, item) => {
    const moduleDetailsData = subModuleDetails.inputFields.map(itemTemp => {
      if (itemTemp.fieldLabel === item) {
        itemTemp.fieldValue = event.target.value
      }
      return itemTemp
    })
    const deatilsToPass = { sub_module: subModuleDetails.sub_module, inputFields: moduleDetailsData }
    setSubModuleDetails(deatilsToPass)
  }
  const handleAddModuleClick = () => {
    setShowAddSubModules(true)
  }
  const toggleModalCertifcate = () => {
    setShowAddSubModules(false)
  }
  const commonMethodForApiCall = (method, url, data, account) => {
    fetchData(method, url, data, account.token,
      (response) => {
        setloading(true)
        console.log(response, 'eere--->')
        setSubModuleDetails(response.result)
        setloading(false)
      },
      (error) => {
        console.error("Error occurred:", error);
      }

    );
  }
  const handleSaveModule = () => {
    dataForModel = {
      "parentId": location.state.moduleClicked,
      "name": inputForModel,
      "type": "SubModule",
      "reason": inputForSubModuleForDeleteReason
    }
    setloading(true)
    setTimeout(() => {
      fetchData(methodForModel, modelUrl, dataForModel, account.token,
        (response) => {
          setloading(true)
          setShowAddSubModules(false)
          fetchData(method, url, data, account.token,
            (response) => {
              setloading(true)
              setSubModuleDetails(response.result)
              setloading(false)
              setInputForModel('')
              setNotifcationMessage('Sub Module Added Successfully!!!')
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
    }, 1000)

  }
  const handleBackClick = () => {
    setShowAddSubModules(false)
  }
  const handleChangeForModelInput = (e) => {
    setInputForModel(e.target.value)
  }
  const handleBackClickForSubModuleDelete = () => {
    setshowDeleteSubModule(false)
  }
  const toggleDeleteSubModule = () => {
    setshowDeleteSubModule(false)
    setInputForSubModuleDelete('')
    setInputForSubModuleDeleteReason('');
    setShowMessage('')
    setStatusMessage(false)
  }
  const handleChangeForModelInputDeleteSubModule = (e) => {
    // console.log(e.target.value, 'wewewvalue--->')
    setInputForSubModuleDelete(e.target.value)
  }
  const handleChangeForModelInputDeleteSubModuleReason = (e) => {
    // console.log(e.target.value, 'wewewvalue--->')
    setInputForSubModuleDeleteReason(e.target.value)
  }

  const handleDeletePopup = () => {
    setshowDeleteSubModule(true)
    setInputForSubModuleDelete('')
    setShowMessage('')
    setStatusMessage(false)
  }
  const handleDeleteSubModule = async () => {
    let dataForModelDelete = {
      "name": inputForSubModuleForDelete,
      "type": 'sub_module',
      "parent_id": location.state.moduleClicked,
      "reason": inputForSubModuleForDeleteReason,
    }
    //setloading(true)
    const response2 = await axios.delete(modelUrlDelete, { data: dataForModelDelete, headers: { 'Authorization': 'Bearer ' + account.token } })
    if (response2.data.status) {
      setShowMessage(response2.data.message)
      setStatusMessage(response2.data.status)
      setshowDeleteSubModule(false)
      setNotifcationMessage('Sub Module Deleted Successfully!!!')
      setshowNotificationMessage(true)
      commonMethodForApiCall(method, url, data, account)
    } else {
      setShowMessage(response2.data.error)
      setStatusMessage(response2.data.status)
    }
    // setloading(false)
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
          {showAddSubModules ? <Modal
            className="modal-dialog-centered divClassNameForModelPlans"
            contentClassName="bg-gradient-white"
            isOpen={showAddSubModules}
            toggle={() => toggleModalCertifcate()}
            onOpened={handleOpeninput}
          >
            <div className="modal-header">
              <h4 className="heading mt-4"><b>Want to add more sub modules?</b></h4>
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
                      placeholder="Sub Module Name"
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
          {showDeleteSubModule ? <Modal
            className="modal-dialog-centered divClassNameForDeleteCertificate"
            contentClassName="bg-gradient-white"
            isOpen={showDeleteSubModule}
            toggle={() => toggleDeleteSubModule()}
            onOpened={handleDeleteOpeninput}
          >
            <div className="modal-header">
              <h4 className="heading mt-4"><b>Want to delete sub module?</b></h4>
              <button
                aria-label="Close"
                className="close"
                data-dismiss="modal"
                type="button"
                onClick={() => toggleDeleteSubModule()}
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
                      onChange={(e) => handleChangeForModelInputDeleteSubModule(e)}
                      name="moduleName"
                      value={inputForSubModuleForDelete}
                      placeholder="SubModule Name"
                      innerRef={deleteInputRef}

                    />
                  </div>
                  <div style={{ 'marginTop': '12px', gap: '10px' }}>
                    <span className="categoryCss">Category:</span>
                    <Input
                      type="text"
                      disabled
                      name="moduleName"
                      value="Sub Module"

                    />
                  </div>
                  <div className="divContainerForModuleNameReason">
                    <div className="reasonModuleDelete">Reason For Deletion</div>
                    <Input
                      type="text"
                      onChange={(e) => handleChangeForModelInputDeleteSubModuleReason(e)}
                      name="moduleName"
                      value={inputForSubModuleForDeleteReason}
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
                onClick={handleBackClickForSubModuleDelete}
              >
                Close
              </Button>
              <Button
                className=" text-white bg-gradient-default mb-4"
                type="button"
                disabled={inputForSubModuleForDelete === ""}
                onClick={() => handleDeleteSubModule('Certificate Member')}
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
                          Sub Modules
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
                        {subModuleDetails && Object.keys(subModuleDetails).length > 0 && subModuleDetails.sub_module.length > 0 ? <Row>
                          {
                            subModuleDetails.sub_module.map(item => {
                              return (
                                <Col lg="12" key={item.subModName}>
                                  <div className='d-flex my-2 cursorCss'>
                                    <div onClick={() => handleModuleClick(item.subModuleId)}>
                                      {item.subModName}
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

                          {subModuleDetails && Object.keys(subModuleDetails).length > 0 && subModuleDetails.inputFields.length > 0 ? <Row>
                            {
                              subModuleDetails.inputFields.map(item => {
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

export default ModuleDetails;
