const { model, Schema, Types } = require('mongoose');

const DOCUMENT_NAME = 'Keys';
const COLLECTION_NAME = 'Keys';

const keyTokenSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Shop',
    },
    privateKey: {
      type: String,
      required: true,
    },
    publicKey: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: DOCUMENT_NAME,
  }
);

module.exports = model(COLLECTION_NAME, keyTokenSchema);
