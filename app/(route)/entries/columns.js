import { Button } from "@/components/ui/button";
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
import { ArrowUpDown, Eye, LayoutDashboard, Pencil, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

const deleteAwb = async (trackingNumber) => {
  try {
    await axios.delete(`/api/awb/${trackingNumber}`, { withCredentials: true });
  } catch (error) {
    console.error("Error Deleting AWB:", error);
  }
};

const ShowName = ({ id }) => {
  const [name, setName] = useState("");

  useEffect(() => {
    const fetchClient = async () => {
      console.log(`Fetching client data for ID: ${id}`);
      try {
        const response = await axios.get(`/api/clients/id/${id}`);
        const data = response.data;
        if (data) {
          setName(data.name);
        } else {
          setName("Unknown Client");
        }
      } catch (err) {
        console.error("Error fetching client:", err);
        setName("Error");
      }
    };

    fetchClient();
  }, [id]);

  return <span>{name}</span>;
};

export const columns = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = row.original.date;
      return (
        <span>
          {date
            ? new Date(date).toLocaleDateString("en-GB")
            : "No date available"}
        </span>
      );
    },
  },
  {
    accessorKey: "clientCode",
    header: ({ column }) => (
      <span
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-1 cursor-pointer"
      >
        Client Code <ArrowUpDown className="ml-2 h-4 w-4" />
      </span>
    ),
  },
  {
    accessorKey: "batchNo",
    header: ({ column }) => (
      <span
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-1 cursor-pointer"
      >
        Batch No. <ArrowUpDown className="ml-2 h-4 w-4" />
      </span>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const { batchNo } = row.original;
      return (
        <div className="flex gap-2">
          <Button
            className="bg-green-800"
            onClick={() => window.open(`/entries/${batchNo}`)}
          >
            <Eye className="w-5 h-5" />
          </Button>
          <Button
            className="bg-blue-800"
            onClick={() => window.open(`/edit-entries/${batchNo}`)}
          >
            <Pencil className="w-5 h-5" />
          </Button>
          <Button
            onClick={() => window.open(`/awb/update-track/${batchNo}`)}
          >
            <LayoutDashboard className="w-5 h-5" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger>
              <Trash className="w-5 h-5 text-red-500 cursor-pointer" />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  Deleting AWB with Tracking Number: {batchNo} cannot be
                  undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    deleteAwb(batchNo);
                  }}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
  },
];
