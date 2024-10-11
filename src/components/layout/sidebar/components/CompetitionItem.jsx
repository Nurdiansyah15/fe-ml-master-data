import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { Ellipsis } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

const CompetitionItem = () => {
  const nav = useNavigate();
  const loc = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [competitionName, setCompetitionName] = useState("Competitions");
  const [isActive, setIsActive] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isFirstBlur, setIsFirstBlur] = useState(true);
  const inputRef = useRef(null);

  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      name: competitionName,
    },
  });

  useEffect(() => {
    // Reset editing state when location changes
    setIsEditing(false);
    setIsPopoverOpen(false);
  }, [loc.pathname]);

  useEffect(() => {
    if (isEditing) {
      const focusInput = () => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      };

      focusInput();
      const timeoutId = setTimeout(focusInput, 50);

      return () => clearTimeout(timeoutId);
    }
  }, [isEditing]);

  useEffect(() => {
    if (loc.pathname === "/competition") {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [loc, nav]);

  const handleEditClick = (e) => {
    e.stopPropagation(); // Prevent navigation when clicking edit
    setIsPopoverOpen(false);
    setTimeout(() => {
      setIsEditing(true);
    }, 100);
  };

  const handleFormSubmit = (data) => {
    if (!data.name.trim()) {
      setCompetitionName("New Competition");
    } else {
      setCompetitionName(data.name);
    }
    setIsEditing(false);
  };

  return (
    <div
      className={`my-2 cursor-pointer flex items-center ${
        isEditing && "border border-blue-500"
      } justify-between text-white p-2 ${
        isActive && "bg-gray-700"
      } rounded-lg px-3 hover:bg-gray-700`}
      onClick={() => !isEditing && nav("/competition")}
    >
      {isEditing ? (
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <input
              {...field}
              ref={(e) => {
                inputRef.current = e;
                field.ref(e);
              }}
              className="bg-transparent text-white rounded-lg w-full outline-none"
              onKeyDown={(e) => {
                e.stopPropagation(); // Prevent navigation when typing
                if (e.key === "Enter") {
                  handleSubmit(handleFormSubmit)();
                } else if (e.key === "Escape") {
                  setIsEditing(false);
                }
              }}
              onBlur={(e) => {
                if (isFirstBlur) {
                  setIsFirstBlur(false); // Mengabaikan blur pertama
                  return;
                }
                handleSubmit(handleFormSubmit)();
              }}
              onClick={(e) => e.stopPropagation()} // Prevent navigation when clicking input
            />
          )}
        />
      ) : (
        <p className="overflow-hidden line-clamp-1">{competitionName}</p>
      )}

      <Popover
        isOpen={isPopoverOpen}
        onOpenChange={setIsPopoverOpen}
        placement="right-start"
      >
        <PopoverTrigger>
          <div className="w-5" onClick={(e) => e.stopPropagation()}>
            {" "}
            {/* Prevent navigation when clicking ellipsis */}
            <Ellipsis
              size={20}
              color="white"
              className={`hover:opacity-100 opacity-0 h-full ${
                isActive && "opacity-100"
              }`}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent
          color="white"
          className="bg-gray-700 border border-gray-500"
        >
          <div className="p-2 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Button
                color="warning"
                size="sm"
                className="text-white"
                onClick={handleEditClick}
              >
                Edit
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button color="danger" size="sm">
                Delete
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CompetitionItem;
