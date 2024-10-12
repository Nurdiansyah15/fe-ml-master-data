import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@nextui-org/react";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { z } from "zod";

// Zod schema for validation
const teamSchema = z.object({
  name: z.string().min(1, "Team name is required"),
  logo: z
    .any()
    .refine(
      (file) => file instanceof File || file === null,
      "Logo must be a file"
    ),
});

export default function TeamForm({ onSubmit, teamData }) {
  const [preview, setPreview] = useState(null); // Untuk menyimpan URL preview gambar

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: teamData?.name || "", // Set default value dari data yang diedit
      logo: null, // Logo default akan tetap null karena gambar akan diseleksi melalui input
    },
  });

  // Untuk update preview gambar pada saat edit (jika ada logo sebelumnya)
  useEffect(() => {
    if (teamData?.logo) {
      setPreview(teamData.logo); // Gunakan logo URL dari data tim yang diedit
    }
  }, [teamData]);

  // Fungsi untuk menangani perubahan file dan mengatur preview
  const handleFileChange = (file) => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    } else {
      setPreview(null);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
      {/* Team Name Input */}
      <div className="mb-1">
        <label className="block mb-2">Team Name</label>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <>
              <Input
                {...field}
                value={field.value || ""} // Pastikan tidak `null`, gunakan string kosong
                placeholder="Enter team name"
                fullWidth
                status={errors.name ? "error" : "default"}
                className="text-black"
              />
              {errors.name && (
                <span className="text-danger text-sm">
                  {errors.name.message}
                </span>
              )}
            </>
          )}
        />
      </div>

      {/* Preview Image */}
      {preview && (
        <div className="mb-1">
          <label className="block mb-2">Logo Preview</label>
          <img
            src={preview}
            alt="Team Logo Preview"
            className="w-full h-[400px] object-cover border border-gray-500 p-2 rounded-lg dark:border-dark-2 dark:bg-dark-2 dark:border-[1px]"
          />
        </div>
      )}

      {/* Logo Input */}
      <div className="mb-1">
        <label className="block mb-2">Team Logo</label>
        <Controller
          name="logo"
          control={control}
          render={({ field: { onChange, value, ...field } }) => (
            <>
              <input
                {...field}
                type="file"
                accept="image/*"
                className="text-black w-full p-2 rounded-xl bg-white dark:bg-dark-1 border border-gray-500"
                placeholder="Upload team logo"
                onChange={(e) => {
                  const file = e.target.files[0];
                  onChange(file); // Set file ke form
                  handleFileChange(file); // Perbarui preview
                }}
              />
              {errors.logo && (
                <span className="text-danger text-sm">
                  {errors.logo.message}
                </span>
              )}
            </>
          )}
        />
      </div>

      {/* Submit Button */}
      <Button type="submit" color="primary" className="w-full mt-5">
        Submit
      </Button>
    </form>
  );
}
