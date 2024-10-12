import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@nextui-org/react";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { z } from "zod";

// Zod schema for validation
const heroSchema = z.object({
  name: z.string().min(1, "Hero name is required"),
  hero_image: z
    .any()
    .refine(
      (file) => file instanceof File || file === null,
      "Image must be a file"
    ),
});

export default function HeroForm({ onSubmit, heroData }) {
  const [preview, setPreview] = useState(null); // For image preview

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(heroSchema),
    defaultValues: {
      name: heroData?.name || "", // Default value from edit data
      hero_image: null, // Image will be selected via input
    },
  });

  // Update image preview if editing and there is a previous image
  useEffect(() => {
    if (heroData?.logo) {
      setPreview(heroData.logo); // Use image URL from edit data
    }
  }, [heroData]);

  // Handle file change and set preview
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
      {/* Hero Name Input */}
      <div className="mb-1">
        <label className="block mb-2">Hero Name</label>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <>
              <Input
                {...field}
                value={field.value || ""} // Ensure it's not `null`
                placeholder="Enter hero name"
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
          <label className="block mb-2">Image Preview</label>
          <img
            src={preview}
            alt="Hero Image Preview"
            className="w-full h-[400px] object-cover border border-gray-500 p-2 rounded-lg dark:border-dark-2 dark:bg-dark-2"
          />
        </div>
      )}

      {/* Image Input */}
      <div className="mb-1">
        <label className="block mb-2">Hero Image</label>
        <Controller
          name="hero_image"
          control={control}
          render={({ field: { onChange, value, ...field } }) => (
            <>
              <input
                {...field}
                type="file"
                accept="image/*"
                className="text-black w-full p-2 rounded-xl bg-white dark:bg-dark-1 border border-gray-500"
                placeholder="Select hero image"
                onChange={(e) => {
                  const file = e.target.files[0];
                  onChange(file); // Set file to form
                  handleFileChange(file); // Update preview
                }}
              />
              {errors.hero_image && (
                <span className="text-danger text-sm">
                  {errors.hero_image.message}
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
