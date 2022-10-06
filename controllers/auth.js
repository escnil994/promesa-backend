'use strict'

const { response } = require('express');

const bcryptjs = require('bcryptjs');

const User = require('../models/user');

const uuid = require('uuid')

const nodemailer = require('nodemailer');

const { google } = require('googleapis');



const { generateToken } = require('../helpers/jwt');

const { googleVerify } = require('../helpers/google-verify');

const { getMenuFrontEnd } = require('../helpers/menu-frontend');

const login = async (req, res = response) => {

    const { email, password } = req.body;

    try {
        const userDB = await User.findOne({ email });

        if (!userDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no existe'
            });
        }

        const validPassword = bcryptjs.compareSync(password, userDB.password);

        if (!validPassword) {
            return res.status(404).json({
                ok: false,
                msg: 'Contraseña incorrecta'
            });
        }

        //everything is OK

        const token = await generateToken(userDB.id);


        res.status(200).json({
            ok: true,
            token,
            menu: getMenuFrontEnd(userDB.role)

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            ok: false,
            mag: 'Error inesperado, habla con el administrador'
        });

    }
}

const googleSignIn = async (req, res = response) => {

    const googleToken = req.body.token;

    try {

        const { name, email, picture } = await googleVerify(googleToken);

        const userDB = await User.findOne({ email });
        let user;
        const code = uuid.v4();


        if (!userDB) {
            //if user doesn't exist
            user = new User({
                name,
                email,
                code,
                image: picture,
                password: '@@@',
                google: true
            });

        } else {
            //User exist
            user = userDB;
            user.google = true;
        }

        //Save in BD

        const userSaved = await user.save();


        //Generate token

        const token = await generateToken(user.id);


        res.json({
            ok: true,
            msg: 'Google SignIn',
            token,
            menu: getMenuFrontEnd(user.role)

        });

    } catch (error) {
        res.json({
            ok: false,
            msg: 'Token is not correct'
        });

    }

}


const tokenRenew = async (req, res = response) => {

    const uid = req.uid;


    const token = await generateToken(uid);

    const user = await User.findById(uid);

    if (!user) {
        return res.status(404).json({
            ok: false,
            msg: 'User not found'
        });
    }


    res.status(200).json({
        ok: true,
        token,
        user,
        menu: getMenuFrontEnd(user.role)
    });
}


const recoverPassword = async (req, res = response) => {

    const { email } = req.body;



    try {
        var userFound = await User.findOne({ email });



        if (!userFound) {
            return res.status(400).json({
                ok: false,
                msg: `Lo siento pero no podemos encontrar un usuario con este email (${email})`
            })
        }



        var contentHTML = `
    <div style="width: auto; margin: 20px; text-align: center; font-family: Arial, Helvetica, sans-serif; font-weight: bold;">
        <h1>Hola  ${userFound.name}</h1>
        <h4>Hemos recibido la solicitud de recuparción de contraseña</h4>



        <br>
        <br>
        <span>Al abrir el siguiente enlace podras cambiarla</span>
        <br>
        <br>

        <a href="http://localhost:4200/promesa/user/error/recover/${userFound.code}" style="color: red;"><strong>Cambiar mi contraseña</strong></a>

        <br><br><br>

        <span>Si tienes otro problema, no dudes en contactarnos</span>

        <br><br>

        <a href="mailto:escnil994@gmail.com" style="color: green;"><strong>Correo</strong></a>
        <br><br>

        <a href="https://wa.me/50375068027" style="color: green;"><strong>Whatsapp</strong></a>
        <br><br>
        <a href="https://facebook.com/promesaelsalvador" style="color: green;"><strong>facebook</strong></a>


    <br><br>
    <br><br><br><br><br><br><br><br>



        <br>
        <br><br>

        <span style="color:#002a4a; font-size: 25px;"> Con cariño. <p style="color: #1976d2; font-weight: bold; ">Promesa El Salvador</p> </span>
        <br><br>

        <span style="fontt-size: 9px;">Este correo se ha generado automaticamente, no respondas porfavor</span>

    </div>
    `;
    } catch (e) {
        return res.status(404).json({
            ok: false,
            msg: 'Error inesperado, hable con el administrador'
        });
    }



    const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID2, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);


    oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

    try {

        const accessToken = await oAuth2Client.getAccessToken();

        const transporter = await nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: 'OAuth2', // generated ethereal user
                user: 'nilsonescobar@escnil994.com', // generated ethereal password
                clientId: process.env.CLIENT_ID2,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: accessToken
            }
        });

        await transporter.sendMail({
            from: 'recover_service@escnil994.com <nilsonescobar@escnil994.com>', // sender address
            to: email, // list of receivers
            subject: "Solicitud de recuperacion de contraseña", // Subject line
            html: contentHTML // html body
        });

        await User.findByIdAndUpdate(userFound.id, { changePassword: true }, { new: true, useFindAndModify: false});

        res.status(200).json({
            ok: true,
            msg: `Se han enviado las indicaciones a ${email}, sigalas para poder cambiar su contraseña `
        });


    } catch (error) {
        return console.log(error);
    }
}





module.exports = {
    login,
    googleSignIn,
    tokenRenew,
    recoverPassword
}
