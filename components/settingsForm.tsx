"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

import { SettingsSchema } from "@/lib/schemas";

type SettingsFormValues = z.infer<typeof SettingsSchema>;

export function SettingsForm() {
  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      session: "01:00:00", // 1 hour
      sprint: "00:20:00", // 20 minutes
      bell: "00:05:00",
      intentionSetting: "00:05:00",
      reflection: "00:05:00",
      regularBreak: "00:05:00",
      longerBreak: "00:20:00",
    },
  });

  async function onSubmit(values: z.infer<typeof SettingsSchema>) {
    // do something - calculate session, etc
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="session"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total length of session</FormLabel>
              <FormDescription>
                How long do you want to work for?
              </FormDescription>
              <FormControl>
                <Input
                  type="time"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value + ":00")} // Ensure HH:MM:SS format
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sprint"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sprint time</FormLabel>
              <FormDescription>
                How long do you want each sprint to last?
              </FormDescription>
              <FormControl>
                <Input
                  type="time"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value + ":00")} // Ensure HH:MM:SS format
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bell"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bell intervals</FormLabel>
              <FormDescription>
                How far apart do you want the bells to chime?
              </FormDescription>
              <FormControl>
                <Input
                  type="time"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value + ":00")} // Ensure HH:MM:SS format
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="intentionSetting"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Intention setting</FormLabel>
              <FormControl>
                <Input
                  type="time"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value + ":00")} // Ensure HH:MM:SS format
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="reflection"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reflection time</FormLabel>
              <FormControl>
                <Input
                  type="time"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value + ":00")} // Ensure HH:MM:SS format
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="regularBreak"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Regular break time</FormLabel>
              <FormControl>
                <Input
                  type="time"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value + ":00")} // Ensure HH:MM:SS format
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="longerBreak"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Longer break time</FormLabel>
              <FormControl>
                <Input
                  type="time"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value + ":00")} // Ensure HH:MM:SS format
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="backgroundSound"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <FormLabel>Background breathing drone</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange} // FIX: styling - related to tailwind config and theme colours
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">Calculate session</Button>
      </form>
    </Form>
  );
}
