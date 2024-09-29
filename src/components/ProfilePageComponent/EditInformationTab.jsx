import { Button, Card, CardActions, CardContent, CardHeader, TextField } from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateUserProfile } from "../../redux/authentication/auth.actions";
import LoadingSpinner from "../LoadingSpinner";
export default function EditInformationTab({ user }) {
  const [name, setName] = useState(user.username ? user.username : "");
  const [email, setEmail] = useState(user.email ? user.email : "");
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const reqData = { data: { username: name, email: email } };
      await dispatch(updateUserProfile(reqData));
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Card>
          <CardHeader title="Edit Profile" subheader="Update your profile information." />
          <CardContent sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
            <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
          </CardContent>
          <CardActions>
            <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
              Save Changes
            </Button>
          </CardActions>
        </Card>
      )}
    </>
  );
}
