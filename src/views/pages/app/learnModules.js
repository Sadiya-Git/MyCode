import React, { useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Button, Step, StepLabel, Stepper } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GoogleCloudPlatformBlog from '../component/stepperblog'; 
import VideoExplanationAccordion from '../component/youtube'; 
import Certificationdetail from './certificationdetail';
// import CertificationDetail './'

import {
    Container,
    Row,
    Col,
} from "reactstrap";
// import Certification from './certification';

function GoogleCloudPlatformScreen() {
    const [activeStep, setActiveStep] = useState(0);
    // const [accordionExpanded, setAccordionExpanded] = useState(true);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

   

    return (
        <div className="header pb-8 pt-5 pt-md-5">
            <Container className="align-items-center" fluid>
                <header>
                    <h1>Module: Introduction to Google Cloud Platform (GCP)</h1>
                </header>
                <main>
                    <br/>
                    <Stepper activeStep={activeStep} alternativeLabel >
                        <Step key="Learning" >
                            <StepLabel >Learning blog</StepLabel>
                        </Step>
                        
                        <Step key="Video">
                            <StepLabel>Video explanation</StepLabel>
                        </Step>
                        <Step key="Practice">
                            <StepLabel>Practice set</StepLabel>
                        </Step>
                        <Step key="Quiz">
                            <StepLabel>Quiz tab</StepLabel>
                        </Step>
                    </Stepper>
<br/>
                    {activeStep === 0 && (
                        
                        <GoogleCloudPlatformBlog />
                    
                    )}

                    

                    {activeStep === 1 && (
                                               <VideoExplanationAccordion />

                    )}
                    {activeStep === 2 && (
                        <Accordion >
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <h2>Practice set</h2>
                                {/* <CertificationDetail/> */}
                                {/* <Certificationdetail/> */}
                            </AccordionSummary>
                            <AccordionDetails>
                                {/* Content for Practice set */}
                            </AccordionDetails>
                        </Accordion>
                    )}

                    {activeStep === 3 && (
                        <Accordion  >
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <h2>Quiz tab</h2>
                            </AccordionSummary>
                            <AccordionDetails>
                                {/* Content for Quiz tab */}
                            </AccordionDetails>
                        </Accordion>
                    )}
<br/>
                    {/* Navigation buttons */}
                    <div>
                        {activeStep !== 0 && (
                            // <Button onClick={handleBack}>Back</Button>
                            <Button
                                                            className="outline text-white bg-gradient-gray"
                                                            // disabled={!isSaveNextButtonEnabled}
                                                            onClick={() => handleBack()}
                                                            size="lg"
                                                        >
                                                             <i className="ni ni-bold-left text-white" />{"Back"} 
                                                        </Button>
                        )}
                        &nbsp;&nbsp;                        {activeStep < 3 && (
                            // <Button onClick={handleNext}>Next</Button>
                            <Button
                                                            className="outline text-white bg-gradient-default"
                                                            // disabled={!isSaveNextButtonEnabled}
                                                            onClick={() => handleNext()}
                                                            size="lg"
                                                        >
                                                             {"Next"} <i className="ni ni-bold-right text-white" />
                                                        </Button>
                        )}
                    </div>
                </main>
            </Container>
        </div>
    );
}

export default GoogleCloudPlatformScreen;
