import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Input
} from "reactstrap";
import Select from 'react-select'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import moment from "moment";
import Slider from '@mui/material/Slider';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import '@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css';
import 'react-calendar/dist/Calendar.css';
const FilterComponent = (props) => {
  const [sliderValue, setSliderValue] = useState(0)
  const [dropdownVal, setDropdownVal] = useState({ label: 'Select', value: 'Select' })
  const [openCalendar, setOpenCalendar] = useState(true)
  const [expanded, setExpanded] = useState(false);
  const [accordionStateForSkill, setAccordionStateForSkill] = useState(true)
  const [accordionStateForPercentage, setAccordionStateForPercentage] = useState(true)
  const [dateChange, setDateChange] = useState(false)
  const [inputForSlider, setInputForSlider] = useState(0)
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ]);
  const [uniqueSubjects, setUniqueSubjects] = useState([])
  const getFormattedDate = (date) => {
    if (date) {
      var year = date.getFullYear();

      var month = (1 + date.getMonth()).toString();
      month = month.length > 1 ? month : '0' + month;

      var day = date.getDate().toString();
      day = day.length > 1 ? day : '0' + day;

      return year + '-' + month + '-' + day;
    } else {
      return ""
    }

  }
  const handleSlider = (event) => {
    setSliderValue(event.target.value)
  }
  const handlePanelChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    setOpenCalendar(true);
  };
  const handleApplyFilter = () => {
    const filterCourse = dropdownVal.value !== "" ? props.dataForTable.filter(item => item.courseName === dropdownVal.value) : []
    const objToPass = {
      courseId: filterCourse.length > 0 ? filterCourse[0].course_id + "" : '',
      startDate: dateChange ? getFormattedDate(state[0].startDate) + "" : "",
      endDate: dateChange ? getFormattedDate(state[0].endDate) + "" : "",
      coursePercentage: sliderValue + ""
    }
    props.handleApply(objToPass)
  }
  const clearFilters = () => {
    setSliderValue("")
    setState([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection'
      }
    ])
    setDropdownVal({ label: '', value: '' })
  }
  const handleResetFilter = () => {
    const objToPass = {
      courseId: "",
      startDate: "",
      endDate: "",
      coursePercentage: ""
    }
    clearFilters()
    props.handleApply(objToPass)
  }
  useEffect(() => {
    const coursesAvailable = props.dataForTable.map(item => item.courseName)
    const uniqueCourses = [...new Set(coursesAvailable)]
    const uniqueCoursesOption = uniqueCourses.map(item => {
      const obj = {}
      obj.value = item;
      obj.label = item;
      return obj
    })
    setUniqueSubjects(uniqueCoursesOption)
    //console.log(uniqueCourses, 'wewewe')
  }, [props.dataForTable])
  const handleSelect = (e) => {
    setDropdownVal({ label: e.value, value: e.value })
    handleApplyFilter()
  }
  const handleOnChange = (ranges) => {
    setDateChange(true)
    const { selection } = ranges;
    if (
      moment(ranges.selection.startDate).format("YYYY-MM-DD") !==
      moment(ranges.selection.endDate).format("YYYY-MM-DD")
    ) {
      setOpenCalendar(false);
      setExpanded(false)
    } else if (ranges.selection.startDate === "" && ranges.selection.endDate === "") {
      setOpenCalendar(false);
      setExpanded(false)
    }
    setState([selection]);
  };
  const handleAccordionForSkill = () => {
    setAccordionStateForSkill(!accordionStateForSkill)
  }
  const handleAccordionForPercentage = () => {
    setAccordionStateForPercentage(!accordionStateForPercentage)
  }
  const handleChangeForSlider = (e) => {
    setInputForSlider(e.target.value)
    setSliderValue(e.target.value)
  }
  const [value, onChange] = useState([new Date(), new Date()]);
  return (
    <div className="container-score">
      <Container fluid >
        <Accordion expanded={accordionStateForSkill} onChange={handleAccordionForSkill}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header idForAccordionHeader"

          >
            Score Filters
          </AccordionSummary>
          <AccordionDetails>
            <div className="accordianContainer">
              <div className="accordianItem">
                <div>
                  Skill
                </div>
                <div>
                  <Select options={uniqueSubjects} onChange={(e) => handleSelect(e)} value={dropdownVal} />
                </div>
              </div>
              <div className="accordianItem">
                <div>  Score Percentage </div>
                <Row className="" xl="8">
                  <Col lg="6">
                    <div className="divContainerForModuleName">

                      <Input
                        type="text"
                        onChange={(e) => handleChangeForSlider(e)}
                        name="sliderInput"         // Update to first_name
                        value={sliderValue === "" ? 0 : sliderValue}
                        placeholder=""
                      />
                    </div>
                  </Col>
                </Row>
                <Box>
                  <Slider defaultValue={0} aria-label="Default" valueLabelDisplay="auto" onChange={handleSlider} value={sliderValue} />
                </Box>
              </div>
              <div className="accordianItem">
                <div>  Select Enrollment Date </div>
                <DateRangePicker onChange={onChange} value={value} />
              </div>
            </div>
            <div className="filterButtonContainer">
       
            <div className="filter-button">
              <Button
                className="text-white bg-gradient-default"
                size="sm"
                // tag={Link}
                onClick={handleApplyFilter}

              >
                Apply Filters
              </Button>
            </div>
            <div className="filter-button">
              <Button
                className="text-white bg-gradient-default"
                size="sm"
                // tag={Link}
                onClick={handleResetFilter}

              >
                Reset Filters
              </Button>
            </div>
        </div>
          </AccordionDetails>


        </Accordion>

       
      </Container>

    </div>
  )
}

export default FilterComponent