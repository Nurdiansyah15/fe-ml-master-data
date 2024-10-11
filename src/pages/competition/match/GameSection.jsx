import { Card, CardBody, Tab, Tabs } from "@nextui-org/react";
import React from "react";
import Explaner from "./components/Explaner";
import Goldlaner from "./components/Goldlaner";
import Lord from "./components/Lord";
import TrioMid from "./components/TrioMid";
import Turtle from "./components/Turtle";

export default function GameSection() {
  return (
    <div className="flex w-full flex-col mt-10">
      <Tabs
        aria-label="Options"
        color="primary"
        variant="light"
        className="w-fit rounded-xl border border-gray-700"
      >
        <Tab key="1" title="Game 1">
          <Card className="bg-gray-800 text-white p-2">
            <CardBody>
              <p className="text-lg font-semibold">Result</p>
              <div className="flex w-full flex-col mt-5">
                <Tabs
                  aria-label="Options"
                  color="primary"
                  variant="light"
                  className="w-fit rounded-xl border border-gray-700"
                >
                  <Tab key="trio-mid" title="Trio Mid">
                    <Card className="border border-gray-600 bg-transparent text-white">
                      <CardBody>
                        <TrioMid />
                      </CardBody>
                    </Card>
                  </Tab>
                  <Tab key="goldlaner" title="Goldlaner">
                    <Card className="border border-gray-600 bg-transparent text-white">
                      <CardBody>
                        <Goldlaner />
                      </CardBody>
                    </Card>
                  </Tab>
                  <Tab key="explaner" title="Explaner">
                    <Card className="border border-gray-600 bg-transparent text-white">
                      <CardBody>
                        <Explaner />
                      </CardBody>
                    </Card>
                  </Tab>
                </Tabs>
              </div>
              <div className="flex w-full flex-col mt-5">
                <Tabs
                  aria-label="Options"
                  color="primary"
                  variant="light"
                  className="w-fit rounded-xl border border-gray-700"
                >
                  <Tab key="turtle" title="Turtle Result">
                    <Card className="border border-gray-600 bg-inherit text-white">
                      <CardBody>
                        <Turtle />
                      </CardBody>
                    </Card>
                  </Tab>
                  <Tab key="lord" title="Lord Result">
                    <Card className="border border-gray-600 bg-inherit text-white">
                      <CardBody>
                        <Lord />
                      </CardBody>
                    </Card>
                  </Tab>
                </Tabs>
              </div>
            </CardBody>
          </Card>
        </Tab>
        <Tab key="2" title="Game 2">
          <Card className="bg-gray-800 text-white">
            <CardBody>
              <div>Beloom</div>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
}
