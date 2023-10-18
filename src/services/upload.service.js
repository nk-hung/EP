const cloudinary = require('../configs/cloudinary.config');

// 1. Upload image from url
const uploadImageFromUrl = async () => {
    try {
        const imageUrl = 'https://down-vn.img.susercontent.com/file/vn-50009109-439a7dda1c050473da2dfa41338a27f5';
        const folder = 'products/image'
        const res = await cloudinary.uploader.upload(imageUrl, { folder: folder });
        return res
    } catch (error) {
       console.error('Error upload image url', error)
    }
};



module.exports = {
    uploadImageFromUrl,
}
