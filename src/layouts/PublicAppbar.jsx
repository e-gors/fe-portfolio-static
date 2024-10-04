import * as React from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Container,
  Stack,
  ListItemButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Logo from "../components/logo";
import Nav from "./dashboard/nav";
import { OutlinedButton } from "../components/CustomButtons";
import { alpha } from "@mui/material/styles";
import PropTypes from "prop-types";
// Import necessary Firebase functions
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase/firebaseConfig";
import { options, ToastNotification } from "../utils/toastConfig";

function PublicAppBar({
  publicConfig,
  handleOpenNavMenu,
  handlePageClick,
  selectedPage,
  drawerOpen,
  onDrawerOpen,
}) {
  // when click, download the latest uploaded resume
  const handleDownloadResume = async () => {
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

  return (
    <AppBar
      enableColorOnDark
      position="fixed"
      sx={{
        backgroundColor: "transparent",
        boxShadow: "none",
        backdropFilter: "blur(10px)",
        color: "black",
        height: 60,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          sx={{
            minHeight: 60,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Logo sx={{ display: { xs: "none", md: "block" } }} />
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Nav
              handlePageClick={handlePageClick}
              selectedPage={selectedPage}
              navConfig={publicConfig}
              openNav={drawerOpen}
              onCloseNav={() => onDrawerOpen(false)}
            />
          </Box>

          <Stack
            direction="row"
            component="nav"
            spacing={1}
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            {publicConfig?.map((page, i) => {
              const title = page.title;
              const selected = selectedPage === title;
              return (
                <ListItemButton
                  key={i}
                  onClick={() => handlePageClick(page.title)}
                  selected={selected}
                  sx={{
                    borderRadius: 0.75,
                    typography: "body1",
                    color: "text.secondary",
                    textTransform: "none",
                    fontWeight: "fontWeightMedium",
                    transition: "0.3s",

                    ...(selected && {
                      color: "primary.main",
                      fontWeight: "fontWeightSemiBold",
                      bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, 0.08),
                      "&:hover": {
                        bgcolor: (theme) =>
                          alpha(theme.palette.primary.main, 0.16),
                      },
                    }),
                  }}
                >
                  {page.title}
                </ListItemButton>
              );
            })}
          </Stack>
          <Stack direction="row" spacing={2}>
            <OutlinedButton
              variant="outlined"
              size="small"
              onClick={handleDownloadResume}
            >
              Download CV
            </OutlinedButton>
            {/* <CustomSwitch noLabel /> */}
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

PublicAppBar.propTypes = {
  publicConfig: PropTypes.array,
  handleOpenNavMenu: PropTypes.func,
  handlePageClick: PropTypes.func,
  selectedPage: PropTypes.string,
  drawerOpen: PropTypes.bool,
  onDrawerOpen: PropTypes.func,
};

export default PublicAppBar;
