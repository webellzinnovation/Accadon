import { z } from 'zod';
const optionalText = (max: number) => z.string().trim().max(max).optional().default('');
export const inquirySchema = z.object({
  name: z.string().trim().min(2, 'Enter your name.').max(100),
  phone: z.string().trim().transform(v => v.replace(/[\s()-]/g, '')).refine(v => /^(?:\+91)?[6-9]\d{9}$/.test(v), 'Enter an Indian mobile number (10 digits, with optional +91).').transform(v => v.startsWith('+91') ? v : `+91${v}`),
  email: z.union([z.literal(''), z.email().max(254)]).optional().default(''),
  interest: z.enum(['tournaments','coaching','both']),
  city: z.string().trim().min(2, 'Enter your city.').max(120),
  academyName: z.string().trim().min(2, 'Enter your academy or club name.').max(160),
  sport: z.string().trim().min(2, 'Enter your sport or sports.').max(120),
  role: z.string().trim().min(2, 'Enter your role at the academy.').max(80),
  message: optionalText(2000),
  consent: z.literal(true, { error: 'Please agree to be contacted about this inquiry.' }),
  website: optionalText(200),
}).strict();
export type InquiryInput = z.infer<typeof inquirySchema>;
