'use strict'

const { response } = require('express');

const Comment = require('../models/comment');

const User = require('../models/user');

const newComment = async(req, res = response) => {

    const user = req.uid;

    const { comment } = req.body;

    try {
        if (!user) {
            return res.status(401).json({
                ok: false,
                msg: 'Debes loguearte primero para hacer un comentario'
            });
        }
        if (comment.length < 20) {
            return res.status(404).json({
                ok: false,
                msg: 'El commentario es muy corto'
            });
        }

        const fecha = new Date();

        const gm = fecha.getMinutes() + 30;

        fecha.setMinutes(gm)

        const lastEdit = fecha;


        const comments = await new Comment({ comment, created: new Date(), lastEdit, user })

        const commentSaved = await comments.save();

        await User.findByIdAndUpdate(user, {commented: true}, {new: true, useFindAndModify: false});

        res.status(200).json({
            ok: true,
            comment: commentSaved,
            msg: 'El comentario se a guardado exitosamente, tienes 30 minutos a partir de ahora para editarlo'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, habla con el administrador'
        });

    }

}

const getComments = async(req, res = response) => {

    const from = Number(req.query.from) || 0;

    try {
        const [comments, total] = await Promise.all([
            Comment.find({})
            .skip(from)
            .limit(5)
            .populate('user', 'name image').sort('-created'),
            Comment.countDocuments()
        ]);

        res.status(200).json({
            ok: true,
            comment: comments,
            total,
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, habla con el administrador'
        });

    }

}

const getComment = async(req, res = response) => {

    const id = req.uid;

    const comment = req.params.id;

    try {
        const commentFound = await Comment.findById(comment);

        if (!commentFound) {
            res.status(404).json({
                ok: false,
                msg: 'Commentario no encontrado'
            });
        }
        const { role } = await User.findById(id);

        if (id == commentFound.user || role == 'ADMIN') {

            return res.status(200).json({
                ok: true,
                comment: commentFound
            });
        }


        res.status(401).json({
            ok: false,
            msg: 'No tienes permiso para ver este commentario'
        })


    } catch (error) {
        res.status(404).json({
            ok: false,
            msg: 'Error inesperado, habla con el administrador'
        });
    }

}

const updateCommet = async(req, res = response) => {

    const id = req.params.id;

    try {
        const commentFound = await Comment.findById(id);

        if (!commentFound) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe este commentario'
            });
        }
        const user = req.uid;
        if (commentFound.user != user) {
            return res.status(401).json({
                ok: false,
                msg: 'No estas autorixado para modificar este commentario'
            });
        }

        if (commentFound.lastEdit < new Date()) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya no puedes modificar por que ya pasaron mas de 30 minutos desde que o creaste'
            });
        }

        const { comment } = req.body;

        if (comment.length < 20) {
            return res.status(400).json({
                ok: false,
                msg: 'El commentario es muy corto'
            });
        }

        const now = new Date();

        const commentUpdated = await Comment.findByIdAndUpdate(id, { comment, created: now, lastEdit: now }, { new: true, useFindAndModify: false })



        res.status(200).json({
            ok: true,
            comment: commentUpdated
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, habla con el administrador'
        });
    }

}

const deletecomment = async(req, res = response) => {

    const comment = req.params.id;

    const user = req.uid;

    try {

        const commentFound = await Comment.findById(comment);

        if (!commentFound) {
            res.status(404).json({
                ok: false,
                msg: 'Commentario no encontrado'
            });
        }
        const { role } = await User.findById(user);

        if ((commentFound.user == user && commentFound.lastEdit > new Date()) || role == 'ADMIN') {

            const commentDeleted = await Comment.findByIdAndDelete(comment, { useFindAndModify: false });

            return res.status(200).json({
                ok: true,
                commentDeleted
            });
        }

        return res.status(401).json({
            ok: false,
            msg: 'No puedes eliminar este comentario por que ya pasaron mas de 30 minutos despues de su creación'
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, habla con el administrador'
        });
    }
}


module.exports = {
    newComment,
    getComments,
    getComment,
    updateCommet,
    deletecomment
}
