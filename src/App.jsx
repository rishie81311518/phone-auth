import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useState } from "react";
import "./App.css";
import { authentication } from "./firebase-config";

function App() {
  //country code
  const countryCode = "+91";
  // phone number state
  const [phoneNumber, setPhoneNumber] = useState(countryCode);
  const [expandForm, setExpandForm] = useState(false);
  const [OTP, setOTP] = useState("");

  const generateRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      authentication,
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response) => {
          // requestOTP();
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        },
      }
    );
  };

  const requestOTP = (e) => {
    e.preventDefault();
    if (phoneNumber.length >= 12) {
      setExpandForm(true);
      generateRecaptcha();
      let appVerifier = window.recaptchaVerifier;
      signInWithPhoneNumber(authentication, phoneNumber, appVerifier)
        .then((confirmationResult) => {
          window.confirmationResult = confirmationResult;
        })
        .catch((error) => {
          // Error: SMS not sent
          console.log(error);
        });
    }
  };

  const verifyOTP = (e) => {
    let otp = e.target.value;
    setOTP(otp);

    if (otp.length === 6) {
      let confirmationResult = window.confirmationResult;
      confirmationResult
        .confirm(otp)
        .then((result) => {
          const user = result.user;
          console.log(user);
        })
        .catch((error) => {});
    }
  };

  return (
    <div className="formContainer">
      <form onSubmit={requestOTP}>
        <h1>Sign in with phone number</h1>
        <div className="mb-3">
          <label htmlFor="phoneNumberInput" className="form-label">
            Phone number
          </label>
          <input
            type="tel"
            className="form-control"
            id="phoneNumberInput"
            aria-describedby="emailHelp"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          ></input>
          <div id="phoneNumberHelp" className="form-text">
            Please enter your phone number
          </div>
        </div>
        {expandForm === true ? (
          <>
            <div className="mb-3">
              <label htmlFor="otpInput" className="form-label">
                OTP
              </label>
              <input
                type="number"
                className="form-control"
                id="otpInput"
                value={OTP}
                onChange={verifyOTP}
              ></input>
              <div id="otpHelp" className="form-text">
                Please enter the one time pin set to your phone number{" "}
              </div>
            </div>
          </>
        ) : null}
        {expandForm === false ? (
          <button type="submit" className="btn btn-primary">
            Request OTP{" "}
          </button>
        ) : null}
        <div id="recaptcha-container"></div>
      </form>
    </div>
  );
}

export default App;
