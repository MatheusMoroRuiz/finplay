"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import UpsertGoalDialog from "./upsert-goal-dialog";

export default function CreateGoalButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Adicionar Meta</Button>
      <UpsertGoalDialog isOpen={open} setIsOpen={setOpen} />
    </>
  );
}
