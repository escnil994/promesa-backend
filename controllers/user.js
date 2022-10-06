'use strict'

const { response } = require("express");

const bcrypt = require('bcryptjs');

const uuid = require('uuid')

const cloudinary = require("../utils/cloudinary");

const { generateToken } = require('../helpers/jwt')

const User = require('../models/user');




const getUsers = async(req, res = response) => {

    const from = Number(req.query.from) || 0;

    const [users, total] = await Promise.all([
        User.find({}, 'name last_name genre phone whatsapp direction dui email google image role commented')
        .skip(from)
        .limit(6),
        User.countDocuments()
    ]);


    res.status(200).json({
        ok: true,
        users,
        total
    });
}

const getUser = async(req, res = response) => {

    const id = req.params.id;


    try {
        const userFound = await User.findOne({ _id: id });

        if (!userFound) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario no encontrado'
            });
        }


        res.status(200).json({
            ok: true,
            userFound
        })


    } catch (error) {
      console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }

}

const createUser = async(req, res = response) => {

    const { email, password } = req.body;

    try {
        const emailExists = await User.findOne({ email });


        if (emailExists) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe un usuario con este email'
            });
        }

        const user = new User(req.body);

        //encrypt password

        bcrypt.genSaltSync();

        user.password = bcrypt.hashSync(password);

        //Generate code
        const code = uuid.v4();

        user.code = code + '-' + user.name;


        //Save user
        const userSaved = await user.save();

        const token = await generateToken(userSaved._id);


        res.status(200).json({
            ok: true,
            token,
            'Ususario creado': userSaved
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, hable con el administrador'
        });
    }
}

const updateUser = async(req, res = response) => {

    const id = req.params.id;

    try {

        const userFound = await User.findById(id);


        if (!userFound) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no existe'
            });
        }

        const { name , last_name, dui, phone, direction, whatsapp , genre, email, role, ...fields } = req.body;

        if (userFound.email !== email) {
          return res.status(404).json({
            ok: false,
            msg: 'Por motivos de seguridad el correo no puede ser modificado'
          })
        }

        if (userFound.email !== email) {

            const exist = await User.findOne({ email });
            if (exist) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Ya existe un usuario con este email'
                });

            }
        }

        if (userFound.dui !== dui) {

            const exist = await User.findOne({ dui });
            if (exist) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Ya existe un usuario con este dui'
                });

            }
        }

        if (!userFound.google) {

            fields.email = email;

        } else if (userFound.email !== email) {

            return res.status(404).json({
                ok: false,
                msg: 'Usuarios con autentificacion de google no pueden cambiar email'
            });
        }

        const userUpdated = await User.findByIdAndUpdate(id, { name , last_name, dui, phone, direction, whatsapp , genre, email, role }, { new: true, useFindAndModify: false });

        res.status(200).json({
            ok: true,
            'Usuario actualizado': userUpdated
        });


    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, hable con el administrador'
        });

    }


}


const deleteUser = async(req, res = response) => {

    const id = req.params.id;

    try {

        const userFound = await User.findById(id);

        if (!userFound) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe'
            });
        }

        //Delete user

        const userDeleted = await User.findByIdAndDelete(id);

        await cloudinary.uploader.destroy(userDeleted.cloudinary_id)


        res.status(200).json({
            ok: true,
            'Usuario eliminado: ': userDeleted
        })


    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado, hablar con el administrador'
        })
    }
}


const updatePassword = async(req, res = response) => {

  const param = req.params.param;


  const { password } = req.body;

  try {
    if (!password) {
      return res.status(404).json({
        ok:false,
        msg: 'Debes escribir una contraseña',
      })
    }
    const userFound = await User.findOne({ code: param });

    if (!userFound) {
      return res.status(404).json({
        ok:false,
        msg: 'Esta url no existe',
      })

    }

    //Generate code to update
    const code = uuid.v4() + '-' + userFound.name;


    const id = userFound._id;
    bcrypt.genSaltSync();
    const pass= bcrypt.hashSync(password);

    const passwordUpdated = await User.findByIdAndUpdate(id, {password: pass, changePassword: false, code }, { new: true, useFindAndModify: false});

    res.status(200).json({
      ok: true,
      msg: 'La contraseña se a cambiado satisfactoriamente'
    })

      } catch (e) {

    console.log(e);

  }
}

const getUserByPass = async(req, res = response) => {

    const pass = req.params.pass;


    try {
        const userFound = await User.findOne({ code: pass });


        if (!userFound || !userFound.changePassword) {
            return res.status(404).json({
                ok: false,
                msg: 'Este enlace ya expiró, o no existe'
            });
        }

          return res.status(200).json({
              ok: true,
          });


    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }

}



module.exports = {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    updatePassword,
    getUserByPass
}
