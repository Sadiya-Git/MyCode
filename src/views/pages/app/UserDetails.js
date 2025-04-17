import React, { useEffect, useState, useRef } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  CardTitle,
  CardText
} from 'reactstrap';
import { DataGrid } from '@mui/x-data-grid';
import { ThreeDots } from 'react-loader-spinner';
import axios from 'axios';
import { useSelector } from 'react-redux';
import configData from '../../../config';

const UserDetails = () => {
  const itemsPerPage = 6;
  const [tableData, setTableData] = useState([]);
  const [currentMonthUserCount, setCurrentMonthUserCount] = useState('');
  const [currentWeekUserCount, setCurrentWeekUserCount] = useState('');
  const [totalUserCount, setTotalUserCount] = useState('');
  const [loading, setLoading] = useState(true);
  const account = useSelector((state) => state.account);

  const columns = [
    { field: 'firstName', headerName: 'First Name', flex: 1 },
    { field: 'lastName', headerName: 'Last Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'joiningDate', headerName: 'Onboarding Date', flex: 1 },
  ];

  const fetchData = async () => {
    const header = {
      headers: { 'Authorization': `Bearer ${account.token}` },
    };
    try {
      const response = await axios.get(`${configData.API_SERVER}getUserList`, header);
      const tableDataResponse = response.data.response.user
      .map((item) => ({
        id: item.user_name, 
        firstName: item.first_name || '',
        lastName: item.last_name || '',
        email: item.email || '',
        joiningDate: item.joining_date.split(' ')[0], 
      }))
      .sort((a, b) => new Date(b.joiningDate) - new Date(a.joiningDate)); 
    
      setTableData(tableDataResponse);
      setCurrentMonthUserCount(response.data.response.thisMonthCount);
      setCurrentWeekUserCount(response.data.response.thisWeekCount);
      setTotalUserCount(response.data.response.total_user_count);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [account.token]);

  return (
    <Container fluid>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40vh' }}>
          <ThreeDots
            visible={true}
            height="80"
            width="80"
            color="#172b4d"
            ariaLabel="three-dots-loading"
          />
        </div>
      ) : (
        <>
          <Row style={{marginTop: '20px'}}>
            <Col >
              <Card
                body
                className="my-2"
                style={{ width: '18rem', height: '10rem', textAlign: 'center', borderColor: '#ccc' }}
              >
                <CardTitle tag="h5" style={{ fontSize: '15px', fontWeight: '600' }}>
                  Total User Count
                </CardTitle>
                <CardText style={{ color: '#5e72e4', fontSize: '24px', fontWeight: '700' }}>
                  {totalUserCount}
                </CardText>
              </Card>
            </Col>
            <Col>
              <Card
                body
                className="my-2"
                style={{ width: '18rem', height: '10rem', textAlign: 'center', borderColor: '#ccc' }}
              >
                <CardTitle tag="h5" style={{ fontSize: '15px', fontWeight: '600' }}>
                  Current Week User Count
                </CardTitle>
                <CardText style={{ color: '#5e72e4', fontSize: '24px', fontWeight: '700' }}>
                  {currentWeekUserCount}
                </CardText>
              </Card>
            </Col>
            <Col>
              <Card
                body
                className="my-2"
                style={{ width: '18rem', height: '10rem', textAlign: 'center', borderColor: '#ccc' }}
              >
                <CardTitle tag="h5" style={{ fontSize: '15px', fontWeight: '600' }}>
                  Current Month User Count
                </CardTitle>
                <CardText style={{ color: '#5e72e4', fontSize: '24px', fontWeight: '700' }}>
                  {currentMonthUserCount}
                </CardText>
              </Card>
            </Col>
          </Row>
          <div style={{ height: 400, marginTop: '20px' }}>
            {/* <DataGrid
              rows={tableData}
              columns={columns}
              pageSize={itemsPerPage}
              rowsPerPageOptions={[5, 10, 15]}
              autoHeight
            /> */}
             <DataGrid
                rows={tableData}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 6,
                    },
                  },
                }}
                pageSizeOptions={[5]}
                getRowId={(row) => row.email}
                autoHeight
              />
          </div>
        </>
      )}
    </Container>
  );
};

export default UserDetails;
