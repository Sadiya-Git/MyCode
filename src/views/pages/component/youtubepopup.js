import React from 'react';

const YouTubePopup = ({ youtubeLink, onClose }) => {
    return (
        <div className="youtube-popup">
            <div className="youtube-popup-content">
                <iframe
                    title="YouTube Video"
                    width="560"
                    height="315"
                    src={youtubeLink}
                    frameBorder="0"
                    allowFullScreen
                ></iframe>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default YouTubePopup;
