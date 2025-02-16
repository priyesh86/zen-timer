import { z } from "zod";

export const SettingsSchema = z.object({
  session: z.string().time(),
  sprint: z.string().time(),
  bell: z.string().time(),
  intentionSetting: z.string().time(),
  reflection: z.string().time(),
  regularBreak: z.string().time(),
  longerBreak: z.string().time(),
  backgroundSound: z.boolean(),
});
