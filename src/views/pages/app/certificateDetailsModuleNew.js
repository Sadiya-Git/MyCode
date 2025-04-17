import {useRef} from 'react'
import Chart from "chart.js";
import CheckIcon from '@mui/icons-material/Check';
import {
  Card,
  CardHeader,
  Table,
  Container,
  Row,
  Col,
  Button,
  Modal,
  Input,
} from "reactstrap";
import {
  chartOptions,
  parseOptions,
} from "variables/charts.js";
import Select from 'react-select'
import axios from 'axios';
import { useSelector } from 'react-redux';
import { MuiThemeProvider, createTheme } from '@material-ui/core/styles';
import { useEffect, useState } from "react";
import configData from '../../../config';
import { ThreeDots } from 'react-loader-spinner'
import useFetchData from '../component/fetchData';
import { useNavigate } from "react-router-dom"
import toast from 'react-hot-toast';
import { DataGrid, useGridApiRef} from '@mui/x-data-grid';
import Alert from '@mui/material/Alert';
const CertificateDetailsModule = () => {
  const gridApiRef = useGridApiRef(); 
  const [showMessage, setShowMessage] = useState('')
  const [statusMessage, setStatusMessage] = useState(true)
  const itemsPerPage = 9;
  const dropdownDeleteMap = {
    'Sub Domain': 'sub_domain',
    'Module': 'module',
    'Sub Module': 'sub_module',
    'Topic': 'topic'

  }
  const inputRef = useRef(null);
  const deleteInputRef = useRef(null);
  const [dropDownCategory, setDropDownForCategory] = useState([])
  const [dropDownDeleteCategory, setDropDownForDeleteCategory] = useState([{ label: 'Sub Domain', value: 'Sub Domain' }, { label: 'Module', value: 'Module' }, { label: 'Sub Module', value: 'Sub Module' }, { label: 'Topic', value: 'Topic' }])
  const [categoryDropDownVal, setCategoryDropdownVal] = useState('')
  const [categoryDeleteDropDownVal, setCategoryDeleteDropdownVal] = useState('')
  const [noOfPages, setnoOfPages] = useState('');
  const [tableData, settableData] = useState([]);
  const [tableDataRef, settableDataRef] = useState([]);
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();
  const account = useSelector((state) => state.account);
  const url = configData.API_SERVER + 'certificateDetails';
  const [showAddCertifcate, setShowAddCertificate] = useState(false);
  const [showDeleteCertificate, setshowDeleteCertificate] = useState(false);
  const [inputForCertificate, setInputForCertificate] = useState('')
  const [inputForCertificateForDelete, setInputForCertificateDelete] = useState('')
  const [inputForCertificateForDeleteReason, setInputForCertificateDeleteReason] = useState('')
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(0);
  const [dropdownVal, setDropdownVal] = useState({ label: 'Select Certificate', value: 'Select Certificate' })
  const dataCertificate = { "domainId": 1, "active": null }, methodCertificate = 'post';
  const urlCertificate = configData.API_SERVER + 'getSubDomain';
  const [coursesForDropdown, setCoursesForDropdown] = useState([])
  const [modulesData, setModulesData] = useState({})
  const notify = () => toast.error("Something went wrong...!");
  const [notificationMessage, setNotifcationMessage] = useState('')
  const [showNotificationMessage, setshowNotificationMessage] = useState(false)
  const modelUrl = configData.API_SERVER + 'addNewEntry';
  const methodForModelDelete = 'delete';
  const modelUrlDelete = configData.API_SERVER + 'deleteCertificate';
  var dataForModel, methodForModel = 'post';
  const data = {
    domainId: 1
  }, method = 'post';

  let header = {
    headers: { 'Authorization': "Bearer " + account.token }
  };
  const { fetchData } = useFetchData();
  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }

  const handleOpeninput=()=>{
    inputRef.current.focus()
  }
  const handleDeleteOpeninput=()=>{
    deleteInputRef.current.focus()
  }
  const columns = [
    {
      field: 'Certificate_Name',
      headerName: 'Certificate Name',
      width: 500,
      renderCell: (params) => (
        <span
          style={{ cursor: 'pointer', color: 'blue' }}
          onClick={() => handleCertificateClick(params.row.certificate_Id)}
        >
          {params.value}
        </span>
      ),
    },
    { field: 'No_of_Modules', headerName: 'Modules', flex: 1 },
    { field: 'No_of_Sub_Modules', headerName: 'SubModules', flex: 1 },
    { field: 'No_of_Topic', headerName: 'Topics', flex: 1 },
    { field: 'Questions', headerName: 'Questions', flex: 1 },
    { field: 'Active', headerName: 'Active', flex: 1 },
    { field: 'Published', headerName: 'Published', flex: 1 },
  ];

  const handleCertificateClick = (certificateId) => {
    navigate(`/admin/user-certificate-details`, { state: { certificateClicked: certificateId } });
  };
  const getCategoryDropDownDetails = async () => {
    const urlDropdown = configData.API_SERVER + 'subDomainCategory';
    try {
      const response = await axios.get(urlDropdown, header);
      const dropdownDataResponse = response.data.result.map(item => {
        let obj = {};
        obj.label = item;
        obj.value = item;
        return obj
      });
      setDropDownForCategory(dropdownDataResponse)
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setloading(false);
    }
  }
  const handleSelect = (e) => {
    const filteredResponse = []
    tableData.forEach(item => {

      if (item.Category.includes(e.value)) {
        filteredResponse.push(item)
      }
    })

    setCategoryDropdownVal({ label: e.value, value: e.value })
    settableDataRef(filteredResponse);
  }
  const handleDeleteSelect = (e) => {
    setCategoryDeleteDropdownVal({ label: e.value, value: e.value })
  }
  const toggleCertifcate = () => {
    setShowAddCertificate(false)
    setInputForCertificate('')
  }
  const toggleDeleteCertifcate = () => {
    setshowDeleteCertificate(false)
    setInputForCertificateDelete('')
    setInputForCertificateDeleteReason('');
    setCategoryDeleteDropdownVal('')
    setShowMessage('')
    setStatusMessage(false)
  }

  useEffect(() => {
    setloading(true);
    getTableDetails()
    getCategoryDropDownDetails()
  }, [])
  const handleAddCerificateClick = () => {
    setShowAddCertificate(true)
  }
  const handleDeletePopup = () => {
    setshowDeleteCertificate(true)
    setInputForCertificateDelete('')
    setCategoryDeleteDropdownVal('')
    setInputForCertificateDeleteReason('')
    setShowMessage('')
    setStatusMessage(false)
  }
  const handleReset = () => {
    if (gridApiRef.current) {
      gridApiRef.current.setFilterModel({ items: [] });
    }
    setCategoryDropdownVal({ label: 'Select Certificate', value: 'Select Certificate' });
    settableDataRef(tableData);
  };

  const getTableDetails = async () => {
    setloading(true)
    fetchData(method, url, data, account.token,
      (response) => {
        setloading(false)
        console.log("response data is", response.result)
        settableData(response.result)
        settableDataRef(response.result)
        setshowNotificationMessage(false)
       
      },
      (error) => {
        console.error("Error occurred:", error);
      }
    );
  }
  const handleChangeForModelInputCertificate = (e) => {
    //console.log(e.target.value, 'wewewvalue--->')
    setInputForCertificate(e.target.value)
  }
  const handleChangeForModelInputDeleteCertificate = (e) => {
    //console.log(e.target.value, 'wewewvalue--->')
    setInputForCertificateDelete(e.target.value)
  }
  const handleChangeForModelInputDeleteCertificateReason = (e) => {
    //console.log(e.target.value, 'wewewvalue--->')
    setInputForCertificateDeleteReason(e.target.value)
  }
  const handleBackClickForCertifcate = () => {
    setShowAddCertificate(false)
  }
  const handleBackClickForCertifcateDelete = () => {
    setshowDeleteCertificate(false)
    setInputForCertificateDelete('')
    setInputForCertificateDeleteReason('');
    setCategoryDeleteDropdownVal('')
    setShowMessage('')
    setStatusMessage(false)
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
            setCoursesForDropdown(data)

            const checkCertificateAdded = responseData.filter((item => item.courseName === inputForCertificate))
            setNotifcationMessage('Certificate added Successfully!')
            
            setshowNotificationMessage(true)
            const data2 = {
              courseId: checkCertificateAdded[0].courseId
            }
            commonMethodForApiCall(method, url, data2, account)
            getTableDetails()
           
          },
          (error) => {
            console.error("Error occurred:", error);
          }
        );
        navigate(`/admin/user-certificate-details`, { state: { certificateClicked: response.id } });
      })
    setloading(false)
  }
  const handleDeleteCertifcate = async () => {
    let dataForModelDelete = {

      "name": inputForCertificateForDelete,
      "type": "sub_domain",
      "reason": inputForCertificateForDeleteReason
    }
    //setloading(true)
    const response2 = await axios.delete(modelUrlDelete, { data: dataForModelDelete, headers: { 'Authorization': 'Bearer ' + account.token } })
    if(response2.data.status){
      setShowMessage(response2.data.message)
      setStatusMessage(response2.data.status) 
      setshowDeleteCertificate(false) 
      setNotifcationMessage('Certificate deleted Successfully!')
      setshowNotificationMessage(true)
    }else{
      setShowMessage(response2.data.error)
      setStatusMessage(response2.data.status)
    }
    getTableDetails()
    //setloading(false)
  }
  const commonMethodForApiCall = (method, url, data, account) => {
    setInputForCertificate('')
    fetchData(method, url, data, account.token,
      (response) => {
        setloading(true)
        console.log(response, 'eere--->')
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
  const handleUnreachableUrl=()=>{
    navigate('/admin/unreachable-urls')
  }
  return (
    <>
      {loading ? <div
        className="header pb-8 pt-5 pt-lg-6 d-flex align-items-center"

      >
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

          {/* <Loader type="Circles" color="Red" height={180} width={180} /> */}
        </Container>
      </div> :
        <div className="header  pb-6 pt-5 pt-md-6">
          <Container fluid>
          {showNotificationMessage === true ? <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                  {notificationMessage}
                </Alert> : null}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div className="addDeleteButtonContainer">
                <Button
                  className="text-white bg-gradient-default"
                  onClick={() => handleAddCerificateClick()}
                >
                  Add Certificate
                </Button>
                <Button
                  className="text-white bg-gradient-default"
                  onClick={() => handleDeletePopup()}
                >
                  Delete Certifcate
                </Button>
                <Button
                  className="text-white bg-gradient-default"
                  onClick={() => handleUnreachableUrl()}
                >
                  Unreachable Url 
                </Button>
              </div>


              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="categoryCss">Category:</span>
                <Select
                  options={dropDownCategory}
                  onChange={(e) => handleSelect(e)}
                  value={categoryDropDownVal}
                  styles={{
                    container: (base) => ({
                      ...base,
                      minWidth: '200px',
                    }),
                    control: (base) => ({
                      ...base,
                      borderColor: 'lightgray',
                      '&:hover': { borderColor: 'gray' },
                    }),
                  }} />
              </div>

              <Button
                className="text-white bg-gradient-default"
                onClick={handleReset}
              >
                Reset Filters
              </Button>

            </div>

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
                        name="moduleName"
                        value={inputForCertificate}
                        placeholder="Certifcate Name"
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
                  onClick={handleBackClickForCertifcate}
                >
                  Back
                </Button>
                <Button
                  className=" text-white bg-gradient-default mb-4"
                  type="button"
                  onClick={() => handleSaveCertifcate('Certificate Member')}
                 disabled={!inputForCertificate.trim()}
                >
                  Save
                </Button>

              </div>
            </Modal> : null}
            {showDeleteCertificate ? <Modal
              className="modal-dialog-centered divClassNameForDeleteCertificate"
              contentClassName="bg-gradient-white"
              isOpen={showDeleteCertificate}
              toggle={() => toggleDeleteCertifcate()}
              onOpened={handleDeleteOpeninput}
            >
              <div className="modal-header">
                <h4 className="heading mt-4"><b>Want to delete certificate?</b></h4>
                <button
                  aria-label="Close"
                  className="close"
                  data-dismiss="modal"
                  type="button"
                  onClick={() => toggleDeleteCertifcate()}
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
                        onChange={(e) => handleChangeForModelInputDeleteCertificate(e)}
                        name="moduleName"
                        value={inputForCertificateForDelete}
                        placeholder="Certifcate Name"
                        innerRef={deleteInputRef}

                      />
                    </div>
                    <div style={{ 'marginTop': '12px', gap: '10px' }}>
                      <span className="categoryCss">Category:</span>
                      <Input
                        type="text"
                        disabled
                        name="moduleName"
                        value="Sub Domain"

                      />
                    </div>
                    <div className="divContainerForModuleNameReason">
                      <div className="reasonModuleDelete">Reason For Deletion</div>
                      <Input
                        type="text"
                        onChange={(e) => handleChangeForModelInputDeleteCertificateReason(e)}
                        name="moduleName"
                        value={inputForCertificateForDeleteReason}
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
                  onClick={handleBackClickForCertifcateDelete}
                >
                  Close
                </Button>
                <Button
                  className=" text-white bg-gradient-default mb-4"
                  type="button"
                  disabled={inputForCertificateForDelete === ""}
                  onClick={() => handleDeleteCertifcate('Certificate Member')}
                >
                  Delete
                </Button>

              </div>
            </Modal> : null}

            {<div style={{ height: 450, width: '100%' }}>
              <DataGrid
                apiRef={gridApiRef} 
                rows={tableDataRef}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 6,
                    },
                  },
                }}
                pageSizeOptions={[5]}
                getRowId={(row) => row.certificate_Id}
                autoHeight
              />
            </div>}
          </Container>
        </div>
      }
    </>
  );
};

export default CertificateDetailsModule;
