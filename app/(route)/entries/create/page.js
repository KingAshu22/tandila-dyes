"use client"
import EntriesForm from "@/components/EntriesForm";
import withAuth from "@/lib/withAuth";
import React from "react";

const CreateAWB = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <EntriesForm />
    </div>
  );
};

export default withAuth(CreateAWB);
