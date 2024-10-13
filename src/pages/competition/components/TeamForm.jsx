import { zodResolver } from "@hookform/resolvers/zod";
import { Autocomplete, AutocompleteItem, Button } from "@nextui-org/react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { z } from "zod";
import { getAllTeams } from "../../../redux/features/teamSlice";

// Zod schema for validation
const teamSchema = z.object({
  team: z.number().min(1, "Team is required"),
});

export default function TeamForm({ onSubmit }) {
  const { teams } = useSelector((state) => state.team);
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      team: "",
    },
  });

  useEffect(() => {
    dispatch(getAllTeams());
  }, [dispatch]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {/* Visible label for accessibility */}
      <label
        htmlFor="team"
        className="text-sm font-medium text-gray-700 mb-2 hidden"
      >
        Select a Team
      </label>
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
            aria-label="Search and select team" // Added aria-label for accessibility
            className="w-full"
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

      <Button type="submit" color="primary" className="w-full">
        Submit
      </Button>
    </form>
  );
}
