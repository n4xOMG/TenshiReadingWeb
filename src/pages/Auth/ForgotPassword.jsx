import { useState } from "react";
import { useDispatch } from "react-redux";
import { sendForgotPasswordMail } from "../../redux/authentication/auth.actions";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(sendForgotPasswordMail(email));
    } catch (error) {
      console.error("Error sending reset password link", error);
      alert("Error sending reset password link");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Forgot Password</h2>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required />
      <button type="submit">Send Reset Link</button>
    </form>
  );
};

export default ForgotPassword;
