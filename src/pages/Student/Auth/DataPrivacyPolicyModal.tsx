import React from 'react'
import {
    Box,
    Button,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    useTheme,
    useMediaQuery,
} from "@mui/material";
import { AuthContext } from "../../../context/Auth/AuthContext";
const DataPrivacyPolicyModal = () => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
    const { isFirstModalOpen, isSecondModalOpen, setOpenNextModal, setAgreed } = React.useContext(AuthContext);
    return (
        <>
            <Dialog
                open={isFirstModalOpen}
                maxWidth="md"
                fullScreen={fullScreen}
                fullWidth
                sx={{
                    "& .MuiDialog-paper": {
                        borderRadius: 2,
                    },
                }}
            >
                <DialogTitle>CHMSU Data Privacy Policy</DialogTitle>
                <DialogContent>
                    <Typography color="primary.main" fontWeight={500} /* textTransform="uppercase" */>
                        Who we are
                    </Typography>
                    <Typography variant="caption">
                        {" "}
                        Carlos Hilado Memorial State University is a GREEN university committed to empower learners through academic excellence, relevant research, active community engagement, and good governance in order to build a just and sustainable world. The Office of the Guidance Services is responsible for managing the CHMSU Addmission Test.
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Typography color="primary.main" fontWeight={500} /* textTransform="uppercase" */>
                        What information we collect and how
                    </Typography>
                    <Typography variant="caption">
                        {" "}
                        The information we collect via the website may include: <br />
                        <br />
                        1. Personal details - Any personal details you knowingly provide us through forms and our email, such as name, address, mobile/telephone number, etc. Under no
                        circumstances will we hold sensitive payment details such as your credit/debit card number, expiry date, one-time password, CVV number, and security code. <br />
                        <br />
                        2. IP Address - This is a string of numbers unique to your computer that our web server records when you request any page or component on the website. This information is
                        used to monitor your usage of the website.
                        <br />
                        <br />
                        3. Preferred settings – The website will record data that will allows us to recognize you and your preferred settings. This saves you from re-entering information on
                        return visits to the site. Such data is recorded locally on your computer through the use of cookies. Most browsers can be programmed to reject or warn you before
                        downloading cookies. Information regarding this may be found in your browser’s help facility.
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                        <Button variant="contained" color="primary" sx={{ pt: 1, color: "white", borderRadius: 2 }} onClick={setOpenNextModal}>
                            next
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
            <Dialog
                open={isSecondModalOpen}
                maxWidth="md"
                fullScreen={fullScreen}
                fullWidth
                sx={{
                    "& .MuiDialog-paper": {
                        borderRadius: 2,
                    },
                }}
            >
                <DialogTitle>CHMSU Data Privacy Policy</DialogTitle>
                <DialogContent>
                    <Typography color="primary.main" fontWeight={500} /* textTransform="uppercase" */>
                        What we do with your information
                    </Typography>
                    <Typography variant="caption">
                        {" "}
                        Any personal information we collect from this website will be used in accordance with the Republic Act 10173 – Data Privacy Act of 2012 and other applicable laws.
                        Specifically, the details we collect will be used to: <br />
                        <br />
                        1. Process your request for taking the university’s Admission Test, and provide the information required by the Commission on Higher Education (CHED) for billing and
                        related purposes under the REPUBLIC ACT 10687 or CHED UNIFAST Law; and <br />
                        <br />
                        2. Carry out certain activities such as processing and sorting data, monitoring how customers use the website, and issuing our e-mails for us. Third parties may be asked
                        to do this but will not be allowed to use your personal information for their purposes. We may need to pass the information we collect to authorized persons under the
                        university’s student admission and screening committee.
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Typography color="primary.main" fontWeight={500} /* textTransform="uppercase" */>
                        Your Rights
                    </Typography>
                    <Typography variant="caption">
                        {" "}
                        You have the right to request a copy of any information that we currently hold about you.
                        <strong>
                            To receive such information, report any issues, or request for assistance, please don't hesitate to email us at ict.mis@chmsu.edu.ph.
                        </strong>
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                        <Button variant="contained" color="primary" sx={{ pt: 1, color: "white", borderRadius: 2 }} onClick={setAgreed}>
                            Agree & Continue
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default DataPrivacyPolicyModal;