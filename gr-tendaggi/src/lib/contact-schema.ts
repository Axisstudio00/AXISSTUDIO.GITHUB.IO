import { z } from "zod";
import { interestOptions } from "./site";

export const contactSchema = z.object({
  name: z.string().trim().min(2, { error: "Inserisci nome e cognome." }).max(100, { error: "Il nome è troppo lungo." }),
  email: z.email({ error: "Inserisci un indirizzo email valido." }).max(160),
  phone: z
    .string()
    .trim()
    .max(30, { error: "Il numero è troppo lungo." })
    .regex(/^[+()0-9\s./-]*$/, { error: "Usa solo cifre, spazi e il prefisso +." })
    .optional()
    .default(""),
  interest: z.enum(interestOptions, { error: "Scegli una categoria." }),
  message: z
    .string()
    .trim()
    .min(10, { error: "Raccontaci in qualche parola il tuo progetto." })
    .max(3000, { error: "Il messaggio supera i 3000 caratteri." }),
  privacy: z.literal(true, { error: "Serve il consenso per poterti rispondere." }),
  // Anti-spam: a field humans never see, and the time the form was opened.
  website: z.string().max(200).optional().default(""),
  startedAt: z.number().int().positive(),
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactField = keyof ContactInput;
