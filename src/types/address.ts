import { z } from "zod";

export const US_STATES = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "DC", name: "District of Columbia" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
] as const;

const US_STATE_CODES = US_STATES.map((state) => state.code) as [string, ...string[]];

export const AddressSchema = z.object({
  full_name: z.string().trim().min(1, { message: "Full name is required" }).max(100),
  address_1: z.string().trim().min(1, { message: "Address is required" }).max(200),
  address_2: z.string().trim().max(200).optional().or(z.literal("")),
  city: z.string().trim().min(1, { message: "City is required" }).max(100),
  state: z.enum(US_STATE_CODES, { message: "Select a state" }),
  zip_code: z.string().trim().regex(/^\d{5}(-\d{4})?$/, { message: "Invalid ZIP code" }),
  is_default: z.boolean(),
});

export type AddressData = z.infer<typeof AddressSchema>;

export type Address = {
  id: string;
  user_id: string;
  full_name: string;
  address_1: string;
  address_2: string | null;
  city: string;
  state: string;
  zip_code: string;
  is_default: boolean;
  created_at: string;
};
