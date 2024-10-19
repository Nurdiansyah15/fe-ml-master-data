import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
} from "@nextui-org/react";
import { getAllCoachesInTeam } from "../../../../redux/thunks/teamThunk";

export default function CoachTeamForm({ onSubmit, team }) {
  const dispatch = useDispatch();
  const { coaches } = useSelector((state) => state.coach); // Ambil data pelatih dari redux
  const [selectedCoach, setSelectedCoach] = useState(null); // Simpan pelatih terpilih

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      coach_id: "",
      role: "", // Tambahkan default value untuk role
    },
  });

  // Ambil data pelatih saat komponen di-mount
  useEffect(() => {
    dispatch(getAllCoachesInTeam(team.team_id));
  }, [dispatch, team.team_id]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="mb-4">
        <label className="block mb-2">Select Coach</label>
        <Controller
          name="coach_id"
          control={control}
          rules={{ required: "Coach is required" }} // Validasi tidak boleh kosong
          render={({ field: { onChange, value } }) => (
            <Autocomplete
              placeholder="Search and select coach..."
              defaultItems={coaches}
              onSelectionChange={(coachId) => {
                const coach = coaches.find(
                  (c) => c.coach_id.toString() === coachId
                );
                onChange(coach ? coach.coach_id : "");
                setSelectedCoach(coach); // Simpan pelatih terpilih
              }}
              aria-label="Search and select coach"
              className="w-full"
              selectedKey={value ? value.toString() : undefined}
            >
              {(coach) => (
                <AutocompleteItem
                  key={coach.coach_id}
                  value={coach.coach_id.toString()}
                >
                  {coach.name}
                </AutocompleteItem>
              )}
            </Autocomplete>
          )}
        />
        {errors.coach_id && (
          <span className="text-danger text-sm">{errors.coach_id.message}</span>
        )}
      </div>

      {/* Tampilkan gambar pelatih jika ada pelatih terpilih */}
      {selectedCoach && (
        <div className="flex flex-col items-center">
          <div className="w-80 h-80">
            <img
              src={selectedCoach.image}
              alt={selectedCoach.name}
              className="w-full h-full object-cover rounded-full"
            />
          </div>

          <span className="mt-2 text-lg font-semibold">
            {selectedCoach.name}
          </span>
        </div>
      )}

      {/* Input untuk Role */}
      <div className="mb-4">
        <label className="block mb-2">Coach Role</label>
        <Controller
          name="role"
          control={control}
          rules={{ required: "Role is required" }} // Validasi tidak boleh kosong
          render={({ field }) => (
            <Input
              {...field}
              placeholder="Enter coach role..."
              className="w-full"
            />
          )}
        />
        {errors.role && (
          <span className="text-danger text-sm">{errors.role.message}</span>
        )}
      </div>

      <Button type="submit" color="primary" className="w-full mt-4">
        Submit
      </Button>
    </form>
  );
}
