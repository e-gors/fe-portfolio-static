import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import { ContainedButton } from "../../../components/CustomButtons";
import CustomTimeline from "../../../components/CustomTimeline";
import { experiences } from "../../../_mock/experiences";
// import publicHttp from "../../../utils/publicHttp";
import { isEmpty } from "../../../utils/heplers";
import { useDispatch } from "react-redux";
import { setTotalExperiences } from "../../../redux/actions/totalsActions";
import { storage } from "../../../firebase/firebaseConfig";
import { ref, getDownloadURL } from "firebase/storage";
import { options, ToastNotification } from "../../../utils/toastConfig";

function Experiences() {
  const dispatch = useDispatch();
  const [expList, setExpList] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  // React.useEffect(() => {
  //   const controller = new AbortController();

  //   fetchData(controller);
  //   return () => controller.abort();
  // }, []);

  // const fetchData = (controller) => {
  //   setLoading(true);
  //   publicHttp
  //     .get("experiences", { signal: controller.signal })
  //     .then((res) => {
  //       setExpList(res.data.data);
  //       dispatch(setTotalExperiences(res.data?.data[0]?.totalExperience));
  //     })
  //     .catch((err) => {
  //       console.error(err.message);
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // };

  // when click, download the latest uploaded resume
  const handleDownloadResume = async() => {
    try {
      // Create a reference to the file in Firebase Storage
      const fileName = "Goron, Efren - Resume (Dev).docx"; // Your file name
      const resumeRef = ref(storage, fileName); // Use the file name directly

      // Get the download URL
      const url = await getDownloadURL(resumeRef);

      // Create a new link element
      const link = document.createElement("a");
      link.href = url; // Set the URL to the link
      link.setAttribute("download", fileName); // Specify the filename

      // Append the link to the document
      document.body.appendChild(link);

      // Trigger the download
      link.click();

      // Cleanup: Remove the link after download
      document.body.removeChild(link);
    } catch (err) {
      ToastNotification("error", err, options);
    }
  };

  const exps = !isEmpty(expList) ? expList : experiences;

  return (
    <Box
      sx={{
        height: "auto",
        overflow: "none",
        padding: { xs: "5%", md: "3% 10%" },
        backgroundColor: "white",
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Box>
            <Typography variant="h3" gutterBottom>
              My Experiences
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              I have had the pleasure to work with companies across a variety of
              industries. I’m always interested in new, exciting, and
              challenging adventures.
            </Typography>
            <ContainedButton variant="contained" onClick={handleDownloadResume}>
              Download CV
            </ContainedButton>
          </Box>
        </Grid>
        <Grid item xs={12} md={8}>
          <CustomTimeline
            experiences={exps}
            position="right"
            loading={loading}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Experiences;
