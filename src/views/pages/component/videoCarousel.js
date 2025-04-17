import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import useStyles from "../app/styles";

const VideoCarousel = ({ videos, title }) => {
  const classes = useStyles();

  const settings = {
    dots: false,          
    infinite: false,      
    speed: 500,
    slidesToShow: 1,      
    slidesToScroll: 1,
    arrows: true,         
    autoplay: false       
  };
  
  return (
    <div className={classes.videoCarouselContainer}>
      <Slider {...settings}>
        {videos.map((video, index) => (
          <div key={index} className={classes.videoSlide}>
            <iframe
              className={classes.video}
              src={`${video}?rel=0&modestbranding=1&controls=1&fs=0&iv_load_policy=3`}
              title={`Video ${index + 1}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              
              allowFullScreen
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default VideoCarousel;
