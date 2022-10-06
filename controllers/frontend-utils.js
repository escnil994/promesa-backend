'use strict'

const { response } = require("express")

const Banner = require('../models/banner');

const getBanner = async(req, res = response) => {

    const title = 'Banner';

    try {

        const banner = await Banner.findOne({ title });

        if (!banner) {
            return res.status(404).json({
                ok: false,
                msg: 'No encontrado!!!'
            });
        }

        res.status(200).json({
            ok: true,
            banner
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, hable con el administrador'
        });

    }

}





module.exports = {
    getBanner
}