import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { getAllTeams } from "../../../redux/thunks/teamThunk";
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
  stage: z.string().min(1, "Stage is required"),
  day: z.string().min(1, "Day is required"),
  datetime: z.string().min(1, "Datetime is required"),
  team_a: z.number().min(1, "Team is required"),
  team_b: z.number().min(1, "Team is required"),
  team_a_score: z.number().min(0, "Score is required"),
  team_b_score: z.number().min(0, "Score is required"),
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
      stage: "",
      day: "",
      datetime: "",
      team_a: "",
      team_b: "",
      team_a_score: "",
      team_b_score: "",
    },
  });

  useEffect(() => {
    dispatch(getAllTeams());
  }, [dispatch]);

  useEffect(() => {
    if (editingMatch) {
      setValue("stage", editingMatch.stage);
      setValue("day", editingMatch.day.toString());
      setValue("datetime", fromUnixTime(editingMatch.date)); // Format waktu lokal
      setValue("team_a", editingMatch.team_a_id);
      setValue("team_b", editingMatch.team_b_id);
      setValue("team_a_score", editingMatch.team_a_score);
      setValue("team_b_score", editingMatch.team_b_score);
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
        <label className="block mb-2">Stage/Round</label>
        <Controller
          name="stage"
          control={control}
          render={({ field }) => (
            <>
              <Input
                {...field}
                type="text"
                placeholder="Input stage/round name"
                fullWidth
                className="text-gray-600 w-full"
              />
              {errors.stage && (
                <span className="text-danger text-sm">
                  {errors.stage.message}
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
              <Input
                {...field}
                type="number"
                min={1}
                placeholder="input day"
                fullWidth
                className="text-gray-600 w-full"
              />
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

      <div className={`mb-1 flex space-x-1`}>
        <div className="w-1/2">
          <label className="block mb-2">Select Team A</label>
          <Controller
            name="team_a"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Autocomplete
                placeholder="Search and select team..."
                defaultItems={teams}
                onSelectionChange={(teamId) => {
                  const selectedTeam = teams.find(
                    (team) => team.team_id.toString() === teamId
                  );
                  onChange(selectedTeam ? selectedTeam.team_id : "");
                }}
                aria-label="Search and select team"
                className="w-full"
                selectedKey={value ? value.toString() : undefined}
              >
                {(team) => (
                  <AutocompleteItem
                    key={team.team_id}
                    value={team.team_id.toString()}
                  >
                    {team.name}
                  </AutocompleteItem>
                )}
              </Autocomplete>
            )}
          />
          {errors.team_a && (
            <span className="text-danger text-sm">{errors.team_a.message}</span>
          )}
        </div>
        <div className="w-1/2">
          <label className="block mb-2">Team A Score</label>
          <Controller
            name="team_a_score"
            control={control}
            render={({ field }) => (
              <>
                <Input
                  {...field}
                  type="number"
                  placeholder="Team A Score"
                  fullWidth
                  min={0}
                  aria-label="Team A Score"
                  onChange={(e) => {
                    const value =
                      e.target.value === "" ? "" : Number(e.target.value);
                    field.onChange(value);
                  }}
                  className="text-gray-600"
                />
                {errors.team_a_score && (
                  <span className="text-danger text-sm">
                    {errors.team_a_score.message}
                  </span>
                )}
              </>
            )}
          />
        </div>
      </div>

      <div className={`mb-1 flex space-x-1`}>
        <div className="w-1/2">
          <label className="block mb-2">Select Team B</label>
          <Controller
            name="team_b"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Autocomplete
                placeholder="Search and select team..."
                defaultItems={teams}
                onSelectionChange={(teamId) => {
                  const selectedTeam = teams.find(
                    (team) => team.team_id.toString() === teamId
                  );
                  onChange(selectedTeam ? selectedTeam.team_id : "");
                }}
                aria-label="Search and select team"
                className="w-full"
                selectedKey={value ? value.toString() : undefined}
              >
                {(team) => (
                  <AutocompleteItem
                    key={team.team_id}
                    value={team.team_id.toString()}
                  >
                    {team.name}
                  </AutocompleteItem>
                )}
              </Autocomplete>
            )}
          />
          {errors.team_b && (
            <span className="text-danger text-sm">{errors.team_b.message}</span>
          )}
        </div>
        <div className="w-1/2">
          <label className="block mb-2">Team B Score</label>
          <Controller
            name="team_b_score"
            control={control}
            render={({ field }) => (
              <>
                <Input
                  {...field}
                  type="number"
                  placeholder="Team B Score"
                  fullWidth
                  min={0}
                  aria-label="Team B Score"
                  onChange={(e) => {
                    const value =
                      e.target.value === "" ? "" : Number(e.target.value);
                    field.onChange(value);
                  }}
                  className="text-gray-600"
                />
                {errors.team_b_score && (
                  <span className="text-danger text-sm">
                    {errors.team_b_score.message}
                  </span>
                )}
              </>
            )}
          />
        </div>
      </div>

      <Button type="submit" color="primary" className="w-full mt-6">
        {editingMatch ? "Update" : "Submit"}
      </Button>
    </form>
  );
}
