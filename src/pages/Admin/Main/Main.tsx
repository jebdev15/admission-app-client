import React, { useEffect, useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Paper,
  Toolbar,
  Tooltip,
  Typography,
  Backdrop,
  useMediaQuery,
} from "@mui/material";
import {
  Home as HomeIcon,
  Logout,
  Menu as MenuIcon,
  People as PeopleIcon,
  Schedule as ScheduleIcon,
  Settings,
  WorkHistory as WorkHistoryIcon,
  AccountCircle as AccountCircleIcon,
} from "@mui/icons-material";
import { Outlet, useNavigate } from "react-router-dom";
// import { useCookies } from "react-cookie";
// import { googleLogout } from "@react-oauth/google";
import chmsuLogo from "../../../assets/chmsu-small.jpg";
import "../../Student/header.css";

const Admin: React.FC = () => {
  const navigate = useNavigate();
  //   const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const [drawerMinimize, setDrawerMinimize] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);

  const [activeItem, setActiveItem] = useState(localStorage.getItem("activeItem"));

  const [backdropOpen, setBackdropOpen] = useState(false);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  useEffect(() => {
    localStorage.setItem("activeItem", activeItem as string);
  }, [activeItem]);

  useEffect(() => {
    if (drawerMinimize) {
      setBackdropOpen(false);
    } else {
      setBackdropOpen(true);
    }
  }, [drawerMinimize]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100dvh",
        alignItems: "stretch",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: 67,
          position: "fixed",
          zIndex: "1000",
        }}
      >
        <AppBar className="header" position="static" elevation={0} sx={{ position: "relative" }}>
          <Toolbar
            sx={{
              display: { xs: "flex", md: "flex" },
              alignContent: "center",
              alignItems: "center",
              justifyContent: "space-between",
              paddingY: 1,
              paddingX: 5,
              borderBottom: 3,
              borderColor: "primary.main",
              width: "100%",
              // height: {xs: 'auto', md: '100px'}
              height: "auto",
              backgroundColor: "#fff",
            }}
          >
            <Box sx={{ display: "flex" }}>
              <IconButton
                size="large"
                edge="start"
                //   color="primary.dark"
                aria-label="menu"
                sx={{ color: "primary.dark", mr: 1 }}
                onClick={() => {
                  setDrawerMinimize(!drawerMinimize);
                }}
              >
                <MenuIcon />
              </IconButton>
              <img src={chmsuLogo} alt="CHMSU Logo" width={50} height={50} className="logo" />
            </Box>
            <Typography className="systemName" variant="h6" component="div" sx={{ color: "primary.dark", flexGrow: 1, lineHeight: "1" }}>
              <span></span>
              <span></span>
            </Typography>
            <Button
              color="primary"
              onClick={(e) => setMenuAnchor(e.currentTarget as any)}
              sx={{
                minWidth: "unset",
                borderRadius: "50%",
                padding: "8px",
              }}
            >
              <Avatar
                sx={{
                  height: "35px",
                  width: "35px",
                  outline: "4px solid var(--border-default)",
                }}
                alt="name"
                src={"cookies.picture"}
              />
            </Button>
            <Menu
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClose={() => setMenuAnchor(null)}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&:before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 20,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem>
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText sx={{ ml: 3 }} primary={"campusAccessing"} />
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <AccountCircleIcon />
                </ListItemIcon>
                <ListItemText sx={{ ml: 3 }} primary={"cookies.accessLevel"} />
              </MenuItem>
              <MenuItem>
                <ListItemAvatar>
                  <Avatar
                    //   src={cookies.picture}
                    sx={{ width: 24, height: 24 }}
                  />
                </ListItemAvatar>
                <ListItemText primary={"cookies.name"} />
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <Logout />
                </ListItemIcon>
                <ListItemText sx={{ ml: 3 }} primary="Sign Out" />
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexGrow: 1,
          position: "relative",
        }}
      >
        <Box
          sx={{
            width: drawerMinimize ? 77 : 250,
            height: "100dvh",
            position: "fixed",
            overflow: "hidden",
            zIndex: "500",
            paddingTop: "67px",
            transition: (theme) =>
              theme.transitions.create("width", {
                easing: theme.transitions.easing.easeInOut,
                duration: theme.transitions.duration.leavingScreen,
              }),
            "@media (max-width: 599px)": {
              width: drawerMinimize ? 0 : 250,
            },
          }}
        >
          <Paper className="navigation" elevation={4} square sx={{ height: "inherit", overflow: "auto" }}>
            <List>
              {/* Home */}
              <ListItemButton
                className={activeItem === "home" ? "navbtn active" : "navbtn"}
                onClick={() => {
                  setActiveItem("home");
                  navigate(`/admin`);
                }}
              >
                <Tooltip title="Home">
                  <ListItemIcon>
                    <HomeIcon />
                  </ListItemIcon>
                </Tooltip>
                {drawerMinimize ? null : <ListItemText primary="Home" />}
              </ListItemButton>
              {/* Home */}

              {/* Students */}
              <ListItemButton
                className={activeItem === "students" ? "navbtn active" : "navbtn"}
                onClick={() => {
                  setActiveItem("students");
                  navigate(`/admin/students`);
                }}
              >
                <Tooltip title="Students">
                  <ListItemIcon>
                    <PeopleIcon />
                  </ListItemIcon>
                </Tooltip>
                {drawerMinimize ? null : <ListItemText primary="Students" />}
              </ListItemButton>
              {/* Students */}

              <>
                {/* Faculty */}
                <ListItemButton
                  className={activeItem === "faculty" ? "navbtn active" : "navbtn"}
                  onClick={() => {
                    setActiveItem("faculty");
                    navigate(`/admin/faculty`);
                  }}
                >
                  <Tooltip title="Faculty">
                    <ListItemIcon>
                      <ScheduleIcon />
                    </ListItemIcon>
                  </Tooltip>
                  {drawerMinimize ? null : <ListItemText primary="Faculty" />}
                </ListItemButton>
                {/* Faculty */}
                {/* Users */}
                <ListItemButton
                  className={activeItem === "users" ? "navbtn active" : "navbtn"}
                  onClick={() => {
                    setActiveItem("users");
                    navigate(`/admin/users`);
                  }}
                >
                  <Tooltip title="Users">
                    <ListItemIcon>
                      <PeopleIcon />
                    </ListItemIcon>
                  </Tooltip>
                  {drawerMinimize ? null : <ListItemText primary="Users" />}
                </ListItemButton>
                {/* Users */}

                {/* Reports */}
                <ListItemButton
                  className={activeItem === "reports" ? "navbtn active" : "navbtn"}
                  onClick={() => {
                    setActiveItem("reports");
                    navigate(`/admin/reports`);
                  }}
                >
                  <Tooltip title="Reports">
                    <ListItemIcon>
                      <WorkHistoryIcon />
                    </ListItemIcon>
                  </Tooltip>
                  {drawerMinimize ? null : <ListItemText primary="Reports" />}
                </ListItemButton>
                {/* Reports */}

                {/* Settings */}
                <ListItemButton
                  className={activeItem === "settings" ? "navbtn active" : "navbtn"}
                  onClick={() => {
                    setActiveItem("settings");
                    navigate(`/admin/settings`);
                  }}
                >
                  <Tooltip title="Settings">
                    <ListItemIcon>
                      <Settings />
                    </ListItemIcon>
                  </Tooltip>
                  {drawerMinimize ? null : <ListItemText primary="Settings" />}
                </ListItemButton>
                {/* Settings */}
              </>
            </List>
          </Paper>
        </Box>
        <Box
          className="main"
          sx={{
            transition: (theme) =>
              theme.transitions.create("margin", {
                easing: theme.transitions.easing.easeInOut,
                duration: theme.transitions.duration.leavingScreen,
              }),
            marginLeft: drawerMinimize ? "77px" : "250px",
            flexGrow: 1,
            p: 3,
          }}
        >
          {isMobile && (
            <Backdrop
              open={backdropOpen}
              sx={{
                zIndex: "400",
                backgroundColor: "rgba(0, 0, 0, 0.25);",
              }}
            ></Backdrop>
          )}
          <Outlet />
          {/* <Box sx={{ flexGrow: 1, p: 3 }}>
          <Outlet context={[schoolyear, semester, from, to]}/> */}
        </Box>
      </Box>
    </Box>
  );
};

export default React.memo(Admin);
