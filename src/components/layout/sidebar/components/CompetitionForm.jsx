// CompetitionForm.js
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@nextui-org/react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const competitionSchema = z.object({
  name: z.string().min(1, "Competition name is required"),
});

export default function CompetitionForm({ onSubmit }) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(competitionSchema),
    defaultValues: {
      name: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            type="text"
            placeholder="Competition Name"
            className="text-white"
          />
        )}
      />
      {errors.name && (
        <span className="text-danger text-sm">{errors.name.message}</span>
      )}
      <div className="flex justify-center gap-2">
        <Button type="submit" color="primary" className="w-full">
          Create
        </Button>
      </div>
    </form>
  );
}
