import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => ({
  videoCarouselContainer: {
    width: "100%",
    maxWidth: "1000px",
    margin: "0 auto",
  },
  videoSlide: {
    display: "flex",
    justifyContent: "center",
  },
  video: {
    width: "100%",
    height: "500px",
    maxWidth: "1000px",
  },
}));

export default useStyles;
