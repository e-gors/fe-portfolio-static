import * as React from "react";
import {
  Box,
  Modal,
  Typography,
  IconButton,
  Stack,
  FormHelperText,
  CircularProgress,
  Avatar,
  Grid,
} from "@mui/material";
import FormField from "../../../components/FormField";
import CloseIcon from "@mui/icons-material/Close";
import {
  ContainedButton,
  OutlinedButton,
} from "../../../components/CustomButtons";
import SendIcon from "@mui/icons-material/Send";
import RatingComp from "./RatingComp";
import { Validator } from "../../../utils/heplers";
import { options, ToastNotification } from "../../../utils/toastConfig";
import { addDocToCollection } from "../../../firebase/addDoc";
import { uploadImage } from "../../../firebase/uploadImage";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  minWidth: 320,
  boxShadow: 24,
  borderRadius: 2,
  p: { xs: 2, md: 4 },
};

// get the string of Avatar Component
const stringAvatar = (name) => {
  if (typeof name === "string" && name.trim() !== "") {
    const names = name.split(" ");
    const initials =
      names.length > 1 ? `${names[0][0]}${names[1][0]}` : names[0][0];
    return {
      children: initials.toUpperCase(),
    };
  } else {
    return {
      children: "DP",
    };
  }
};

//validation rules
const validator = Validator({
  guestName: "required",
  project: "required",
  message: "required",
  rating: "required",
});

const MAX_LENGTH = 600;
const MIN_LENGTH = 200;

function FeedbackForm({
  title = "Modal Title",
  description = "Modal Description...",
  open,
  handleClose,
}) {
  const [loading, setLoading] = React.useState(false);
  const [formValues, setFormValues] = React.useState({
    values: {
      guestName: "",
      project: "",
      message: "",
      rating: 0,
    },
    errors: validator.errors,
  });
  const [profileImage, setProfileImage] = React.useState(null);
  const [messageCustomError, setMessageCustomError] = React.useState("");
  const [ratingCustomError, setRatingCustomError] = React.useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setProfileImage(file);
    else setProfileImage(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      values: {
        ...prev.values,
        [name]: value,
      },
    }));

    const { errors } = validator;

    validator.validate(name, value).then((success) => {
      if (!success) {
        setFormValues((prev) => ({
          ...prev,
          errors,
        }));
      }
    });

    // Custom validation for the message field
    if (name === "message") {
      if (value.length < MIN_LENGTH || value.length > MAX_LENGTH) {
        setMessageCustomError(
          `Message must be at least ${MIN_LENGTH} and cannot exceed ${MAX_LENGTH} characters.`
        );
      } else {
        setMessageCustomError("");
      }
    }

    if (name === "rating") {
      if (value < 0) {
        setRatingCustomError(
          "Rating must be between 0.5 and 5.0 that includes decimal."
        );
      } else {
        setRatingCustomError("");
      }
    }
  };

  const handleValidate = () => {
    validator.validateAll(formValues.values).then((success) => {
      if (formValues.values.rating > 0) {
        if (success && !messageCustomError && !ratingCustomError) {
          handleSubmit();
        } else {
          setFormValues((prev) => ({
            ...prev,
            errors: validator.errors,
          }));
        }
      } else {
        setRatingCustomError(
          "Rating must be between 0.5 and 5.0 that includes decimal."
        );
      }
    });
  };

  const handleSubmit = async () => {
    setLoading(true);

    // Create the data object to be sent to Firestore
    const dataToSubmit = {
      ...formValues.values, // Spread form values
      createdAt: new Date().toISOString(), // Optional: add a timestamp
    };

    // Upload the profile image and get the URL
    let profileImageUrl = await uploadImage(profileImage);
    if (profileImageUrl) {
      dataToSubmit.profileImage = profileImageUrl; // Add the profile image URL if available
    }

    // Submit data to Firestore
    const { error, success } = await addDocToCollection(
      "feedbacks",
      dataToSubmit
    );

    if (success) {
      ToastNotification("success", "Feedback submitted successfully!", options);
      // Reset form values
      setFormValues({
        values: {
          guestName: "",
          project: "",
          message: "",
          rating: "",
        },
      });
      setProfileImage(null); // Clear the profile image
      handleClose(); // Close any open dialog/modal if applicable
    } else {
      // Handle other response statuses or errors
      ToastNotification(
        "error",
        error?.message || "Error submitting feedback.",
        options
      );
    }

    setLoading(false); // Set loading to false when done
  };

  return (
    <>
      <Modal
        keepMounted
        open={open}
        onClose={handleClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={style} maxWidth="sm">
          <Box sx={{ width: "100%", position: "relative" }}>
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
              sx={{
                position: "absolute",
                top: { xs: -10, md: -20 },
                right: { xs: -5, md: -10 },
              }}
            >
              <CloseIcon color="error" />
            </IconButton>
          </Box>
          <Box>
            <Typography id="keep-mounted-modal-title" variant="h6">
              {title}
            </Typography>
            <Typography
              id="keep-mounted-modal-description"
              variant="body2"
              color="text.secondary"
            >
              {description}
            </Typography>
            <FormHelperText error>
              Note: Your feedback needs to be approved first before it will be
              display live.
            </FormHelperText>
          </Box>
          <Box
            component="form"
            my={2}
            sx={{ maxHeight: 520, overflow: "auto" }}
          >
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              mt={2}
            >
              <Avatar
                src={profileImage ? URL.createObjectURL(profileImage) : null}
                alt="Profile"
                sx={{ width: 75, height: 75, boxShadow: 4 }}
                {...stringAvatar(formValues.values.name)}
              />
              <Typography variant="body2" mt={2}>
                Upload Profile (optional):
              </Typography>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ marginTop: "8px" }}
              />
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormField
                  name="guestName"
                  label="Guest Name"
                  value={formValues.values.guestName}
                  onChange={handleChange}
                  errors={formValues.errors}
                  type="text"
                  fullWidth
                  margin="dense"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormField
                  name="project"
                  label="Project Title"
                  value={formValues.values.project}
                  onChange={handleChange}
                  errors={formValues.errors}
                  type="text"
                  fullWidth
                  margin="dense"
                />
              </Grid>
            </Grid>

            <FormField
              name="message"
              label="Your Feedback"
              value={formValues.values.message}
              onChange={handleChange}
              errors={formValues.errors}
              type="text"
              multiline
              fullWidth
              minRows={2}
              maxRows={4}
              margin="dense"
            />
            <FormHelperText>
              {formValues.values.message.length} / {MAX_LENGTH}
            </FormHelperText>
            <FormHelperText error>{messageCustomError}</FormHelperText>
            <RatingComp
              value={formValues.values.rating}
              onChange={handleChange}
              name="rating"
              errors={formValues.errors}
            />
            <FormHelperText error>
              {ratingCustomError && ratingCustomError}
            </FormHelperText>
          </Box>
          <Stack direction="row" spacing={2}>
            <ContainedButton
              variant="contained"
              onClick={handleValidate}
              disabled={loading}
              endIcon={loading ? <CircularProgress size={24} /> : <SendIcon />}
            >
              Submit
            </ContainedButton>
            <OutlinedButton variant="outlined" onClick={handleClose}>
              Cancel
            </OutlinedButton>
          </Stack>
        </Box>
      </Modal>
    </>
  );
}

export default FeedbackForm;
