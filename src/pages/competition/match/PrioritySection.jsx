import { CardBody, Tab, Tabs } from "@nextui-org/react";
import React from "react";
import PriorityPick from "./components/PriorityPick";
import PriorityBan from "./components/PriorityBan";
import FlexPick from "./components/FlexPick";
import Card from "../../../components/Card";

export default function PrioritySection() {
  return (
    <div className="flex w-full flex-col">
      <Tabs
        aria-label="Options"
        color="primary"
        variant="light"
        className="w-fit rounded-xl border border-gray-700"
      >
        <Tab key="pick" title="Priority Pick">
          <Card className="text-white">
            {/* <CardBody> */}
            <PriorityPick />
            {/* </CardBody> */}
          </Card>
        </Tab>
        <Tab key="ban" title="Priority Ban">
          <Card className="text-white">
            {/* <CardBody> */}
            <PriorityBan />
            {/* </CardBody> */}
          </Card>
        </Tab>
        <Tab key="flex" title="Flex Pick">
          <Card className="text-white">
            {/* <CardBody> */}
            <FlexPick />
            {/* </CardBody> */}
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
}
