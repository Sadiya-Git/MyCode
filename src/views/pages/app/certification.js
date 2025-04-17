import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { Card, CardContent, Typography, Chip, Stack, Autocomplete, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { useNavigate } from "react-router-dom";
import useFetchData from '../component/fetchData';
import configData from '../../../config';
import { useDispatch, useSelector } from 'react-redux';
import { SET_DOMAIN_CERTIFICATES } from '../../../store/actions';
import { ThreeDots } from 'react-loader-spinner';
import { makeStyles } from '@material-ui/core/styles';
import SchoolIcon from '@mui/icons-material/School';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const useStyles = makeStyles((theme) => ({
  chipsContainer: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'flex-start',
    },
  },
  languagesChip: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '10px',
  },
  langChip: {
    backgroundColor: '#172b4d !important',
    color: '#f0f0f0',
    borderRadius: '16px',
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: '#172b4d !important',
      color: '#f0f0f0',
    },
  },
  chipRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  },
}))
const CertificationPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCertificates, setFilteredCertificates] = useState([]);
  const [certificate, setCertificate] = useState([]);
  const [difficulty, setDifficulty] = useState('');
  const [category, setCategory] = useState('');
  const [visibleCertificates, setVisibleCertificates] = useState(8);
  const [subDomainCategories, setSubDomainCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const account = useSelector((state) => state.account);
  const isAdmin = useSelector((state) => state.account.isAdmin);
  const navigate = useNavigate();
  const { fetchData } = useFetchData();
  const dispatcher = useDispatch();
  const url = configData.API_SERVER + 'getSubDomain';
  const urlcat = configData.API_SERVER + 'subDomainCategory';
  const methodcat = 'get';
  const data = isAdmin ? { "domainId": 1, "active": 1 } : { "domainId": 1, "active": 1, "publish": 1 };
  const method = 'post';
  const [bookmarkedItems, setBookmarkedItems] = useState([]);

  // const handleBookmarkToggle = (id) => {
  //   setBookmarkedItems((prev) =>
  //     prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
  //   );
  // };
  const handleBookmarkToggle = (id) => {
    setBookmarkedItems((prev) => {
      const isBookmarked = prev.includes(id);

      // Trigger Toast Message
      if (!isBookmarked) {
        toast.success("Saved to Learning Track!", {
          position: "top-right",
          autoClose: 2000,
        });
      }

      // Toggle Bookmark State
      return isBookmarked
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id];
    });
  };
  const classes = useStyles();

  useEffect(() => {
    fetchData(method, url, data, account.token, (response) => {
      setLoading(false);
      setCertificate(response);
      dispatcher({ type: SET_DOMAIN_CERTIFICATES, payload: { response } });
      setFilteredCertificates(response);
      // filteredCertificates(response)
    }, (error) => console.error("Error occurred:", error));

    fetchData(methodcat, urlcat, data, account.token,
      (response) => setSubDomainCategories(response.result),
      (error) => console.error("Error occurred:", error)
    );
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 200 && !isLoadingMore) {
        setIsLoadingMore(true);
        setTimeout(() => {
          setVisibleCertificates((prev) => prev + 8);
          setIsLoadingMore(false);
        }, 500);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoadingMore]);

  useEffect(() => {
    const filteredList = certificate.filter(cert =>
      (!difficulty || cert.difficulty === difficulty) &&
      (!category || cert.category.split(',').map(c => c.trim()).includes(category)) &&
      (cert.courseName.toLowerCase().includes((searchTerm || '').toLowerCase()))
    );

    setFilteredCertificates(filteredList.slice(0, visibleCertificates));
  }, [difficulty, category, searchTerm, visibleCertificates, certificate]);

  const handleFilterChange = (setter) => (event, newValue) => {
    setter(newValue);
    setVisibleCertificates(8);
  };

  const handleButtonClick = (buttonType, courseId, courseName) => {
    console.log("id from certificate is",courseId)
    const path = buttonType === "Mock" || buttonType === "Practice"
      ? `/admin/certifications/details`
      : `/admin/learning/details`;
    navigate(path, { state: { id: courseId, type: buttonType, coursename: courseName } });
  };

  const handleSearchChange = (event, value) => {
    setSearchTerm(value);
  };

  const roundedDropdownStyle = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '50px',
      padding: '8px 12px',
      backgroundColor: '#fff',
      '& fieldset': {
        borderColor: '#ddd',
      },
      '&:hover fieldset': {
        borderColor: '#888',
      },
    },
  };

  return (
    <>
      {loading ? (
        <div className="header pb-8 pt-5 pt-lg-6 d-flex align-items-center">
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
          </Container>
        </div>
      ) : (
        <div className="certification-page pt-5">
          <Container fluid>
            <ToastContainer />
            <Row className="text-center">
              <Col xs="12">
                <Typography
                  variant="h6"
                  gutterBottom
                  className="text-dark"
                  sx={{
                    fontSize: { xs: '1.5rem', sm: '1rem', md: '2rem', lg: '2em' },
                    fontWeight: 'bold',
                  }}
                >
                  Start your journey toward mastery!
                </Typography>
              </Col>
            </Row>
            <Row className="g-3 mb-4">
              <Col xs="12" md="2">
                <Autocomplete
                  options={['Beginner', 'Intermediate', 'Advanced']}
                  value={difficulty}
                  onChange={handleFilterChange(setDifficulty)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Difficulty"
                      variant="outlined"
                      sx={roundedDropdownStyle}
                    />
                  )}
                />
              </Col>

              <Col xs="12" md="2" className="mt-3 mt-md-0">
                <Autocomplete
                  options={subDomainCategories}
                  value={category}
                  onChange={handleFilterChange(setCategory)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Category"
                      variant="outlined"
                      sx={roundedDropdownStyle}
                    />
                  )}
                />
              </Col>

              <Col xs="12" md="2" className="mt-3 mt-md-0">
              </Col>
              <Col xs="12" md="3" className="mt-3 mt-md-0">
              </Col>

              <Col xs="12" md="3" className="mt-3 mt-md-0">
                <Autocomplete
                  freeSolo
                  options={certificate.map((option) => option.courseName)}
                  value={searchTerm}
                  onChange={handleSearchChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      fullWidth
                      placeholder="Search for certifications..."
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
              </Col>
            </Row>

            <Row>
              {filteredCertificates.map((item, key) => (
                <Col xs="12" md="6" key={key}>
                  <Card className="mb-3 shadow-lg hover-shadow" variant="outlined" sx={{ borderRadius: 9, transition: '0.3s ease', position: 'relative' }}>
                    {/* <Box
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        cursor: 'pointer',
                        zIndex: 1,
                      }}
                      onClick={() => handleBookmarkToggle(item.courseId)}
                    >
                      {bookmarkedItems.includes(item.courseId) ? (
                        <BookmarkIcon style={{ color: "#f0c040" }} />
                      ) : (
                        <BookmarkBorderIcon style={{ color: "#172b4d" }} />
                      )}
                    </Box> */}
                    <CardContent>
                      <Row className="align-items-center">
                        <Col md="12">
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography variant="h6" component="div" className="font-weight-bold" sx={{ flexGrow: 2 }}>
                              {item.courseName}
                            </Typography>

                          </Stack>
                          <Stack direction="row" spacing={2} className="mt-2">
                            <Chip
                              label={
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                  <span style={{ color: '#f0f0f0' }}>Study</span>
                                  <SchoolIcon style={{ marginLeft: '8px', color: '#f0f0f0' }} sx={{ fontSize: 20 }} />
                                </div>
                              }
                              onClick={() => handleButtonClick("Study", item.courseId)}
                              className={classes.langChip}
                            />
                            <Chip
                              label={
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                  <span style={{ color: '#f0f0f0' }}>Practice</span>
                                  <ModeEditIcon style={{ marginLeft: '8px', color: '#f0f0f0' }} sx={{ fontSize: 20 }} />
                                </div>
                              }
                              onClick={() => handleButtonClick("Practice", item.courseId)}
                              className={classes.langChip}
                            />
                            <Chip
                              label={
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                  <span style={{ color: '#f0f0f0' }}>Mock</span>
                                  <ListAltIcon style={{ marginLeft: '8px', color: '#f0f0f0' }} sx={{ fontSize: 20 }} />
                                </div>
                              }
                              onClick={() => handleButtonClick("Mock", item.courseId)}
                              className={classes.langChip}
                            />
                          </Stack>

                        </Col>
                      </Row>
                      <Row className="mt-1 justify-content-end">
                        <Stack direction="row" spacing={1} className="mt-2">
                          <Chip label={item.difficulty} style={{ marginRight: '10px', color: '#172b4d', fontWeight: 'bold' }} />
                        </Stack>
                      </Row>
                    </CardContent>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        </div>
      )}
    </>
  );
};

export default CertificationPage;