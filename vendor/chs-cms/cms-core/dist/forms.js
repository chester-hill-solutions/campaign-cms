import { z } from 'zod';
export const FORM_FIELD_TYPES = [
    'text',
    'email',
    'textarea',
    'select',
    'checkbox',
    'radio',
    'phone',
    'hidden',
];
export const formFieldTypeSchema = z.enum(FORM_FIELD_TYPES);
export const formFieldValidationSchema = z.object({
    minLength: z.number().int().min(0).max(10000).optional(),
    maxLength: z.number().int().min(1).max(10000).optional(),
    pattern: z.string().max(500).optional(),
    min: z.number().optional(),
    max: z.number().optional(),
    accept: z.string().max(200).optional(),
});
export const formFieldDefinitionSchema = z.object({
    id: z.string().min(1).max(64),
    type: formFieldTypeSchema,
    label: z.string().min(1).max(200),
    key: z.string().min(1).max(80),
    placeholder: z.string().max(200).optional(),
    required: z.boolean().default(false),
    helperText: z.string().max(500).optional(),
    validation: formFieldValidationSchema.default({}),
    options: z.array(z.string().min(1).max(200)).optional(),
    defaultValue: z.string().max(500).optional(),
    sortOrder: z.number().int().min(0).max(999).default(0),
});
export const formSettingsSchema = z.object({
    submitButtonText: z.string().min(1).max(80).default('Submit'),
    successMessage: z
        .string()
        .min(1)
        .max(2000)
        .default('Thank you! Your submission has been received.'),
    notificationEmail: z.string().email().max(200).optional(),
    redirectUrl: z.string().max(2000).optional(),
});
export const formSettingsDefaults = {
    submitButtonText: 'Submit',
    successMessage: 'Thank you! Your submission has been received.',
};
export const formDefinitionSchema = z.object({
    id: z.string().min(1).max(80),
    title: z.string().min(1).max(200),
    description: z.string().max(2000).optional(),
    fields: z.array(formFieldDefinitionSchema).min(1).max(100),
    settings: formSettingsSchema.default(formSettingsDefaults),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});
export const formResponseSchema = z.object({
    id: z.string().min(1).max(120),
    formId: z.string().min(1).max(80),
    data: z.record(z.string(), z.unknown()),
    submittedAt: z.string(),
    ip: z.string().max(45).optional(),
    spam: z.boolean().default(false),
});
