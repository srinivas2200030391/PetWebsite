import { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  Avatar,
  Box,
  Divider,
  CircularProgress,
  Grid,
  Paper,
} from "@mui/material";
import config from "../../config";
import {
  Edit,
  Lock,
  User,
  Phone,
  Mail,
  Home,
  Heart,
  CreditCard,
} from "lucide-react";

export default function MyProfile() {
  // State for user data
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Form states
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    address: {
      name: "",
      phone: "",
      houseNo: "",
      area: "",
      landmark: "",
      pincode: "",
      townCity: "",
      state: "",
    },
  });

  const [otp, setOtp] = useState("");

  // Alert state
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetch user data from localStorage on component mount
  useEffect(() => {
    const fetchUserData = () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser).data;
          setUserData(parsedUser);
          console.log(parsedUser);

          setFormData({
            _id: parsedUser._id,
            fullname: parsedUser.fullname || "",
            email: parsedUser.email || "",
            phone: parsedUser.phone || "",
            address: {
              name: parsedUser.address?.name || "",
              phone: parsedUser.address?.phone || "",
              houseNo: parsedUser.address?.houseNo || "",
              area: parsedUser.address?.area || "",
              landmark: parsedUser.address?.landmark || "",
              pincode: parsedUser.address?.pincode || "",
              townCity: parsedUser.address?.townCity || "",
              state: parsedUser.address?.state || "",
            },
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        showAlert("Failed to load user data", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Handle input changes in update form
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle update profile
  const handleUpdateProfile = async () => {
    try {
      // Example API call - replace with your actual endpoint
      const response = await axios.put(
        `${config.baseURL}/api/user/updateprofile`,
        formData
      );

      if (response.status === 200) {
        // Update local storage with new data
        localStorage.setItem(
          "user",
          JSON.stringify({
            data: {
              ...userData,
              ...formData,
            },
          })
        );

        // Update state
        setUserData((prev) => ({
          ...prev,
          ...formData,
        }));

        showAlert("Profile updated successfully", "success");
        setUpdateDialogOpen(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      showAlert("Failed to update profile", "error");
    }
  };

  // Handle forgot password
  const handleForgotPassword = async () => {
    try {
      // Example API call to send OTP
      const response = await axios.post(`${config.baseURL}/api/auth/getotp`, {
        email: userData.email,
      });

      if (response.status === 200) {
        showAlert("OTP sent to your email", "success");
        setPasswordDialogOpen(false);
        setOtpDialogOpen(true);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      showAlert("Failed to send OTP", "error");
    }
  };

  // Handle OTP verification
  const handleVerifyOtp = async () => {
    try {
      await axios.post(`${config.baseURL}/api/auth/verifyotp`, {
        email: userData.email,
        otp,
      });

      setAlert({ open: true, severity: "success", message: "OTP Verified 💖" });
      setOtpDialogOpen(false);
      setResetDialogOpen(true);
    } catch (error) {
      setAlert({ open: true, severity: "error", message: "Invalid OTP 💔" });
      console.log(error);
    }
  };

  // Handle password reset
  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setAlert({
        open: true,
        severity: "error",
        message: "Passwords do not match 💔",
      });
      return;
    }

    try {
      await axios.post(`${config.baseURL}/api/auth/reset-password`, {
        email: userData.email,
        password: newPassword,
      });

      setAlert({
        open: true,
        severity: "success",
        message: "Password reset successfully ",
      });
      setResetDialogOpen(false);
    } catch (error) {
      setAlert({
        open: true,
        severity: "error",
        message: "Failed to reset password 😢",
      });
      console.log(error);
    }
  };

  // Show alert helper
  const showAlert = (message, severity) => {
    setAlert({
      open: true,
      message,
      severity,
    });
  };

  // Handle alert close
  const handleAlertClose = () => {
    setAlert((prev) => ({
      ...prev,
      open: false,
    }));
  };

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-64">
        <CircularProgress />
      </Box>
    );
  }

  if (!userData) {
    return (
      <Box className="flex justify-center items-center h-64">
        <Typography variant="h6">No user data found. Please log in.</Typography>
      </Box>
    );
  }

  return (
    <Box className="container mx-auto px-4 py-8 mt-16">
      <Paper elevation={3} className="p-6 mb-8">
        <Typography variant="h4" className="mb-6 text-center font-bold">
          User Profile
        </Typography>

        <Box className="flex flex-col items-center mb-6">
          <Avatar
            src={userData.profilepic}
            alt={userData.fullname}
            className="w-24 h-24 mb-4"
            sx={{ width: 96, height: 96 }}
          />
          <Typography variant="h5" className="font-bold">
            {userData.fullname}
          </Typography>
          <Typography variant="body1" className="text-gray-600">
            {userData.userType}
          </Typography>
        </Box>

        <Divider className="my-6" />

        <Grid container spacing={3} className="mb-6">
          <Grid item xs={12} md={6}>
            <Card className="h-full">
              <CardContent>
                <Typography variant="h6" className="mb-4 flex items-center">
                  <User className="mr-2" size={20} />
                  Personal Information
                </Typography>

                <Box className="space-y-2">
                  <Box className="flex items-center">
                    <Mail className="mr-2 text-gray-500" size={16} />
                    <Typography variant="body1">
                      <span className="font-semibold">Email:</span>{" "}
                      {userData.email}
                    </Typography>
                  </Box>

                  <Box className="flex items-center">
                    <Phone className="mr-2 text-gray-500" size={16} />
                    <Typography variant="body1">
                      <span className="font-semibold">Phone:</span>{" "}
                      {userData.phone || "Not provided"}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card className="h-full">
              <CardContent>
                <Typography variant="h6" className="mb-4 flex items-center">
                  <Home className="mr-2" size={20} />
                  Address
                </Typography>

                {userData.address &&
                Object.values(userData.address).some((val) => val) ? (
                  <Box className="space-y-1">
                    <Typography variant="body1">
                      {userData.address.name && (
                        <span className="font-semibold">
                          {userData.address.name}
                        </span>
                      )}
                    </Typography>
                    <Typography variant="body2">
                      {[
                        userData.address.houseNo,
                        userData.address.area,
                        userData.address.landmark,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </Typography>
                    <Typography variant="body2">
                      {[
                        userData.address.townCity,
                        userData.address.state,
                        userData.address.pincode,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </Typography>
                    {userData.address.phone && (
                      <Typography variant="body2">
                        Phone: {userData.address.phone}
                      </Typography>
                    )}
                  </Box>
                ) : (
                  <Typography variant="body2" className="text-gray-500">
                    No address information provided
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card className="h-full">
              <CardContent>
                <Typography variant="h6" className="mb-4 flex items-center">
                  <Heart className="mr-2" size={20} />
                  Wishlist
                </Typography>

                {userData.wishlist && userData.wishlist.length > 0 ? (
                  <Typography variant="body2">
                    {userData.wishlist.length} items in wishlist
                  </Typography>
                ) : (
                  <Typography variant="body2" className="text-gray-500">
                    Your wishlist is empty
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card className="h-full">
              <CardContent>
                <Typography variant="h6" className="mb-4 flex items-center">
                  <CreditCard className="mr-2" size={20} />
                  Payment Methods
                </Typography>

                {userData.payments && userData.payments.length > 0 ? (
                  <Typography variant="body2">
                    {userData.payments.length} payment methods saved
                  </Typography>
                ) : (
                  <Typography variant="body2" className="text-gray-500">
                    No payment methods saved
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box className="flex justify-center space-x-4">
          <Button
            variant="contained"
            color="primary"
            startIcon={<Edit />}
            onClick={() => setUpdateDialogOpen(true)}
            className="px-6">
            Edit Details
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            startIcon={<Lock />}
            onClick={() => setPasswordDialogOpen(true)}
            className="px-6">
            Forgot Password
          </Button>
        </Box>
      </Paper>

      {/* Update Profile Dialog */}
      <Dialog
        open={updateDialogOpen}
        onClose={() => setUpdateDialogOpen(false)}
        fullWidth
        maxWidth="md">
        <DialogTitle>Update Profile</DialogTitle>
        <DialogContent>
          <Box className="space-y-4 py-4">
            <Typography variant="h6" className="mb-2">
              Personal Information
            </Typography>
            <TextField
              fullWidth
              label="Full Name"
              name="fullname"
              value={formData.fullname}
              onChange={handleInputChange}
              margin="dense"
            />

            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              margin="dense"
            />

            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              margin="dense"
            />

            <Divider className="my-4" />

            <Typography variant="h6" className="mb-2">
              Address Information
            </Typography>

            <TextField
              fullWidth
              label="Contact Name"
              name="address.name"
              value={formData.address.name}
              onChange={handleInputChange}
              margin="dense"
            />

            <TextField
              fullWidth
              label="Contact Phone"
              name="address.phone"
              value={formData.address.phone}
              onChange={handleInputChange}
              margin="dense"
            />

            <TextField
              fullWidth
              label="House/Flat Number"
              name="address.houseNo"
              value={formData.address.houseNo}
              onChange={handleInputChange}
              margin="dense"
            />

            <TextField
              fullWidth
              label="Area/Street"
              name="address.area"
              value={formData.address.area}
              onChange={handleInputChange}
              margin="dense"
            />

            <TextField
              fullWidth
              label="Landmark"
              name="address.landmark"
              value={formData.address.landmark}
              onChange={handleInputChange}
              margin="dense"
            />

            <TextField
              fullWidth
              label="Pincode"
              name="address.pincode"
              value={formData.address.pincode}
              onChange={handleInputChange}
              margin="dense"
            />

            <TextField
              fullWidth
              label="Town/City"
              name="address.townCity"
              value={formData.address.townCity}
              onChange={handleInputChange}
              margin="dense"
            />

            <TextField
              fullWidth
              label="State"
              name="address.state"
              value={formData.address.state}
              onChange={handleInputChange}
              margin="dense"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpdateDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleUpdateProfile}
            color="primary"
            variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Forgot Password Dialog */}
      <Dialog
        open={passwordDialogOpen}
        onClose={() => setPasswordDialogOpen(false)}
        fullWidth
        maxWidth="sm">
        <DialogTitle>Forgot Password</DialogTitle>
        <DialogContent>
          <Typography variant="body2" className="mb-4">
            Enter your email address to receive a one-time password (OTP).
          </Typography>
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={userData.email}
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleForgotPassword}
            color="primary"
            variant="contained">
            Send OTP
          </Button>
        </DialogActions>
      </Dialog>

      {/* OTP Verification Dialog */}
      <Dialog
        open={otpDialogOpen}
        onClose={() => setOtpDialogOpen(false)}
        fullWidth
        maxWidth="sm">
        <DialogTitle>Verify OTP</DialogTitle>
        <DialogContent>
          <Typography variant="body2" className="mb-4">
            Enter the OTP sent to your email address.
          </Typography>
          <TextField
            fullWidth
            label="One-Time Password"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOtpDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleVerifyOtp} color="primary" variant="contained">
            Verify OTP
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog
        open={resetDialogOpen}
        onClose={() => setResetDialogOpen(false)}
        fullWidth
        maxWidth="sm">
        <DialogTitle>Reset Password 🔐</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleResetPassword}
            color="primary"
            variant="contained">
            Reset Password
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alert Snackbar */}
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert onClose={handleAlertClose} severity={alert.severity}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
