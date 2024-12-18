import { Check, Error, Visibility, VisibilityOff } from "@mui/icons-material";
import DangerousIcon from "@mui/icons-material/Dangerous";
import { Alert, Card, CardContent, CardHeader, CircularProgress, IconButton, InputAdornment, Snackbar } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUserAction } from "../../redux/authentication/auth.actions";

export default function SignUp() {
  const dispatch = useDispatch();
  const error = useSelector((store) => store.auth.error);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setError] = useState("");
  const [strength, setStrength] = useState(0);
  const [requirements, setRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });
  const calculatePasswordStrength = (password) => {
    let score = 0;
    if (password.length > 8) score++;
    if (password.match(/[A-Z]/)) score++;
    if (password.match(/[a-z]/)) score++;
    if (password.match(/[0-9]/)) score++;
    if (password.match(/[^A-Za-z0-9]/)) score++;
    return score;
  };

  const checkRequirements = (password) => {
    const newRequirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };
    setRequirements(newRequirements);

    if (Object.values(newRequirements).every((req) => req)) {
      setError("");
      setIsLoading(false);
    }
  };

  const updatePassword = (newPassword) => {
    setPassword(newPassword);
    setStrength(calculatePasswordStrength(newPassword));
    checkRequirements(newPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    if (password !== confirmPassword) {
      setError("Passwords do not match");
    } else if (
      !requirements.length ||
      !requirements.uppercase ||
      !requirements.lowercase ||
      !requirements.number ||
      !requirements.special
    ) {
      setError("Password does not meet all requirements");
    } else if (strength < 3) {
      setError("Password is not strong enough");
    } else {
      try {
        const data = new FormData(event.currentTarget);
        const json = Object.fromEntries(data.entries());
        console.log("Sign up data: ", { data: json });
        await new Promise((resolve) => setTimeout(resolve, 500));
        await dispatch(registerUserAction({ data: json }));
      } catch (e) {
        console.error("Error signing up", e);
        setError("Error signing up: ", e);
      } finally {
        setOpen(true);
        setIsLoading(false);
        setError("");
      }
    }
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  useEffect(() => {
    localStorage.removeItem("jwt");
    setPasswordsMatch(password === confirmPassword);
  }, [password, confirmPassword]);
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 4,
        background: "linear-gradient(to bottom, #f0f4f8, #d9e2ec)",
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 400, p: 4, borderRadius: 2, boxShadow: 3 }}>
        <CardHeader title="Create an account" subheader="Sign up to get started" sx={{ textAlign: "center" }} />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField name="username" label="Username" variant="outlined" fullWidth required />
              <TextField name="email" label="Email address" type="email" variant="outlined" fullWidth required />
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  id="password"
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  fullWidth
                  required
                  value={password}
                  onChange={(e) => updatePassword(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                  {[1, 2, 3, 4, 5].map((level) => (
                    <Box
                      key={level}
                      sx={{
                        height: 8,
                        width: "100%",
                        borderRadius: 1,
                        bgcolor: strength >= level ? "green" : "grey.300",
                      }}
                    />
                  ))}
                </Box>
              </Box>
              <TextField
                id="confirm-password"
                label="Confirm Password"
                type="password"
                variant="outlined"
                fullWidth
                required
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
              {confirmPassword && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {passwordsMatch ? <Check color="success" /> : <Error color="error" />}
                  <Typography variant="body2" color={passwordsMatch ? "success.main" : "error.main"}>
                    {passwordsMatch ? "Passwords match" : "Passwords do not match"}
                  </Typography>
                </Box>
              )}
              <Box sx={{ textAlign: "left" }}>
                <Typography variant="body2" color="textSecondary">
                  Password Requirements:
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {requirements.length ? <Check color="success" /> : <DangerousIcon color="error" />}
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      At least 8 characters long
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {requirements.uppercase && requirements.lowercase ? <Check color="success" /> : <DangerousIcon color="error" />}
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      Contains uppercase and lowercase letters
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {requirements.number && requirements.special ? <Check color="success" /> : <DangerousIcon color="error" />}
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      Includes numbers and special characters
                    </Typography>
                  </Box>
                </Box>
              </Box>
              {passwordError && (
                <Box sx={{ mt: 2, color: "error.main" }}>
                  <Typography variant="body2">{passwordError}</Typography>
                </Box>
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={!Object.values(requirements).every(Boolean) || !passwordsMatch || isLoading}
              >
                {isLoading ? (
                  <>
                    <CircularProgress size={24} sx={{ mr: 2 }} />
                    Sign up
                  </>
                ) : (
                  "Sign up"
                )}
              </Button>
              {error && <Alert severity="error">{error}</Alert>}
            </Box>
          </form>
          <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 2 }}>
            Already have an account?{" "}
            <a href="/sign-in" style={{ color: "#1976d2", textDecoration: "none" }}>
              Sign in
            </a>
          </Typography>
        </CardContent>
      </Card>
      <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
        {error ? (
          <Alert onClose={handleClose} severity="error" variant="filled" sx={{ width: "100%" }}>
            {error}
          </Alert>
        ) : (
          <Alert onClose={handleClose} severity="success" variant="filled" sx={{ width: "100%" }}>
            Please check your mailbox to complete signing up!
          </Alert>
        )}
      </Snackbar>
    </Box>
  );
}
