"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import withAuth from "@/lib/withAuth";

function Dashboard() {

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        Welcome Back,{" "}
        <span className="text-[#E31E24]">{localStorage?.getItem("name")}!</span>
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold"></p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Table</CardTitle>
        </CardHeader>
        <CardContent>
        </CardContent>
      </Card>
    </div>
  );
}

export default withAuth(Dashboard);
