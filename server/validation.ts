import { z } from 'zod';
const optionalText = (max: number) => z.string().trim().max(max).optional().default('');
export const inquirySchema = z.object({
  name: z.string().trim().min(2, 'Enter your name.').max(100),
  phone: z.string().trim().transform(v => v.replace(/[\s()-]/g, '')).refine(v => /^(?:\+91)?[6-9]\d{9}$/.test(v), 'Enter an Indian mobile number (10 digits, with optional +91).').transform(v => v.startsWith('+91') ? v : `+91${v}`),
  email: z.union([z.literal(''), z.email().max(254)]).optional().default(''),
  interest: z.enum(['communities','schools','academies','one-to-one']),
  locality: z.string().trim().min(2, 'Enter your area in Bangalore.').max(120),
  learnerName: optionalText(100), ageGroup: z.enum(['','under-12','12-17','adult']).optional().default(''),
  institution: optionalText(160), message: optionalText(2000),
  consent: z.literal(true, { error: 'Please agree to be contacted about this inquiry.' }),
  website: optionalText(200),
}).strict().superRefine((v, ctx) => {
  if (['communities','schools','academies'].includes(v.interest) && !v.institution)
    ctx.addIssue({ code: 'custom', path: ['institution'], message: 'Enter the community, school or academy name.' });
});
export type InquiryInput = z.infer<typeof inquirySchema>;
