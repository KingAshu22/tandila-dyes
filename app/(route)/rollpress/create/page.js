"use client"
import RollPressForm from "@/components/RollPressForm";
import withAuth from "@/lib/withAuth";
import React from "react";

const CreateAWB = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <RollPressForm />
    </div>
  );
};

export default withAuth(CreateAWB);
