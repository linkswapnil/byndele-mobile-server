const express = require("express");
const cors = require("cors");
// RECOVERY CODE TWILIO = 9QM684BHZECA5DFDCA4QABKD
// 2cb6f8bbd880495ae6c0256b53ca80af

// Download the helper library from https://www.twilio.com/docs/node/install
// Set environment variables for your credentials
// Read more at http://twil.io/secure
const accountSid = "AC4daec00bf32bf19127b6bff0f81bc328";
const authToken = "2cb6f8bbd880495ae6c0256b53ca80af";
const verifySid = "VA3806fbd15154caddea40f5b3ae3601ab";
const client = require("twilio")(accountSid, authToken);

const app = express();
const PORT = 5050;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Node Server Working"));

app.post("/generateOtp", (req, res) => {
    const phoneNumber = req.body.phoneNumber;

    client.verify.v2
        .services(verifySid)
        .verifications.create({ to: phoneNumber, channel: "sms" })
        .then((verification) => {
            console.log("verification:::", verification);
            if(verification){
                res.send({ msg: "OTP sent successfully", status: verification.status });
            }
        }).catch((error) => {
            console.log("Error:::", error);
            res.send({ msg: "Failed to send OTP", error });
        });
})

app.post("/validateOtp", (req, res) => {
    const phoneNumber = req.body.phoneNumber;
    const otp = req.body.otp;

    client.verify.v2
        .services(verifySid)
        .verificationChecks.create({ to: phoneNumber, code: otp })
        .then((verification_check) => {
            console.log("verification_check:::", verification_check);
            if(verification_check){
                res.send({ msg: "OTP validated successfully", status: verification_check.status });
            }
        }).catch((error) => {
            console.log("Error:::", error);
            res.send({ msg: "Failed to validate OTP", error });
        });
})

app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
