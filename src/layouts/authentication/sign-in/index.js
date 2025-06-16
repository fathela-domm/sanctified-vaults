import { useState, useRef } from "react";
import { useAuth } from 'context/AuthContext';
// react-router-dom components
import { Link, useNavigate } from "react-router-dom";

import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import Twitter from "@mui/icons-material/Twitter";
import GoogleIcon from "@mui/icons-material/Google";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";

function Basic() {
  const { signIn,currentUser, userRole, signInWithGoogle, signInWithFacebook, signInWithTwitter, signUp } = useAuth();
  const handleSetRememberMe = () => setRememberMe(!rememberMe);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await signInWithGoogle();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleFacebookSignIn = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await signInWithFacebook();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleTwitterSignIn = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await signInWithTwitter();
    } catch (error) {
      setError(error.message);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email && password) {
      try {
        setError('');
        await signIn(email, password);
      } catch (error) {
        // setError(error.message);
        if ("invalid-login-credentials" in error.message) {
          await signUp(email, password);
        }
      }
    }
  };

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign In
          </MDTypography>
           {
            error && (
              <MDTypography variant="p" fontWeight="light" style={{ color:"pink" }}>
                {error}
              </MDTypography>
            )
          }
        </MDBox>
        <MDBox mb={2} pt={4} pb={3} px={3}>
          <MDButton sx={{ mt: 2}} onClick={handleGoogleSignIn} variant="gradient" color="secondary" fullWidth>
            <GoogleIcon style={{ "marginRight": "5px", "marginTop": "-2px" }} color="inherit" />
              Sign in with Google
          </MDButton>
          <MDButton sx={{ mt: 2}} onClick={handleFacebookSignIn} variant="gradient" color="info" fullWidth>
              <FacebookIcon style={{ "marginRight": "3px", "marginTop": "-2px" }} color="inherit" />
              Sign in with Facebook
          </MDButton>
          <MDButton sx={{ mt: 2}} onClick={handleTwitterSignIn} variant="gradient" color="secondary" fullWidth>
            <Twitter style={{ "marginRight": "5px", "marginTop": "-2px" }} color="inherit" /> 
            Sign in with Twitter
          </MDButton>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
