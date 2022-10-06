'use strict'

const { model, Schema } = require('mongoose');

const commentSchema = Schema({
    comment: {
        type: String,
        require: true,
        minlength: 20
    },
    status: {
        type: Boolean,
        default: false
    },
    created: {
        type: Date,
        require: true
    },
    lastEdit: {
        type: Date,
        require: true
    },
    user: {
        require: true,
        type: Schema.Types.ObjectId,
        ref: 'Users'
    }
})


commentSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('comments', commentSchema);