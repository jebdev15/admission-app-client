import React from 'react'
import {
    AppBar,
    Avatar,
    Box,
    Button,
    ListItemAvatar,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Toolbar,
    Typography,
} from "@mui/material";
import {
    Home as HomeIcon,
    Logout,
    AccountCircle as AccountCircleIcon,
} from "@mui/icons-material";
import chmsuLogo from "../../../assets/chmsu.jpg";
import { ProtectedRouteContext } from '../ProtectedRoute';
import { jwtDecode } from 'jwt-decode';
interface DecodedToken {
    name: string;
    picture: string;
    role: string;
    campus: string;
}

const Header = () => {
    const { accessToken, handleLogout } = React.useContext(ProtectedRouteContext);
    const token: string = accessToken || '';
    const decodedToken: DecodedToken = jwtDecode(token || '') || { name: '', picture: '', role: '', campus: '' };
    const [menuAnchor, setMenuAnchor] = React.useState(null);

    return (
        <Box
            sx={{
                width: "100%",
                height: 67,
                // position: "fixed",
                zIndex: "1000",
            }}
        >
            <AppBar className="header" elevation={0}>
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
                            src={decodedToken ? decodedToken.picture : ""}
                        />
                    </Button>
                    <Menu
                        anchorEl={menuAnchor}
                        open={Boolean(menuAnchor)}
                        onClose={() => setMenuAnchor(null)}
                        slotProps={{
                            paper: {
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
                            }
                        }}
                        transformOrigin={{ horizontal: "right", vertical: "top" }}
                        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                    >
                        <MenuItem>
                            <ListItemIcon>
                                <HomeIcon />
                            </ListItemIcon>
                            <ListItemText sx={{ ml: 3 }} primary={decodedToken ? decodedToken.campus : ""} />
                        </MenuItem>
                        <MenuItem>
                            <ListItemIcon>
                                <AccountCircleIcon />
                            </ListItemIcon>
                            <ListItemText sx={{ ml: 3 }} primary={decodedToken ? decodedToken.role : ""} />
                        </MenuItem>
                        <MenuItem>
                            <ListItemAvatar>
                                <Avatar
                                    //   src={cookies.picture}
                                    sx={{ width: 24, height: 24 }}
                                />
                            </ListItemAvatar>
                            <ListItemText primary={decodedToken ? decodedToken.name : ""} />
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>
                            <ListItemIcon >
                                <Logout />
                            </ListItemIcon>
                            <ListItemText sx={{ ml: 3 }} primary="Sign Out" />
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
        </Box>
    )
}

export default Header