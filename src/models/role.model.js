const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'Role';
const COLLECTION_NAME = 'Roles';

const grants = [
	{
		role: 'admin',
		resource: 'profile',
		actions: 'update:any',
		attributes: '*',
	},
];

const RoleSchema = new Schema({
	rol_name: { types: String, default: 'user', enum: ['user', 'shop', 'admin'] },
	rol_slug: { type: String, required: true },
	rol_status: {
		type: String,
		default: 'active',
		enum: ['active', 'pending', 'block'],
	},
	rol_description: { type: String, default: '' },
	rol_grants: [
		{
			resource: { type: Schema.Types.ObjectId, ref: 'Resource' },
			actions: [{ type: String, required: true }],
			attributes: { type: String, default: '*' },
		},
	],
});

module.exports = model(DOCUMENT_NAME, RoleSchema);
