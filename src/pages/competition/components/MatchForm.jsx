import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

// Zod schema for validation
const matchSchema = z.object({
  week: z.string().min(1, "Week is required"),
  day: z.string().min(1, "Day is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
});

export default function MatchForm({ onSubmit }) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(matchSchema),
    defaultValues: {
      week: "",
      day: "",
      date: "",
      time: "",
    },
  });

  // Creating options for weeks and days
  const weeks = Array.from({ length: 4 }, (_, i) => ({
    value: (i + 1).toString(),
    label: `Week ${i + 1}`,
  }));

  const days = Array.from({ length: 7 }, (_, i) => ({
    value: (i + 1).toString(),
    label: `Day ${i + 1}`,
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {/* Week Input */}
      <Controller
        name="week"
        control={control}
        render={({ field }) => (
          <>
            <Select
              {...field}
              label="Week"
              placeholder="Select week..."
              status={errors.week ? "error" : "default"}
              aria-label="Select Week"
              className="w-full"
            >
              <SelectItem value="" disabled>
                Select week...
              </SelectItem>
              {weeks.map((week) => (
                <SelectItem key={week.value} value={week.value}>
                  {week.label}
                </SelectItem>
              ))}
            </Select>
            {errors.week && (
              <span className="text-danger text-sm">{errors.week.message}</span>
            )}
          </>
        )}
      />

      {/* Day Input */}
      <Controller
        name="day"
        control={control}
        render={({ field }) => (
          <>
            <Select
              {...field}
              label="Day"
              placeholder="Select day..."
              status={errors.day ? "error" : "default"}
              aria-label="Select Day"
              className="w-full"
            >
              <SelectItem value="" disabled>
                Select day...
              </SelectItem>
              {days.map((day) => (
                <SelectItem key={day.value} value={day.value}>
                  {day.label}
                </SelectItem>
              ))}
            </Select>
            {errors.day && (
              <span className="text-danger text-sm">{errors.day.message}</span>
            )}
          </>
        )}
      />

      {/* Date Input */}
      <Controller
        name="date"
        control={control}
        render={({ field }) => (
          <>
            <Input
              {...field}
              type="date"
              label="Date"
              placeholder="Select date..."
              fullWidth
              className="text-gray-600"
            />
            {errors.date && (
              <span className="text-danger text-sm">{errors.date.message}</span>
            )}
          </>
        )}
      />

      {/* Time Input */}
      <Controller
        name="time"
        control={control}
        render={({ field }) => (
          <>
            <Input
              {...field}
              type="time"
              label="Time"
              placeholder="Select time..."
              fullWidth
              className="text-gray-600"
            />
            {errors.time && (
              <span className="text-danger text-sm">{errors.time.message}</span>
            )}
          </>
        )}
      />

      {/* Submit Button */}
      <Button type="submit" color="primary" className="w-full">
        Submit
      </Button>
    </form>
  );
}