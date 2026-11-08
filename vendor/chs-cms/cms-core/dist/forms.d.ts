import { z } from 'zod';
export declare const FORM_FIELD_TYPES: readonly ["text", "email", "textarea", "select", "checkbox", "radio", "phone", "hidden"];
export type FormFieldType = (typeof FORM_FIELD_TYPES)[number];
export declare const formFieldTypeSchema: z.ZodEnum<{
    text: "text";
    hidden: "hidden";
    textarea: "textarea";
    email: "email";
    select: "select";
    checkbox: "checkbox";
    radio: "radio";
    phone: "phone";
}>;
export declare const formFieldValidationSchema: z.ZodObject<{
    minLength: z.ZodOptional<z.ZodNumber>;
    maxLength: z.ZodOptional<z.ZodNumber>;
    pattern: z.ZodOptional<z.ZodString>;
    min: z.ZodOptional<z.ZodNumber>;
    max: z.ZodOptional<z.ZodNumber>;
    accept: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type FormFieldValidation = z.infer<typeof formFieldValidationSchema>;
export declare const formFieldDefinitionSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodEnum<{
        text: "text";
        hidden: "hidden";
        textarea: "textarea";
        email: "email";
        select: "select";
        checkbox: "checkbox";
        radio: "radio";
        phone: "phone";
    }>;
    label: z.ZodString;
    key: z.ZodString;
    placeholder: z.ZodOptional<z.ZodString>;
    required: z.ZodDefault<z.ZodBoolean>;
    helperText: z.ZodOptional<z.ZodString>;
    validation: z.ZodDefault<z.ZodObject<{
        minLength: z.ZodOptional<z.ZodNumber>;
        maxLength: z.ZodOptional<z.ZodNumber>;
        pattern: z.ZodOptional<z.ZodString>;
        min: z.ZodOptional<z.ZodNumber>;
        max: z.ZodOptional<z.ZodNumber>;
        accept: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    options: z.ZodOptional<z.ZodArray<z.ZodString>>;
    defaultValue: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export type FormFieldDefinition = z.infer<typeof formFieldDefinitionSchema>;
export declare const formSettingsSchema: z.ZodObject<{
    submitButtonText: z.ZodDefault<z.ZodString>;
    successMessage: z.ZodDefault<z.ZodString>;
    notificationEmail: z.ZodOptional<z.ZodString>;
    redirectUrl: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type FormSettings = z.infer<typeof formSettingsSchema>;
export declare const formSettingsDefaults: FormSettings;
export declare const formDefinitionSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    fields: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        type: z.ZodEnum<{
            text: "text";
            hidden: "hidden";
            textarea: "textarea";
            email: "email";
            select: "select";
            checkbox: "checkbox";
            radio: "radio";
            phone: "phone";
        }>;
        label: z.ZodString;
        key: z.ZodString;
        placeholder: z.ZodOptional<z.ZodString>;
        required: z.ZodDefault<z.ZodBoolean>;
        helperText: z.ZodOptional<z.ZodString>;
        validation: z.ZodDefault<z.ZodObject<{
            minLength: z.ZodOptional<z.ZodNumber>;
            maxLength: z.ZodOptional<z.ZodNumber>;
            pattern: z.ZodOptional<z.ZodString>;
            min: z.ZodOptional<z.ZodNumber>;
            max: z.ZodOptional<z.ZodNumber>;
            accept: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        options: z.ZodOptional<z.ZodArray<z.ZodString>>;
        defaultValue: z.ZodOptional<z.ZodString>;
        sortOrder: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>>;
    settings: z.ZodDefault<z.ZodObject<{
        submitButtonText: z.ZodDefault<z.ZodString>;
        successMessage: z.ZodDefault<z.ZodString>;
        notificationEmail: z.ZodOptional<z.ZodString>;
        redirectUrl: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    createdAt: z.ZodOptional<z.ZodString>;
    updatedAt: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type FormDefinition = z.infer<typeof formDefinitionSchema>;
export declare const formResponseSchema: z.ZodObject<{
    id: z.ZodString;
    formId: z.ZodString;
    data: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    submittedAt: z.ZodString;
    ip: z.ZodOptional<z.ZodString>;
    spam: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export type FormResponse = z.infer<typeof formResponseSchema>;
