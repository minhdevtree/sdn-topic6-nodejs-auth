const mongoose = require('mongoose');

const { Schema } = mongoose;

// Tao cau truc du lieu cho doi tuong User
const userSchema = new Schema(
    {
        email: {
            type: String,
            required: [true, 'Email is required'],
            validate: {
                validator: function (v) {
                    return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
                },
                message: props => `${props.value} is not a valid email!`,
            },
            unique: [true, 'Email already exists'],
        },
        password: {
            type: String,
            require: [true, 'Password is required'],
            min: [8, 'Password must be at least 8 characters'],
        },
        roles: [
            {
                type: Schema.Types.ObjectId,
                ref: 'role',
            },
        ],
        type: {
            type: String,
            enum: {
                values: ['local', 'facebook', 'google'],
                message: '{VALUE} is not supported',
            },
            default: 'local',
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model('user', userSchema);
module.exports = User;
