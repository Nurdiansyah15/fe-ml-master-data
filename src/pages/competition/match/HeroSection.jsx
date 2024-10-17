import { Card, CardBody, Tab, Tabs } from "@nextui-org/react";
import React, { useState } from "react";
import HeroPick from "./components/HeroPick";
import HeroBan from "./components/HeroBan";

export default function HeroSection({ team, match }) {
  return (
    <div className="flex w-full flex-col mt-10">
      <Tabs
        aria-label="Options"
        color="primary"
        variant="light"
        className="w-fit rounded-xl border border-gray-700"
      >
        <Tab key="pick" title="Hero Pick">
          <Card className="bg-gray-800 text-white">
            <CardBody>
              <HeroPick team={team} match={match} />
            </CardBody>
          </Card>
        </Tab>
        <Tab key="ban" title="Hero Ban">
          <Card className="bg-gray-800 text-white">
            <CardBody>
              <HeroBan team={team} match={match} />
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
}
