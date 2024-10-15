import { Button } from "@nextui-org/button";
import { ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { useContext } from "react";
import { PageContext } from "../../contexts/PageContext";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

export default function Header({ toggleSidebar }) {
  const loc = useLocation();
  const nav = useNavigate();
  const { pageTitle, actionButtons } = useContext(PageContext);

  const onPrevPage = useCallback(() => {
    if (loc.pathname !== "/") {
      nav(-1);
    }
  }, [nav, loc.pathname]);

  const onNextPage = useCallback(() => {
    nav(1);
  }, [nav, loc.pathname]);

  return (
    <header className="bg-[#161618] shadow-md p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            isIconOnly
            variant="light"
            className="md:hidden text-white"
            onClick={toggleSidebar}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <div className="flex items-center space-x-2">
            <Button
              isIconOnly
              disabled={loc.pathname === "/"}
              variant="light"
              className={`text-white ${
                loc.pathname === "/" ? "opacity-50" : ""
              }`}
              onClick={onPrevPage}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              isIconOnly
              variant="light"
              className="text-white"
              onClick={onNextPage}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
          <h1 className="text-2xl font-bold text-white">{pageTitle}</h1>
        </div>
        <div className="flex items-center space-x-2">{actionButtons}</div>
      </div>
    </header>
  );
}
