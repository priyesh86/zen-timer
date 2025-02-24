"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { differenceInSeconds, addSeconds, format } from "date-fns";

export type ScheduleItem = {
  time: string;
  event: string;
};

type SessionControllerProps = {
  schedule: ScheduleItem[];
  onCancel: () => void;
};

type SessionState = {
  currentIndex: number;
  timeRemaining: number;
  isRunning: boolean;
};

export function SessionController({
  schedule,
  onCancel,
}: SessionControllerProps) {
  const [sessionState, setSessionState] = useState<SessionState>({
    currentIndex: 0,
    timeRemaining: 0,
    isRunning: false,
  });

  const currentEvent = schedule[sessionState.currentIndex];

  // Calculate duration for current event
  const getEventDuration = (index: number) => {
    if (index >= schedule.length - 1) return 0;
    const current = schedule[index];
    const next = schedule[index + 1];
    return differenceInSeconds(
      new Date(`1970-01-01T${next.time}`),
      new Date(`1970-01-01T${current.time}`)
    );
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (sessionState.isRunning) {
      interval = setInterval(() => {
        setSessionState((prev) => {
          if (prev.timeRemaining <= 0) {
            // Move to next event
            const nextIndex = prev.currentIndex + 1;
            if (nextIndex >= schedule.length) {
              // Session complete
              return { ...prev, isRunning: false };
            }
            return {
              ...prev,
              currentIndex: nextIndex,
              timeRemaining: getEventDuration(nextIndex),
            };
          }
          return { ...prev, timeRemaining: prev.timeRemaining - 1 };
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [sessionState.isRunning, schedule]);

  const startSession = () => {
    setSessionState({
      currentIndex: 0,
      timeRemaining: getEventDuration(0),
      isRunning: true,
    });
  };

  const stopSession = () => {
    setSessionState((prev) => ({ ...prev, isRunning: false }));
    onCancel();
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getProgressPercentage = () => {
    const totalEvents = schedule.length;
    return ((sessionState.currentIndex + 1) / totalEvents) * 100;
  };

  return (
    <div className="space-y-8">
      <div className="rounded-lg border p-6 text-center">
        <div className="mb-4">
          <h2 className="text-2xl font-bold">{currentEvent?.event}</h2>
          <div className="mt-2 text-4xl font-mono">
            {formatTime(sessionState.timeRemaining)}
          </div>
        </div>

        <div className="mt-4 space-x-4">
          {!sessionState.isRunning ? (
            <Button onClick={startSession}>Start Session</Button>
          ) : (
            <Button variant="destructive" onClick={stopSession}>
              Cancel Session
            </Button>
          )}
        </div>
      </div>

      {/* New Progress and Schedule Display */}
      {sessionState.isRunning && (
        <div className="rounded-lg border p-6">
          {/* Overall Progress Bar */}
          <div className="mb-6">
            <div className="mb-2 flex justify-between text-sm text-gray-600">
              <span>Progress</span>
              <span>{Math.round(getProgressPercentage())}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-300"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
          </div>

          {/* Schedule Timeline */}
          <div className="space-y-2">
            <h3 className="font-semibold">Session Timeline</h3>
            <div className="space-y-1">
              {schedule.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between rounded-md p-2 transition-colors ${
                    index === sessionState.currentIndex
                      ? "bg-blue-50 border border-blue-200"
                      : index < sessionState.currentIndex
                        ? "text-gray-500"
                        : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        index === sessionState.currentIndex
                          ? "bg-blue-500"
                          : index < sessionState.currentIndex
                            ? "bg-gray-400"
                            : "bg-gray-300"
                      }`}
                    />
                    <span className="font-mono text-sm">{item.time}</span>
                  </div>
                  <span
                    className={`${
                      index === sessionState.currentIndex ? "font-medium" : ""
                    }`}
                  >
                    {item.event}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Prompts for different phases */}
      {sessionState.isRunning && (
        <div className="rounded-lg border p-6">
          {currentEvent?.event === "Intention Setting" && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Set Your Intention</h3>
              <p>Take a moment to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Consider what you want to achieve in this sprint</li>
                <li>Write down your main goal</li>
                <li>Take a few deep breaths</li>
              </ul>
            </div>
          )}

          {currentEvent?.event === "Reflection" && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Reflect on Your Sprint</h3>
              <p>Consider:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>What did you accomplish?</li>
                <li>What challenges did you face?</li>
                <li>What will you focus on in the next sprint?</li>
              </ul>
            </div>
          )}

          {currentEvent?.event.includes("Break") && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Take a Break</h3>
              <p>Remember to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Stand up and stretch</li>
                <li>Rest your eyes</li>
                <li>Take a few deep breaths</li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
