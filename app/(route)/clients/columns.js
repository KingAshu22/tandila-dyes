"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ArrowUpDown, Eye, Pencil, Trash } from "lucide-react";
import axios from "axios";
import Account, { getAccount } from "@/lib/getAccount";
import { useEffect, useState } from "react";

const deleteClient = async (code) => {
  try {
    await axios.delete(`/api/clients/${code}`, { withCredentials: true });
  } catch (error) {
    console.error("Error Deleting Client:", error);
  }
};

export const columns = [
  {
    accessorKey: "code",
    header: ({ column }) => (
      <span
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-1 cursor-pointer"
      >
        Code
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </span>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <span
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-1 cursor-pointer"
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </span>
    ),
  },
  {
    id: "debit",
    header: "Debit",
    cell: ({ row }) => {
      const { code } = row.original;
      const [debit, setDebit] = useState(null);

      useEffect(() => {
        async function fetchDebit() {
          const account = await getAccount(code);
          setDebit(account.totalDebit);
        }
        fetchDebit();
      }, [code]);

      return debit !== null ? debit.toLocaleString("en-IN") : "Loading...";
    },
  },
  {
    id: "credit",
    header: "Credit",
    cell: ({ row }) => {
      const { code } = row.original;
      const [credit, setCredit] = useState(null);

      useEffect(() => {
        async function fetchCredit() {
          const account = await getAccount(code);
          setCredit(account.totalCredit);
        }
        fetchCredit();
      }, [code]);

      return credit !== null ? credit.toLocaleString("en-IN") : "Loading...";
    },
  },
  {
    id: "balance",
    header: "Balance",
    cell: ({ row }) => {
      const { code } = row.original;
      const [balance, setBalance] = useState(null);

      useEffect(() => {
        async function fetchBalance() {
          const account = await getAccount(code);
          setBalance(account.finalBalance);
        }
        fetchBalance();
      }, [code]);

      return balance !== null ? balance.toLocaleString("en-IN") : "Loading...";
    },
  },
  {
    accessorKey: "contact",
    header: ({ column }) => (
      <span
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-1 cursor-pointer"
      >
        Contact
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </span>
    ),
  },
  {
    accessorKey: "password",
    header: ({ column }) => (
      <span
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-1 cursor-pointer"
      >
        Password
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </span>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const { code, name } = row.original;

      return (
        <div className="flex gap-2">
          {/* Edit Button */}
          <a
            className="px-2 py-1 bg-blue-800 text-white rounded-sm"
            href={`/clients/edit/${code}`}
          >
            <Pencil className="w-[20px] h-[20px]" />
          </a>

          <a
            className="px-2 py-1 bg-red-600 text-white rounded-sm"
            href={`/clients/entries/${code}`}
          >
            <Eye className="w-[20px] h-[20px]" />
          </a>

          {/* Delete Confirmation Dialog */}
          <AlertDialog>
            <AlertDialogTrigger className="bg-primary rounded-lg px-2 py-1 text-white">
              <Trash className="w-[20px] h-[20px]" />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete{" "}
                  <strong>{name}</strong> and remove data completely from the
                  servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteClient(code)}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
  },
];
