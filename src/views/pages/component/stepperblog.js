import React,{useState} from 'react';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function GoogleCloudPlatformBlog() {
    const [expanded, setExpanded] = useState(true); // Initially expanded

    const handleChange = () => {
        setExpanded((prevExpanded) => !prevExpanded);
    };
    return (
        <div>
       <Accordion expanded={expanded} onChange={handleChange}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                <h2>Google Cloud Platform (GCP)</h2>
            </AccordionSummary>
           
                <AccordionDetails>
                    <span>
                        Google Cloud Platform (GCP) is a suite of cloud computing services offered by Google. It provides a range of services including computing, storage, networking, machine learning, and data analytics to help businesses scale and grow.
                    </span>
                </AccordionDetails>
            </Accordion>

            <Accordion expanded={expanded} onChange={handleChange}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <h2>Key Features of GCP</h2>
                </AccordionSummary>
                <AccordionDetails>
                    <ul>
                        <li><strong>Scalability:</strong> GCP offers scalable infrastructure to handle growing workloads efficiently.</li>
                        <li><strong>Compute Services:</strong> Compute Engine, App Engine, and Kubernetes Engine provide flexible options for deploying applications.</li>
                        <li><strong>Storage:</strong> GCP offers various storage options including Cloud Storage, Bigtable, and Firestore.</li>
                        <li><strong>Networking:</strong> GCP provides a global network with low-latency and high-performance connections.</li>
                        <li><strong>Big Data and Machine Learning:</strong> GCP offers tools like BigQuery, Dataflow, and AI Platform for analyzing and processing large datasets.</li>
                    </ul>
                </AccordionDetails>
            </Accordion>

            <Accordion expanded={expanded} onChange={handleChange}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <h2>Advantages of Using GCP</h2>
                </AccordionSummary>
                <AccordionDetails>
                    <ul>
                        <li><strong>Reliability:</strong> GCP offers high availability and reliability with its global infrastructure.</li>
                        <li><strong>Security:</strong> GCP provides robust security features to protect data and applications.</li>
                        <li><strong>Cost-Effective:</strong> GCP offers flexible pricing models and discounts, making it cost-effective for businesses.</li>
                        <li><strong>Integration:</strong> GCP integrates seamlessly with other Google services and third-party tools.</li>
                        <li><strong>Innovation:</strong> GCP constantly innovates with new features and services to meet evolving business needs.</li>
                    </ul>
                </AccordionDetails>
            </Accordion>

            <Accordion expanded={expanded} onChange={handleChange}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <h2>Getting Started with GCP</h2>
                </AccordionSummary>
                <AccordionDetails>
                    <span>
                        To get started with Google Cloud Platform, you can sign up for a free trial or create an account. Google offers comprehensive documentation, tutorials, and hands-on labs to help you learn and explore GCP services.
                    </span>
                </AccordionDetails>
            </Accordion>
        </div>
    );
}

export default GoogleCloudPlatformBlog;
