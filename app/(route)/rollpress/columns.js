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
import { ArrowUpDown, BriefcaseBusiness, Eye, LayoutDashboard, Pencil, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";

const deleteEntry = async (batchNo) => {
  try {
    await axios.delete(`/api/entry/${batchNo}`, { withCredentials: true });
  } catch (error) {
    console.error("Error Deleting Entry:", error);
  }
};

const ShowName = ({ id }) => {
  const [name, setName] = useState("");

  useEffect(() => {
    const fetchClient = async () => {
      console.log(`Fetching client data for ID: ${id}`);
      try {
        const response = await axios.get(`/api/clients/${id}`);
        const data = response.data;
        if (data) {
          setName(data[0].name);
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

const OutDateModal = ({ batchNo }) => {
  const [workOrder, setWorkOrder] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const response = await axios.get(`/api/entry/${batchNo}`);
        setWorkOrder(response.data[0].workOrder || []);
      } catch (err) {
        console.error("Failed to fetch Entry data");
      }
    };

    fetchEntry();
  }, [batchNo]);

  const editSubmit = async () => {
    try {
      const entryData = { workOrder };
      const response = await axios.put(`/api/entry/${batchNo}`, entryData);

      if (response.status === 200) {
        console.log("Entry updated successfully:", response.data);
        setIsOpen(false);
      } else {
        console.error("Failed to update entry:", response.data);
        alert("Failed to update the entry. Please try again.");
      }
    } catch (error) {
      console.error("Error updating entry:", error.response?.data || error.message);
      alert("An error occurred while updating the entry.");
    }
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 bg-blue-500 text-white rounded-md"
      >
        <BriefcaseBusiness />
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full p-6">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-2xl font-semibold text-[#232C65]">Work Order Details</h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">&times;</button>
            </div>

            <div className="overflow-x-auto mt-4">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2">Order No</th>
                    <th className="border p-2">Description</th>
                    <th className="border p-2">Quantity</th>
                    <th className="border p-2">Unit</th>
                    <th className="border p-2">Rate</th>
                    <th className="border p-2">Amount</th>
                    <th className="border p-2">Staff</th>
                    <th className="border p-2">In Date</th>
                    <th className="border p-2">Out Date</th>
                    <th className="border p-2">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {workOrder.map((work, index) => (
                    <tr key={index} className="border">
                      <td className="border p-2">{work.orderNo}</td>
                      <td className="border p-2">{work.description}</td>
                      <td className="border p-2">{work.quantity}</td>
                      <td className="border p-2">{work.unit}</td>
                      <td className="border p-2">{work.rate}</td>
                      <td className="border p-2">{work.amount}</td>
                      <td className="border p-2">{work.staffCode}</td>
                      <td className="border p-2">{new Date(new Date(work.inDate).getTime() - 5.5 * 60 * 60 * 1000).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}</td>
                      <td className="border p-2">
                        <input
                          type="datetime-local"
                          className="border rounded px-2 py-1 w-full"
                          value={work.outDate ? new Date(work.outDate).toISOString().slice(0, 16) : ""}
                          onChange={(e) => {
                            const selectedDate = new Date(e.target.value);
                            selectedDate.setHours(selectedDate.getHours() + 5, selectedDate.getMinutes() + 30);
                            const updatedWorkOrders = [...workOrder];
                            updatedWorkOrders[index].outDate = selectedDate;
                            setWorkOrder(updatedWorkOrders);
                          }}
                        />
                      </td>
                      <td className="border p-2">{work.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end mt-4">
              <button onClick={() => setIsOpen(false)} className="bg-gray-400 text-white px-4 py-2 rounded-md mr-2">Cancel</button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={editSubmit}>Update</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
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
    cell: ({ row }) => {
      const { clientCode } = row.original;
      return (
        <span>{clientCode} <ShowName id={clientCode} /></span>
      );
    },
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
          <OutDateModal batchNo={batchNo} />
          <AlertDialog>
            <AlertDialogTrigger>
              <Trash className="w-5 h-5 text-red-500 cursor-pointer" />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  Do you really want to delete entry with Batch No: {batchNo} cannot be
                  undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    deleteEntry(batchNo);
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
