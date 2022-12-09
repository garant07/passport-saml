const fs = require("fs");
const SamlStrategy = require("passport-saml").Strategy;
const uuIdpCert = fs.readFileSync("cert.pem","utf-8");

const samlStrat = new SamlStrategy(
    {
        callbackUrl: process.env.SAML_CALLBACK_LOGIN,
        entryPoint: process.env.SAML_ENTRYPOINT,
        logoutCallbackUrl: process.env.SAML_CALLBACK_LOGOUT,
        logoutUrl: process.env.SAML_LOGOUT,
        issuer: process.env.SAML_ISSUER,
        cert: uuIdpCert,
        passReqToCallback: true
    },
    (req:any, profile:any, done:any) => {

        const userData = {
            email: profile.email,
            displayName: profile.displayName,
            nameID: profile.nameID,
            nameIDFormat: profile.nameIDFormat
        }
        req.user = userData;
        return done(null, userData);
    }
);

module.exports = {
    samlStrat
}