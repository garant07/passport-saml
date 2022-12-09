import { Response, Router } from 'express';

module.exports = function(router: Router, passport:any, bodyParser:any, samlStrat: any) {

    router.get('/login', passport.authenticate('saml', { scope: ["profile", "email"] }));

    router.post(
        "/login/callback",
        bodyParser.urlencoded({ extended: false }),
        passport.authenticate('saml'),
        function (req, res) {
            const uri:string = `${process.env.REDIRECT_URI}`;
            res.redirect(uri);
        }
    );

    router.get("/protected", (req: any, res: Response) => {
        if(req.user){
            res.send({ error: false, data: req.user });
        } else {
            res.send({ error: true, data: 'user not found.' });
        }
    });

    router.get("/logout/callback", (req: any, res:Response) => {
        const uri:string = `${process.env.REDIRECT_URI}`;
        res.redirect(uri);
    });

    router.get("/logout", (req:any, res:any) => {
        return samlStrat.logout(req, (err:any, request:any) => {
            if(!err){
                res.redirect(request);
                delete req.session.passport;
            }
        });
    });

}