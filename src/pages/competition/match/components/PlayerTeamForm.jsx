import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Autocomplete, AutocompleteItem, Button } from "@nextui-org/react";
import { getAllPlayersInTeam } from "../../../../redux/thunks/teamThunk";

export default function PlayerTeamForm({ onSubmit, team }) {
  const dispatch = useDispatch();
  const { players } = useSelector((state) => state.player); // Ambil data pemain dari redux
  const [selectedPlayer, setSelectedPlayer] = useState(null); // Simpan pemain terpilih

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      player_id: "",
    },
  });

  // Ambil data pemain saat komponen di-mount
  useEffect(() => {
    dispatch(getAllPlayersInTeam(team.team_id));
  }, [dispatch, team.team_id]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="mb-4">
        <label className="block mb-2">Select Player</label>
        <Controller
          name="player_id"
          control={control}
          rules={{ required: "Player is required" }} // Validasi tidak boleh kosong
          render={({ field: { onChange, value } }) => (
            <Autocomplete
              placeholder="Search and select player..."
              defaultItems={players}
              onSelectionChange={(playerId) => {
                const player = players.find(
                  (p) => p.player_id.toString() === playerId
                );
                onChange(player ? player.player_id : "");
                setSelectedPlayer(player); // Simpan pemain terpilih
              }}
              aria-label="Search and select player"
              className="w-full"
              selectedKey={value ? value.toString() : undefined}
            >
              {(player) => (
                <AutocompleteItem
                  key={player.player_id}
                  value={player.player_id.toString()}
                >
                  {player.name}
                </AutocompleteItem>
              )}
            </Autocomplete>
          )}
        />
        {errors.player_id && (
          <span className="text-danger text-sm">
            {errors.player_id.message}
          </span>
        )}
      </div>

      {/* Tampilkan gambar pemain jika ada pemain terpilih */}
      {selectedPlayer && (
        <div className="flex flex-col items-center">
          <div className="w-80 h-80">
            <img
              src={selectedPlayer.image}
              alt={selectedPlayer.name}
              className="w-full h-full object-cover rounded-full"
            />
          </div>

          <span className="mt-2 text-lg font-semibold">
            {selectedPlayer.name}
          </span>
        </div>
      )}

      <Button type="submit" color="primary" className="w-full mt-4">
        Submit
      </Button>
    </form>
  );
}
