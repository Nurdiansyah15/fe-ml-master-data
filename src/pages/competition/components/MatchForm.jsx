import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { getAllTeams } from "../../../redux/features/teamSlice";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { fromUnixTime } from "../../../utils/timeFormator";

const matchSchema = z.object({
  week: z.string().min(1, "Week is required"),
  day: z.string().min(1, "Day is required"),
  datetime: z.string().min(1, "Datetime is required"),
  team: z.number().min(1, "Team is required"),
});

export default function MatchForm({ onSubmit, editingMatch }) {
  const { teams } = useSelector((state) => state.team);
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(matchSchema),
    defaultValues: {
      week: "",
      day: "",
      datetime: "",
      team: "",
    },
  });

  useEffect(() => {
    dispatch(getAllTeams());
  }, [dispatch]);

  useEffect(() => {
    if (editingMatch) {
      setValue("week", editingMatch.Week.toString());
      setValue("day", editingMatch.Day.toString());
      setValue("datetime", fromUnixTime(editingMatch.Date)); // Format waktu lokal
      setValue("team", editingMatch.OpponentTeamID);
    }
  }, [editingMatch, setValue]);

  const weeks = Array.from({ length: 4 }, (_, i) => ({
    value: (i + 1).toString(),
    label: `Week ${i + 1}`,
  }));

  const days = Array.from({ length: 7 }, (_, i) => ({
    value: (i + 1).toString(),
    label: `Day ${i + 1}`,
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
      <div className="mb-1">
        <label className="block mb-2">Week</label>
        <Controller
          name="week"
          control={control}
          render={({ field }) => (
            <>
              <Select
                {...field}
                placeholder="Select week..."
                status={errors.week ? "error" : "default"}
                aria-label="Select Week"
                className="w-full"
                selectedKeys={field.value ? [field.value] : []}
              >
                {weeks.map((week) => (
                  <SelectItem key={week.value} value={week.value}>
                    {week.label}
                  </SelectItem>
                ))}
              </Select>
              {errors.week && (
                <span className="text-danger text-sm">
                  {errors.week.message}
                </span>
              )}
            </>
          )}
        />
      </div>

      <div className="mb-1">
        <label className="block mb-2">Day</label>
        <Controller
          name="day"
          control={control}
          render={({ field }) => (
            <>
              <Select
                {...field}
                placeholder="Select day..."
                status={errors.day ? "error" : "default"}
                aria-label="Select Day"
                className="w-full"
                selectedKeys={field.value ? [field.value] : []}
              >
                {days.map((day) => (
                  <SelectItem key={day.value} value={day.value}>
                    {day.label}
                  </SelectItem>
                ))}
              </Select>
              {errors.day && (
                <span className="text-danger text-sm">
                  {errors.day.message}
                </span>
              )}
            </>
          )}
        />
      </div>

      <div className="mb-1">
        <label className="block mb-2">Date and Time</label>
        <Controller
          name="datetime"
          control={control}
          render={({ field }) => (
            <>
              <Input
                {...field}
                type="datetime-local"
                placeholder="Select date and time..."
                fullWidth
                className="text-gray-600"
              />
              {errors.datetime && (
                <span className="text-danger text-sm">
                  {errors.datetime.message}
                </span>
              )}
            </>
          )}
        />
      </div>

      <div className={`mb-1 ${editingMatch ? "hidden" : ""}`}>
        <label className="block mb-2">Select Opponent Team</label>
        <Controller
          name="team"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Autocomplete
              placeholder="Search and select team..."
              defaultItems={teams}
              onSelectionChange={(teamId) => {
                const selectedTeam = teams.find(
                  (team) => team.TeamID.toString() === teamId
                );
                onChange(selectedTeam ? selectedTeam.TeamID : "");
              }}
              aria-label="Search and select team"
              className="w-full"
              isDisabled={editingMatch !== null}
              selectedKey={value ? value.toString() : undefined}
            >
              {(team) => (
                <AutocompleteItem
                  key={team.TeamID}
                  value={team.TeamID.toString()}
                >
                  {team.Name}
                </AutocompleteItem>
              )}
            </Autocomplete>
          )}
        />
        {errors.team && (
          <span className="text-danger text-sm">{errors.team.message}</span>
        )}
      </div>

      <Button type="submit" color="primary" className="w-full mt-6">
        {editingMatch ? "Update" : "Submit"}
      </Button>
    </form>
  );
}
