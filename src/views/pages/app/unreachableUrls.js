import { useRef } from 'react'
import Chart from "chart.js";
import {

    Container,
    Row,
    Col,
} from "reactstrap";
import {
    chartOptions,
    parseOptions,
} from "variables/charts.js";
import { useSelector } from 'react-redux';
import { useEffect, useState } from "react";
import configData from '../../../config';
import { ThreeDots } from 'react-loader-spinner'
import useFetchData from '../component/fetchData';
import { Typography } from '@mui/material';
import { DataGrid, useGridApiRef } from '@mui/x-data-grid';
import { useNavigate } from "react-router-dom"
const UnreachableUrl = () => {
    const gridApiRef = useGridApiRef();
    const navigate = useNavigate();
    const [tableDataRef, settableDataRef] = useState([]);
    const [tableData, settableData] = useState([]);
    const [loading, setloading] = useState(false);
    const account = useSelector((state) => state.account);
    const url = configData.API_SERVER + 'unreachable_urls';
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
    const handleTopicNameClick =(val)=>{
      navigate(`/admin/user-topic-details`, { state: { topicClicked: val.topic_id } })
    }
    const columns = [
        {
            field: 'course_name',
            headerName: 'Course Name',
            width: 350,
        },
        {
            field: 'topic_id',
            headerName: 'Id',
            hide: true,
        },
        { field: 'module_name', headerName: 'Module Name', flex: 1 },
        { field: 'submodule_name', headerName: 'SubModule Name', flex: 1 },
        { field: 'topic_name', headerName: 'Topic Name', flex: 1,renderCell: (params) => (
            <span
              style={{ cursor: 'pointer', color: 'blue' }}
              onClick={() => handleTopicNameClick(params.row)}
            >
              {params.value}
            </span>
          ) },

    ];
    const filteredColumns = columns.filter(col => col.field !== 'topic_id');


    useEffect(() => {
        setloading(true);
        getTableDetails()
    }, [])


    const getTableDetails = async () => {
        setloading(true)
        fetchData(method, url, data, account.token,
            (response) => {
                setloading(false)
                console.log("response data is", response.result)
                settableData(response.return_list)
                settableDataRef(response.return_list)
            },
            (error) => {
                console.error("Error occurred:", error);
            }
        );
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px',marginLeft:'35px' }}>
                        <div className="addDeleteButtonContainer">
                            <Typography
                                variant="h6" 
                                gutterBottom
                                className="text-dark"
                                sx={{
                                    fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1.2rem', lg: '1.5rem' },
                                    fontWeight: 'bold',
                                }}
                            >
                                Unreachable YouTube URLs!
                            </Typography>

                        </div>
                    </div>
                    <Container fluid>
                        {<div style={{ height: 450, width: '100%' }}>
                            <DataGrid
                                apiRef={gridApiRef}
                                rows={tableDataRef}
                                columns={filteredColumns}
                                initialState={{
                                    pagination: {
                                        paginationModel: {
                                            pageSize: 6,
                                        },
                                    },
                                }}
                                pageSizeOptions={[5]}
                                getRowId={(row) => row.topic_id}
                                autoHeight
                            />
                        </div>}
                    </Container>
                </div>
            }
        </>
    );
};

export default UnreachableUrl;