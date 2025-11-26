import { z } from 'zod';

export const resourceSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    category: z.string().min(1, 'Category is required'),
    department: z.string().min(1, 'Department is required'),
    semester: z.string().optional(),
    course: z.string().optional(),
    fileUrl: z.string().optional(),
    externalUrl: z.string().url('Invalid external URL').optional(),
    tags: z.string().optional(),
    author: z.string().optional(),
    year: z.number().optional(),
    format: z.string().optional(),
    coverImage: z.string().optional(),
    abstract: z.string().optional(),
    fileSize: z.string().optional(),
}).refine(data => data.fileUrl || data.externalUrl, {
    message: "Either a file upload or an external URL is required",
    path: ["fileUrl", "externalUrl"],
});

export const semesterSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    value: z.string().min(1, 'Value is required'),
    description: z.string().optional(),
    order: z.number().int(),
    isActive: z.boolean().optional(),
});

export const featureSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    icon: z.string().min(1, 'Icon name is required'),
    link: z.string().optional(),
    coverImage: z.string().optional(),
    isActive: z.boolean().optional(),
});
