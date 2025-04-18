'use client';

import React, { useState, useEffect } from "react";
import { TiArrowUnsorted } from "react-icons/ti";
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import DeleteUserModal from "@app/components/DeleteUserModal";
import EditUserModal from "@app/components/EditUserModal";
import Snackbar from "@mui/material/Snackbar";

interface ManageUsersSpreadsheetProps {
  manageUsersItems: string[][];
  isLoading?: boolean;
}

interface ClerkUser {
  id?: string;
  username?: string;
  publicMetadata?: {
    role?: string;
  };
}

export const ManageUsersSpreadsheet: React.FC<ManageUsersSpreadsheetProps> = ({
  manageUsersItems = [],
  isLoading = false,
}) => {
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [allUsers, setAllUsers] = useState<string[][]>([]);
  const [sortedItems, setSortedItems] = useState<string[][]>([]);
  const [isSortedAsc, setIsSortedAsc] = useState<boolean>(false);

  // Modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAdminWarningModal, setShowAdminWarningModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ClerkUser | null>(null);

  // Snackbar states
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Pagination functionality
  const [currPage, setCurrPage] = useState(1);
  const totalPages = Math.ceil(manageUsersItems.length / 10);
  const initialIndex = (currPage - 1) * 10;
  const lastIndex = (currPage * 10);

  useEffect(() => {
    setSortedItems(manageUsersItems);
    setCurrPage(1);
  }, [manageUsersItems]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        if (!response.ok) throw new Error("Failed to fetch users");

        const data = await response.json();

        const formattedUsers: string[][] = data.data.map((user: ClerkUser) => [
          user.id || "N/A",
          user.username || "N/A",
          user.publicMetadata?.role || "N/A",
        ]);
        setAllUsers(formattedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const sortAlphabetically = (columnIndex: number) => {
    const sorted = [...sortedItems].sort((a, b) =>
      isSortedAsc
        ? a[columnIndex]?.localeCompare(b[columnIndex] || "")
        : b[columnIndex]?.localeCompare(a[columnIndex] || "")
    );
    setSortedItems(sorted);
    setIsSortedAsc(!isSortedAsc);
  };

  const isLastAdmin = (username: string): boolean => {
    const selected = allUsers.find((user) => user[1] === username);
    if (!selected) return false;

    const selectedUserRole = selected[2];
    const adminCount = allUsers.filter((user) => user[2] === "Admin").length;

    return selectedUserRole === "Admin" && adminCount === 1;
  };

  const openEditModal = (first: string, last: string, uname: string, role: string) => {
    if (["volunteer", "customer"].includes(uname)) {
      setSnackbarMessage(
        `Role for ${uname} cannot be changed. You can create a new ${uname} by deleting this user first and creating a new one through the create user button.`
      );
      setSnackbarOpen(true);
      return;
    }

    setFirstName(first);
    setLastName(last);
    setUsername(uname);

    if (isLastAdmin(uname)) {
      setShowAdminWarningModal(true);
      return;
    }

    const selected = allUsers.find((user) => user[1] === uname);
    if (!selected) return console.error("Error: Selected user not found.");

    setSelectedUser({
      id: selected[0],
      username: selected[1],
      publicMetadata: { role: selected[2] },
    });

    setShowEditModal(true);
  };

  const openDeleteModal = (first: string, last: string, uname: string, role: string) => {
    setFirstName(first);
    setLastName(last);
    setUsername(uname);

    if (isLastAdmin(uname)) {
      setShowAdminWarningModal(true);
      return;
    }

    setShowDeleteModal(true);
  };

  const closeModals = () => {
    setShowEditModal(false);
    setShowDeleteModal(false);
    setShowAdminWarningModal(false);
    setFirstName(null);
    setLastName(null);
    setUsername(null);
  };

  const handleSave = async (updatedRole: string, userId: string) => {
    try {
      if (!userId) throw new Error("User ID missing.");

      const payload = { userId, firstName, lastName, role: updatedRole };

      const response = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update user");
      }

      setSortedItems((prevItems) =>
        prevItems.map((row) =>
          row[3] === username
            ? [...row.slice(0, 5), updatedRole, ...row.slice(6)]
            : row
        )
      );

      setAllUsers((prevUsers) =>
        prevUsers.map((user) =>
          user[1] === username ? [user[0], user[1], updatedRole] : user
        )
      );

      setSnackbarMessage("User role updated successfully.");
      setSnackbarOpen(true);
      closeModals();
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user. Please try again.");
    }
  };

  const handleDelete = async () => {
    try {
      if (!username) return;

      const res = await fetch("/api/users", { method: "GET" });
      const data = await res.json();

      const deleteUser = data.data.find((user: ClerkUser) => user.username === username);
      if (!deleteUser) return;

      const adminUsers = data.data.filter(
        (user: ClerkUser) => user.publicMetadata?.role === "Admin"
      );

      if (adminUsers.length <= 1 && deleteUser.publicMetadata?.role === "Admin") {
        setShowAdminWarningModal(true);
        return;
      }

      const response = await fetch("/api/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleteUser.id }),
      });

      const result = await response.json();

      if (response.ok) {
        setSnackbarMessage("User deleted successfully.");
        setSnackbarOpen(true);

        setSortedItems((prevItems) =>
          prevItems.filter((row) => row[3] !== username)
        );

        setAllUsers((prevUsers) =>
          prevUsers.filter((user) => user[1] !== username)
        );
        closeModals();
      } else {
        console.error("Error deleting user:", result.error);
      }
    } catch (error) {
      console.error("User deletion failed:", error);
    }
  };

  return (
    <div className="min-h-[540px] flex flex-col">
      <div className="h-[540px] relative overflow-x-auto crimson-regular font-crimson">
        <table className="table-auto w-full">
          <thead className="font-crimson border-crimson-regular border-separate content-start">
            <tr className="bg-dark-blue text-white text-lg align-left">
              {["First Name", "Last Name", "Pronouns", "Username", "Email", "Role", "Phone Number"].map((label, index) => (
                <th key={index} className="border-collapse border-zinc-50 border-2 border-y-1 py-2 px-3">
                  {label}
                  <button onClick={() => sortAlphabetically(index)} className="ml-2">
                    <TiArrowUnsorted className="inline text-xl cursor-pointer" />
                  </button>
                </th>
              ))}
              <th className="border-collapse border-zinc-50 border-2 border-y-1 py-2 px-3">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-zinc-75 border-collapse border-zinc-400 font-crimson crimson-regular">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="text-center py-4 text-gray-500">
                  Loading users…
                </td>
              </tr>
            ) : (
              sortedItems.slice(initialIndex, lastIndex)
              .map((row, rowIndex) => (
                <tr key={rowIndex} className="py-2">
                {/* // TODO: uncomment this code once approved
                <tr
                  key={rowIndex}
                  className={`py-2 ${["volunteer", "customer"].includes(row[3].toLowerCase()) ? "bg-light-gray" : ""}`}
                > */}
                  {row.map((cell, colIndex) => (
                    <td key={colIndex} className="border-collapse border-zinc-200 border-2 border-y-1 px-3">
                      {String(cell)}
                    </td>
                  ))}
                  <td className="border-collapse border-zinc-200 border-2 border-y-1 px-4 text-center">
                    <span className="inline-flex justify-center gap-4">
                      <MdOutlineEdit
                        size={24}
                        onClick={() => openEditModal(row[0], row[1], row[3], row[5])}
                        className="cursor-pointer"
                      />
                      <MdDeleteOutline
                        size={24}
                        onClick={() => openDeleteModal(row[0], row[1], row[3], row[5])}
                        className="cursor-pointer"
                      />
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      { /* Pagination */}
      {manageUsersItems.length !== 0 && ( 
        <div className="w-full flex justify-center">
          <div className="join">
            <button 
              onClick={() => setCurrPage((prev) => Math.max(prev - 1, 1))}
              disabled={currPage === 1}
              className={`join-item btn border rounded-l-md border-gray w-[40px] font-serif text-[20px] ${
                currPage === 1 ? "cursor-not-allowed opacity-50" : "hover:bg-slate-200"
              }`}
              >«</button>
            <button className="join-item btn border border-gray w-auto px-4 font-serif text-[20px] hover:bg-slate-200" onClick={() => setCurrPage(1)}>Page {currPage} of {totalPages}</button>
            <button  
              onClick={() => setCurrPage((next) => Math.min(next + 1, totalPages))}
              disabled={currPage === totalPages}
              className={`join-item btn border rounded-r-md border-gray w-[40px] font-serif text-[20px] ${
                currPage === totalPages ? "cursor-not-allowed opacity-50" : "hover:bg-slate-200"
              }`}
              >»</button>
          </div>
        </div>
      )}

      {showEditModal && (
        <EditUserModal
          userId={selectedUser?.id || ""}
          userData={[
            firstName || "N/A",
            lastName || "N/A",
            username || "N/A",
            selectedUser?.publicMetadata?.role || "N/A",
          ]}
          closeModal={closeModals}
          handleSave={handleSave}
        />
      )}

      {showDeleteModal && (
        <DeleteUserModal
          userName={`${firstName} ${lastName}`}
          closeModal={closeModals}
          handleDelete={handleDelete}
        />
      )}

      {showAdminWarningModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50">
          <div className="h-[220px] w-[450px] bg-modal-gray font-crimson fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pt-8 shadow-lg rounded-lg">
            <div className="flex flex-col">
              <p className="flex justify-center text-[28px] crimson-bold px-12">
                The system must have at least one admin.
              </p>
              <p className="flex justify-center text-[18px] crimson-bold text-green-100">
                Your action was not completed.
              </p>
            </div>
            <div className="flex flex-row justify-around">
              <button
                className="bg-light-green hover:bg-dark-green text-white font-serif py-2 px-8 rounded-full text-[20px]"
                onClick={() => setShowAdminWarningModal(false)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </div>
  );
};