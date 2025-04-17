import React, { useState, useEffect } from 'react';
import './certificate.css';
import { Container, Row, Col, Table } from 'reactstrap';
import configData from '../../../config';
import useFetchData from '../component/fetchData';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import Loader from 'react-spinner-loader';
import toast, { Toaster } from 'react-hot-toast';

function CertificateDetail() {
  const url = configData.API_SERVER + 'certificateDetail';
  const { fetchData } = useFetchData();
  const account = useSelector((state) => state.account);
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [modulesData, setModulesData] = useState({});
  const courseName = location.state.certificateName;

  useEffect(() => {
    const data = {
      courseId: location.state.courseId
    };
    commonMethodForApiCall('post', url, data, account);
  }, [location.state.courseId, url, account]);

  const commonMethodForApiCall = (method, url, data, account) => {
    fetchData(method, url, data, account.token,
      (response) => {
        setLoading(false)
        setModulesData(response.result);
      },
      (error) => {
        notify();
        console.error("Error occurred:", error);
      }
    );
  };
  const notify = () => toast.error("Something went wrong...!");

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const excludedLabels = ['whatNeedToKnow', 'icon', 'price', 'reference_video', 'img', 'active', 'reference_link', 'examProvider','published'];

  const examInformation = (
    <>
      {modulesData && Object.keys(modulesData).length > 0 && modulesData.inputFields && modulesData.inputFields.length > 0 ? (
        <Table className="custom-table" striped>
          <thead>
            <tr style={{ fontSize: '20px' }}>
              <th>Exam Component</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {modulesData.inputFields.filter(item => !excludedLabels.includes(item.fieldLabel)).map((item) => (
              <tr key={item.fieldLabel}>
                <td>{capitalizeFirstLetter(item.fieldLabel)}</td>
                <td>{item.fieldValue}</td>
              </tr>
            ))}
            {modulesData.module && modulesData.module.length > 0 && (
              <tr>
                <td>Module Name</td>
                <td>
                  <ul>
                    {modulesData.module.map((module) => (
                      <li key={module.moduleId}>{module.ModName}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      ) : (
        <Loader show={loading} type="box" spinnerStyle={{
          primary: '#46B597',
          secondary: '#2D866D'
        }} />
      )}
    </>
  );

  return (
    <div className="d-flex">
      <div className="content p-4 flex-grow-1">
        <Container fluid>
          <header className="mb-4">
            <h1>{courseName}</h1>
          </header>
          {examInformation}
        </Container>
      </div>
    </div>
  );
}

export default CertificateDetail;
