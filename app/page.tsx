/**
 * We can also use the import keyword to use components
 * from other files!
 */

import { useState } from "react";

import TheButton from "./components/TheButton";

export default function Home() {

  return (
    <>
    <TheButton label="Click for weather"/>
    </>
  )
}