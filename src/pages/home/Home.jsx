import { useContext, useEffect } from "react";
import { PageContext } from "../../contexts/PageContext";
export default function Home() {
  const { updatePage } = useContext(PageContext);

  useEffect(() => {
    updatePage("Home");
  }, [updatePage]);

  return (
    <div className="text-white flex flex-col justify-center items-center h-full w-full">
      <p className="font-bold text-gray-200">No tournament selected.</p>
      <p className="font-bold text-gray-200">
        Please choose one from the sidebar or create a tournament.
      </p>
    </div>
  );
}
