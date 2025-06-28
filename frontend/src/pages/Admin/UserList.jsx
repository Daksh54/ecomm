import React, { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
} from "../../redux/api/userApiSlice";
import Message from "../../components/Message";

const UserList = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const [editableUserId, setEditableUserId] = useState(null);
  const [editableUserName, setEditableUserName] = useState("");
  const [editableUserEmail, setEditableUserEmail] = useState("");

  useEffect(() => {
    refetch();
  }, [refetch]);

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id).unwrap();
        toast.success("User deleted successfully");
        refetch();
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    }
  };

  const toggleEdit = (id, username, email) => {
    setEditableUserId(id);
    setEditableUserName(username);
    setEditableUserEmail(email);
  };

  const updateHandler = async (id) => {
    try {
      await updateUser({
        userId: id,
        username: editableUserName,
        email: editableUserEmail,
      }).unwrap();
      toast.success("User updated successfully");
      setEditableUserId(null);
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center py-10 bg-[#0f0f0f]">
      <div className="w-full max-w-5xl bg-[#1a1a1a] p-6 rounded-lg shadow-md text-white">
        <h1 className="text-3xl font-bold text-pink-500 mb-6 text-center">User Management</h1>
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.message}
          </Message>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border border-gray-700">
              <thead className="bg-[#111] text-pink-400">
                <tr>
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Admin</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="text-white">
                {users.map((user) => (
                  <tr key={user._id} className="border-b border-gray-700">
                    <td className="p-3">{user._id.slice(-5)}</td>
                    <td className="p-3">
                      {editableUserId === user._id ? (
                        <div className="flex items-center">
                          <input
                            type="text"
                            value={editableUserName}
                            onChange={(e) =>
                              setEditableUserName(e.target.value)
                            }
                            className="w-full p-2 rounded-md text-black"
                          />
                          <button
                            onClick={() => updateHandler(user._id)}
                            className="ml-2 bg-green-600 text-white p-2 rounded"
                          >
                            <FaCheck />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          {user.username}
                          <button
                            onClick={() =>
                              toggleEdit(
                                user._id,
                                user.username,
                                user.email
                              )
                            }
                          >
                            <FaEdit className="ml-3 text-yellow-400" />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="p-3">
                      {editableUserId === user._id ? (
                        <div className="flex items-center">
                          <input
                            type="email"
                            value={editableUserEmail}
                            onChange={(e) =>
                              setEditableUserEmail(e.target.value)
                            }
                            className="w-full p-2 rounded-md text-black"
                          />
                          <button
                            onClick={() => updateHandler(user._id)}
                            className="ml-2 bg-green-600 text-white p-2 rounded"
                          >
                            <FaCheck />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          {user.email}
                          <button
                            onClick={() =>
                              toggleEdit(
                                user._id,
                                user.username,
                                user.email
                              )
                            }
                          >
                            <FaEdit className="ml-3 text-yellow-400" />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      {user.isAdmin ? (
                        <FaCheck className="text-green-500 mx-auto" />
                      ) : (
                        <FaTimes className="text-red-500 mx-auto" />
                      )}
                    </td>
                    <td className="p-3">
                      {!user.isAdmin && (
                        <button
                          onClick={() => deleteHandler(user._id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;
