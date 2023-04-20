const { User } = require("../../models");
const { cloudinaryImgUpload } = require("../../helpers");
const cloudinary = require("cloudinary").v2;

const changeData = async (
    req: {
        file: {};
        body: { email: String; name: String; phone: string };
        user: { _id: String };
    },
    res: { status: Function }
) => {
    let userAvatarURL = null;
    let userIdCloudAvatar = null;

    if (req.file) {
        const { avatarURL, idCloudAvatar } = await cloudinaryImgUpload(req);
        userAvatarURL = avatarURL;
        userIdCloudAvatar = idCloudAvatar;
    }

    const { email, name, phone } = req.body;
    const { _id } = req.user;
    let result;
    result = await User.findByIdAndUpdate(_id, req.body, { new: true });

    if (userAvatarURL) {
        const user = await User.findOne({ _id });
        if (user.idCloudAvatar) {
            await cloudinary.uploader.destroy(user.idCloudAvatar, {
                folder: "images",
            });
        }

        result = await User.findByIdAndUpdate(
            _id,
            { avatarURL: userAvatarURL, idCloudAvatar: userIdCloudAvatar },
            { new: true }
        );
    }

    res.status(200).json({
        user: {
            name,
            email,
            phone,
            avatarURL: userAvatarURL,
        },
    });
};

module.exports = changeData;
