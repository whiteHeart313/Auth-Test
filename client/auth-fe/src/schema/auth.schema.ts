import Joi from "joi";

export const loginSchema = Joi.object({
	email: Joi.string()
		.email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
		.required(),
	password: Joi.string()
		.min(8)
		.regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&].*$/)
		.required()
		.messages({
			'string.min': 'Password must be at least 8 characters long',
			'string.pattern.base': 'Password must contain at least one letter, one number, and one special character'
		})
});

export const signUpSchema = Joi.object({
    email: Joi.string()
		.email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
		.required(),
	password: Joi.string()
		.min(8)
		.regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&].*$/)
		.required()
		.messages({
			'string.min': 'Password must be at least 8 characters long',
			'string.pattern.base': 'Password must contain at least one letter, one number, and one special character'
		}),
    name: Joi.string()
		.min(3)
		.required()
		.messages({
			'string.min': 'Name must be at least 3 characters long'
		})
})



