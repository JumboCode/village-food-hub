/**
 * We can also use the import keyword to use components
 * from other files!
 */

import { useState } from "react";

import TheButton from "./components/TheButton";

export default function Home() {

  return (
    <div className="flex justify-center items-center h-screen">
      <div>
        <h1 className="text-4xl">Village Food Hub!</h1>
      </div>
    </div>
  );
}