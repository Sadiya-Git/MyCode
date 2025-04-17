import React, { useEffect } from "react";
import PropTypes from 'prop-types';

const Timer = ({ initMinute = 0, initSeconds = 10, onTimerOver }) => {
    const [minutes, setMinutes] = React.useState(initMinute);
    const [seconds, setSeconds] = React.useState(initSeconds);

    useEffect(() => {
        let myInterval = setInterval(() => {
            if (seconds > 0) {
                setSeconds(seconds - 1);
            } else {
                if (minutes === 0) {
                    clearInterval(myInterval);
                    if (onTimerOver) {
                        onTimerOver(); // Call the callback function
                    }
                } else {
                    setMinutes(minutes - 1);
                    setSeconds(59);
                }
            }
        }, 1000);

        return () => {
            clearInterval(myInterval);
        };
    }, [minutes, seconds, onTimerOver]);

    return (
        <React.Fragment>
        {minutes === 0 && seconds === 0 ? (
            <React.Fragment>
                <b className="quizHeading text-danger" >
                    Comleted
                </b>
            </React.Fragment>
        ) : (
           
                <b className="description text-yellow" style={{fontFamily:'digital-clock-font',fontSize:'bolder',fontSize: '20px'}}>{minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}</b>
           
        )}
    
</React.Fragment>    );
};

Timer.propTypes = {
    initMinute: PropTypes.number,
    initSeconds: PropTypes.number,
    onTimerOver: PropTypes.func, // Callback function to be called when the timer is over
};

export default Timer;
