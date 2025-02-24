"use client";

import { useState } from "react";
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
import { parse, addMinutes, format, differenceInMinutes } from "date-fns";

import { SettingsSchema } from "@/lib/schemas";

type SettingsFormValues = z.infer<typeof SettingsSchema>;

type ScheduleItem = {
  time: string;
  event: string;
};

export function generateSchedule(values: z.infer<typeof SettingsSchema>) {
  const {
    session,
    intentionSetting,
    sprint,
    reflection,
    regularBreak,
    longerBreak,
  } = values;
  const baseTime = parse("00:00:00", "HH:mm:ss", new Date());

  const getMinutes = (timeStr: string) =>
    differenceInMinutes(parse(timeStr, "HH:mm:ss", new Date()), baseTime);

  const sessionMinutes = getMinutes(session);
  const sprintCycleMinutes =
    getMinutes(intentionSetting) + getMinutes(sprint) + getMinutes(reflection);

  let currentTime = baseTime;
  const schedule = [];
  let elapsedMinutes = 0;
  let nextLongerBreak = 60;

  while (elapsedMinutes < sessionMinutes) {
    // Check if we can fit another sprint cycle
    if (elapsedMinutes + sprintCycleMinutes > sessionMinutes) {
      schedule.push({ time: format(currentTime, "HH:mm:ss"), event: "End" });
      break;
    }

    // Add sprint cycle components
    const cycle = [
      { event: "Intention Setting", duration: getMinutes(intentionSetting) },
      { event: "Sprint", duration: getMinutes(sprint) },
      { event: "Reflection", duration: getMinutes(reflection) },
    ];

    for (const { event, duration } of cycle) {
      schedule.push({ time: format(currentTime, "HH:mm:ss"), event });
      currentTime = addMinutes(currentTime, duration);
    }

    elapsedMinutes += sprintCycleMinutes;

    // Handle breaks
    const isTimeForLongerBreak =
      elapsedMinutes >= nextLongerBreak && sessionMinutes > 60;
    const breakDuration = isTimeForLongerBreak
      ? getMinutes(longerBreak)
      : getMinutes(regularBreak);

    if (elapsedMinutes + breakDuration >= sessionMinutes) {
      schedule.push({ time: format(currentTime, "HH:mm:ss"), event: "End" });
      break;
    }

    schedule.push({
      time: format(currentTime, "HH:mm:ss"),
      event: isTimeForLongerBreak ? "Longer Break" : "Regular Break",
    });

    currentTime = addMinutes(currentTime, breakDuration);
    elapsedMinutes += breakDuration;

    if (isTimeForLongerBreak) {
      nextLongerBreak += 60;
    }
  }

  return schedule;
}

export function SettingsForm() {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      session: "01:00:00",
      intentionSetting: "00:05:00",
      sprint: "00:20:00",
      reflection: "00:05:00",
      regularBreak: "00:05:00",
      longerBreak: "00:20:00",
      bell: "00:05:00",
      backgroundSound: false,
    },
  });

  async function onSubmit(values: z.infer<typeof SettingsSchema>) {
    const generatedSchedule = generateSchedule(values);
    setSchedule(generatedSchedule);
  }

  return (
    <div className="w-full max-w-2xl">
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

      {schedule.length > 0 && (
        <div className="mt-8 rounded-lg border p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Your Session Schedule</h2>
          <div className="space-y-2">
            {schedule.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-md border p-3 transition-colors hover:bg-gray-50"
              >
                <span className="font-mono text-sm text-gray-600">
                  {item.time}
                </span>
                <span
                  className={`font-medium ${
                    item.event === "Sprint"
                      ? "text-green-600"
                      : item.event.includes("Break")
                        ? "text-blue-600"
                        : item.event === "End"
                          ? "text-red-600"
                          : "text-gray-600"
                  }`}
                >
                  {item.event}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
