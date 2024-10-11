import { zodResolver } from "@hookform/resolvers/zod";
import { Autocomplete, AutocompleteItem, Button } from "@nextui-org/react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

// Zod schema for validation
const teamSchema = z.object({
  team: z.string().min(1, "Please select a team"),
});

// List of teams
const teams = [
  { id: 1, name: "Team Alpha" },
  { id: 2, name: "Team Beta" },
  { id: 3, name: "Team Gamma" },
  { id: 4, name: "Team Delta" },
  { id: 5, name: "Team Epsilon" },
  { id: 6, name: "Team Zeta" },
  { id: 7, name: "Team Eta" },
  { id: 8, name: "Team Theta" },
  { id: 9, name: "Team Iota" },
  { id: 10, name: "Team Kappa" },
  { id: 11, name: "Team Lambda" },
];

export default function TeamForm({ onSubmit }) {
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
                (team) => team.id.toString() === teamId
              );
              onChange(selectedTeam ? selectedTeam.name : "");
            }}
            aria-label="Search and select team" // Added aria-label for accessibility
            className="w-full"
          >
            {(team) => (
              <AutocompleteItem key={team.id} value={team.id.toString()}>
                {team.name}
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
