import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { Ellipsis } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Controller, set, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { updateTournament } from "../../../../redux/features/tournamentSlice";
import { Save } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaPen } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";

const TournamentItem = ({ tournament }) => {
  const nav = useNavigate();
  const loc = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      name: tournament.Name || "New Tournament",
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
    const prefix = `/tournaments/${tournament.TournamentID}`;
    setIsActive(loc.pathname.startsWith(prefix));
  }, [loc.pathname, tournament.TournamentID]);

  const handleEditClick = (e) => {
    e.stopPropagation();
    setIsPopoverOpen(false);
    setTimeout(() => {
      setIsEditing(true);
    }, 100);
  };

  const handleFormSubmit = (data) => {
    const { name } = data;
    setLoading(true);

    dispatch(
      updateTournament({
        tournamentID: tournament.TournamentID,
        name: name.trim() || "New Tournament",
      })
    )
      .unwrap()
      .then(() => setIsEditing(false))
      .catch((error) => console.error("Error:", error))
      .finally(() => setLoading(false));
  };

  return (
    <div
      className={`my-2 cursor-pointer flex items-center ${isEditing && "border border-blue-500"
        } justify-between text-white p-2 ${isActive && "bg-[#363638]"
        } rounded-xl px-3 hover:bg-[#363638]`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() =>
        !isEditing && nav("/tournaments/" + tournament.TournamentID)
      }
    >
      {isEditing ? (
        <div className="flex items-center relative">
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
                onClick={(e) => e.stopPropagation()} // Prevent navigation when clicking input
              />
            )}
          />
          <Button
            isLoading={loading}
            isIconOnly={true}
            color="success"
            size="sm"
            className="absolute right-[-8px] text-white"
            onClick={handleSubmit(handleFormSubmit)}
          >
            <Save size={16} />
          </Button>
        </div>
      ) : (
        <p className="overflow-hidden line-clamp-1">{tournament.Name}</p>
      )}
      {!isEditing && (
        isHovered &&
        <div>
          <div className="flex flex-row gap-2">
            <div className="flex items-center gap-2">
              <button
                className="text-gray-500 hover:text-white text-xs p-0 m-0"
                onClick={handleEditClick}
              >
                <FontAwesomeIcon  icon={faPen} />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button className="text-gray-500 hover:text-white text-xs p-0 m-0">
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>
        </div>
        // <Popover
        //   isOpen={isPopoverOpen}
        //   onOpenChange={setIsPopoverOpen}
        //   placement="right-start"
        // >
        //   <PopoverTrigger>
        //     <div className="w-5" onClick={(e) => e.stopPropagation()}>
        //       <Ellipsis
        //         size={20}
        //         color="white"
        //         className={`hover:opacity-100 opacity-0 h-full ${
        //           isActive && "opacity-100"
        //         }`}
        //       />
        //     </div>
        //   </PopoverTrigger>
        //   <PopoverContent
        //     color="white"
        //     className="bg-[#363638] border border-gray-500"
        //   >
        //     <div className="p-2 flex flex-col gap-2">
        //       <div className="flex items-center gap-2">
        //         <Button
        //           color="warning"
        //           size="sm"
        //           className="text-white"
        //           onClick={handleEditClick}
        //         >
        //           Edit
        //         </Button>
        //       </div>
        //       <div className="flex items-center gap-2">
        //         <Button color="danger" size="sm">
        //           Delete
        //         </Button>
        //       </div>
        //     </div>
        //   </PopoverContent>
        // </Popover>
      )}
    </div>
  );
};

export default TournamentItem;
