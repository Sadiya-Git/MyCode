import Chart from "chart.js";
import {
  Card,
  CardHeader,
  Progress,
  Table,
  Container,
  Row,
  Col,
  Media,
} from "reactstrap";
import {
  chartOptions,
  parseOptions,
} from "variables/charts.js";
import { useSelector } from 'react-redux';
import Pagination from 'react-mui-pagination';
import { MuiThemeProvider, createTheme } from '@material-ui/core/styles';
import { useEffect, useState } from "react";
import configData from '../../../config';
import { ThreeDots } from 'react-loader-spinner'
import useFetchData from '../component/fetchData';
import FilterComponent from './filterComponent'
import Fab from '@material-ui/core/Fab';
import { Autocomplete, TextField } from '@mui/material';
import { DataGrid, useGridApiRef} from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
const theme = createTheme({
  palette: {
    primary: {
      main: '#32325D'
    }
  }
});
const Index = (props) => {
  const itemsPerPage = 9;
  const gridApiRef = useGridApiRef(); 
  const columns = [
    {
      field: 'courseName',
      headerName: 'Skill',
      width: 500,
      renderCell: (params) => (
        <span
          style={{ color: 'blue' }}
        >
          {params.value}
        </span>
      ),
    },
    { field: 'user_score', headerName: 'Score', flex: 1 },
    { field: 'quiz_type', headerName: 'Quiz Type', flex: 1 },
    { field: 'percentage', headerName: 'Percentage', flex: 1 },
    { field: 'date_of_enrollment', headerName: 'Enrollment Date', flex: 1 },
  ];
  const [page, setPage] = useState(1);
  const [noOfPages, setnoOfPages] = useState('');
  const [tableData, settableData] = useState([]);
  const [uniqueSubjects, setUniqueSubjects] = useState([])
  const [tableDataRef, settableDataRef] = useState([]);
  const [loading, setloading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const account = useSelector((state) => state.account);
  const url = configData.API_SERVER + 'getUserScores';
  const data = {
    courseId:"",
    startDate:"",
    endDate:"",
    coursePercentage:"0"
  }, method = 'post';
  const { fetchData } = useFetchData();
  const [filterToggle, setFilterToggle] = useState(false)
  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }
  const applyFilterChange=(paramObj)=>{
    if (gridApiRef.current) {
      gridApiRef.current.setFilterModel({ items: [] });
    }
    fetchData(method, url, paramObj, account.token,
      (response) => {
        setloading(false)
        console.log(response,'ererer')
        settableData(response.scores);
      },
      (error) => {
        console.error("Error occurred:", error);
      }
    );
  }
  const handleChange = (event, value) => {
    setPage(value);
  };
  useEffect(() => {
    fetchData(method, url, data, account.token,
      (response) => {
        setloading(false)
        console.log(response,'ererer')
        const sortedData = response.scores.sort((a, b) => new Date(b.date_of_enrollment) - new Date(a.date_of_enrollment));
        console.log(sortedData,'ererersortedData')
     
        const dataForGridTable=sortedData.map((item,index)=>{
          let obj={}
          obj.quiz_type=item.quiz_type;
          obj.user_score = `${item.user_score}/${item.total_score}`;
          obj.date_of_enrollment =item.date_of_enrollment;
          obj.percentage =""+item.percentage;
          obj.courseName = item.courseName;
          obj.course_id= index;
          return obj
        })
        console.log(dataForGridTable,'dataForGridTable')
        const coursesAvailable = sortedData.map(item => item.courseName)
        const uniqueCourses = [...new Set(coursesAvailable)]
        const uniqueCoursesOption = uniqueCourses.map(item => {
          const obj = {}
          obj.value = item;
          obj.label = item;
          return obj
        })
        setUniqueSubjects(uniqueCoursesOption)
        settableDataRef(dataForGridTable);
        settableData(dataForGridTable);
      },
      (error) => {
        console.error("Error occurred:", error);
      }
    );
    // handleDynamicContent()
  }, [account.token])

  // const handleFilterClick=()=>{
  //   setFilterToggle(!filterToggle)
  // }
const handleSearchChange=()=>{

}
console.log(tableDataRef,'tableDataRef-->')
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
          {/* Page content */}
          <Container fluid>
            {/* <Row>
         
          </Row> */}
            <br />
            <Row>
            <Col className="mb-12 mb-xl-0" xl="12">
              <div className="filterWrapper">
                <FilterComponent dataForTable={tableDataRef} handleApply={applyFilterChange}/>
              </div>
              </Col>
              <Row className="search-container">
                <div className="search-container-item">
                <Autocomplete
                   freeSolo
                   options={uniqueSubjects.map((option) => option.label)}
                   value={searchTerm}
                   onChange={handleSearchChange}
                   renderInput={(params) => (
                     <TextField
                       {...params}
                       variant="outlined"
                       fullWidth
                       placeholder="Search for skills..."
                       InputProps={{
                         ...params.InputProps,
                         startAdornment: <SearchIcon style={{ marginRight: 8 }} />,
                         sx: {
                           borderRadius: '50px',
                           padding: '6px 16px',
                           backgroundColor: '#fff',
                         },
                       }}
                     />
                   )}
                 />
                </div>
               

             </Row>
              </Row> 
          
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
                getRowId={(row) => row.course_id}
                autoHeight
              />
            </div>}
          </Container>
        </div>
      }
    </>
  );
};

export default Index;
