import React,{useState} from 'react';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function VideoExplanationAccordion() {
    const [expanded, setExpanded] = useState(true); // Initially expanded

    const handleChange = () => {
        setExpanded((prevExpanded) => !prevExpanded);
    };
    return (
        <Accordion expanded={expanded} onChange={handleChange}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <h2>Video Explanation</h2>
            </AccordionSummary>
            <AccordionDetails>
                <div className="video-container">
                    {/* Replace 'VIDEO_ID' with the actual YouTube video ID */}
                    <iframe
                        width="560"
                        height="315"
                        src="https://www.youtube.com/embed/LwT2QjsDmks?si=3V3c1OzKpTxTtART"
                        title="Video Explanation"
                        allowFullScreen
                    ></iframe>
                </div>
            </AccordionDetails>
        </Accordion>
    );
}

export default VideoExplanationAccordion;
