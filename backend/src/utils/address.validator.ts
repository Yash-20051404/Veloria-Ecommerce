import { z } from 'zod';

const baseAddressSchema = {
  fullName: z.string().min(4, 'Full name must be at least 4 characters'),
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^[0-9+\- ]{7,15}$/, 'Invalid phone number format'),
  addressLine1: z.string().min(5, 'Address line 1 must be at least 5 characters'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  country: z.string().min(2, 'Country is required'),
  pincode: z.string().min(4, 'Pincode is required'),
  isDefault: z.boolean().optional()
};

export const createAddressSchema = z.object({
  body: z.object(baseAddressSchema)
});

export const updateAddressSchema = z.object({
  body: z.object({
    ...Object.fromEntries(
      Object.entries(baseAddressSchema).map(([key, schema]) => [
        key,
        schema.optional()
      ])
    )
  })
});