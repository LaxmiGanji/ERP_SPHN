import React, { useState, useEffect } from 'react'
import axios from "axios";
import { baseApiURL } from "../../baseUrl";
import { toast } from "react-hot-toast";
import Heading from "../../components/Heading";
import { MdOutlineDelete, MdEdit } from "react-icons/md";

const AddBook = () => {
  const [data, setData] = useState({
    bookName: "", 
    bookCode: "", 
    author: "", 
    genre: "", 
    quantity: "",
    issuedCount: 0
  });
  const [editData, setEditData] = useState(null);
  const [selected, setSelected] = useState("add");
  const [book, setBook] = useState([]);

  useEffect(() => {
    getBookHandler();
  }, []);

  const getBookHandler = () => {
    axios
      .get(`${baseApiURL()}/library/getLibraryBook`)
      .then((response) => {
        if (response.data.success) {
          setBook(response.data.book);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const addBookHandler = () => {
    if (!data.bookName || !data.bookCode || !data.author || !data.quantity) {
      return toast.error('Please fill all required fields!');
    }
    
    toast.loading("Adding Book");
    axios
      .post(`${baseApiURL()}/library/addLibraryBook`, {
        ...data,
        issuedCount: 0 // Ensure new books start with 0 issued copies
      })
      .then((response) => {
        toast.dismiss();
        if (response.data.success) {
          toast.success(response.data.message);
          setData({
            bookName: "", 
            bookCode: "", 
            author: "", 
            genre: "", 
            quantity: "",
            issuedCount: 0
          });
          getBookHandler();
          setSelected("view");
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.dismiss();
        toast.error(error.response?.data?.message || error.message);
      });
  };

  const deleteBookHandler = (id) => {
    toast.loading("Deleting Book");
    axios
      .delete(`${baseApiURL()}/library/deleteLibraryBook/${id}`)
      .then((response) => {
        toast.dismiss();
        if (response.data.success) {
          toast.success(response.data.message);
          getBookHandler();
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.dismiss();
        toast.error(error.response?.data?.message || error.message);
      });
  };

  const updateBookHandler = () => {
    if (!editData) return;
    
    if (!editData.bookName || !editData.bookCode || !editData.author || !editData.quantity) {
      return toast.error('Please fill all required fields!');
    }

    toast.loading("Updating Book");
    axios
      .put(`${baseApiURL()}/library/updateLibraryBook/${editData._id}`, {
        ...editData,
        // Don't allow direct modification of issuedCount through the form
        issuedCount: editData.issuedCount || 0
      })
      .then((response) => {
        toast.dismiss();
        if (response.data.success) {
          toast.success(response.data.message);
          setEditData(null);
          setSelected("view");
          getBookHandler();
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.dismiss();
        toast.error(error.response?.data?.message || error.message);
      });
  };

  return (
    <div className="w-full mx-auto mt-10 flex justify-center items-start flex-col mb-10">
      <div className="flex justify-between items-center w-full">
        <Heading title="Manage Library Books" />
        <div className="flex justify-end items-center w-full">
          <button
            className={`${
              selected === "add" && "border-b-2 "
            }border-blue-500 px-4 py-2 text-black rounded-sm mr-6`}
            onClick={() => setSelected("add")}
          >
            Add Book
          </button>
          <button
            className={`${
              selected === "view" && "border-b-2 "
            }border-blue-500 px-4 py-2 text-black rounded-sm`}
            onClick={() => setSelected("view")}
          >
            View Books
          </button>
        </div>
      </div>

      {selected === "add" && (
        <div className="flex flex-col justify-center items-center w-full mt-8">
          <div className="w-[40%] mb-4">
            <label htmlFor="bookName" className="leading-7 text-sm">
              Book Name*
            </label>
            <input
              type="text"
              id="bookName"
              value={data.bookName}
              onChange={(e) => setData({ ...data, bookName: e.target.value })}
              className="w-full bg-blue-50 rounded border text-base outline-none py-1 px-3"
              required
            />
          </div>
          <div className="w-[40%] mb-4">
            <label htmlFor="bookCode" className="leading-7 text-sm">
              Book Code*
            </label>
            <input
              type="number"
              id="bookCode"
              value={data.bookCode}
              onChange={(e) => setData({ ...data, bookCode: e.target.value })}
              className="w-full bg-blue-50 rounded border text-base outline-none py-1 px-3"
              required
            />
          </div>
          <div className="w-[40%] mb-4">
            <label htmlFor="author" className="leading-7 text-sm">
              Author*
            </label>
            <input
              type="text"
              id="author"
              value={data.author}
              onChange={(e) => setData({ ...data, author: e.target.value })}
              className="w-full bg-blue-50 rounded border text-base outline-none py-1 px-3"
              required
            />
          </div>
          <div className="w-[40%] mb-4">
            <label htmlFor="genre" className="leading-7 text-sm">
              Genre
            </label>
            <input
              type="text"
              id="genre"
              value={data.genre}
              onChange={(e) => setData({ ...data, genre: e.target.value })}
              className="w-full bg-blue-50 rounded border text-base outline-none py-1 px-3"
            />
          </div>
          <div className="w-[40%] mb-4">
            <label htmlFor="quantity" className="leading-7 text-sm">
              Quantity*
            </label>
            <input
              type="number"
              id="quantity"
              value={data.quantity}
              onChange={(e) => setData({ ...data, quantity: e.target.value })}
              className="w-full bg-blue-50 rounded border text-base outline-none py-1 px-3"
              min="1"
              required
            />
          </div>
          <button
            className="mt-6 bg-blue-500 px-6 py-3 text-white rounded hover:bg-blue-600 transition"
            onClick={addBookHandler}
          >
            Add Book
          </button>
        </div>
      )}

      {selected === "view" && (
        <div className="mt-8 w-full overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="py-3 px-4 text-left">Book Code</th>
                <th className="py-3 px-4 text-left">Book Name</th>
                <th className="py-3 px-4 text-left">Author</th>
                <th className="py-3 px-4 text-left">Genre</th>
                <th className="py-3 px-4 text-left">Available</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {book.map((item) => (
                <tr key={item._id} className="border-b hover:bg-blue-50">
                  <td className="py-3 px-4">{item.bookCode}</td>
                  <td className="py-3 px-4">{item.bookName}</td>
                  <td className="py-3 px-4">{item.author}</td>
                  <td className="py-3 px-4">{item.genre || '-'}</td>
                  <td className="py-3 px-4">
                    {item.quantity - (item.issuedCount || 0)} / {item.quantity}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => {
                          setEditData(item);
                          setSelected("edit");
                        }}
                        title="Edit"
                      >
                        <MdEdit size={20} />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => deleteBookHandler(item._id)}
                        title="Delete"
                      >
                        <MdOutlineDelete size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected === "edit" && editData && (
        <div className="flex flex-col justify-center items-center w-full mt-8">
          <div className="w-[40%] mb-4">
            <label htmlFor="editName" className="leading-7 text-sm">
              Book Name*
            </label>
            <input
              type="text"
              id="editName"
              value={editData.bookName}
              onChange={(e) => setEditData({ ...editData, bookName: e.target.value })}
              className="w-full bg-blue-50 rounded border text-base outline-none py-1 px-3"
              required
            />
          </div>
          <div className="w-[40%] mb-4">
            <label htmlFor="editCode" className="leading-7 text-sm">
              Book Code*
            </label>
            <input
              type="number"
              id="editCode"
              value={editData.bookCode}
              onChange={(e) => setEditData({ ...editData, bookCode: e.target.value })}
              className="w-full bg-blue-50 rounded border text-base outline-none py-1 px-3"
              required
            />
          </div>
          <div className="w-[40%] mb-4">
            <label htmlFor="editAuthor" className="leading-7 text-sm">
              Author*
            </label>
            <input
              type="text"
              id="editAuthor"
              value={editData.author}
              onChange={(e) => setEditData({ ...editData, author: e.target.value })}
              className="w-full bg-blue-50 rounded border text-base outline-none py-1 px-3"
              required
            />
          </div>
          <div className="w-[40%] mb-4">
            <label htmlFor="editGenre" className="leading-7 text-sm">
              Genre
            </label>
            <input
              type="text"
              id="editGenre"
              value={editData.genre}
              onChange={(e) => setEditData({ ...editData, genre: e.target.value })}
              className="w-full bg-blue-50 rounded border text-base outline-none py-1 px-3"
            />
          </div>
          <div className="w-[40%] mb-4">
            <label htmlFor="editQuantity" className="leading-7 text-sm">
              Quantity*
            </label>
            <input
              type="number"
              id="editQuantity"
              value={editData.quantity}
              onChange={(e) => setEditData({ ...editData, quantity: e.target.value })}
              className="w-full bg-blue-50 rounded border text-base outline-none py-1 px-3"
              min="1"
              required
            />
          </div>
          <div className="w-[40%] mb-4">
            <label htmlFor="editIssuedCount" className="leading-7 text-sm">
              Currently Issued
            </label>
            <input
              type="number"
              id="editIssuedCount"
              value={editData.issuedCount || 0}
              readOnly
              className="w-full bg-gray-100 rounded border text-base outline-none py-1 px-3"
            />
          </div>
          <div className="flex space-x-4">
            <button
              className="mt-6 bg-gray-500 px-6 py-3 text-white rounded hover:bg-gray-600 transition"
              onClick={() => {
                setEditData(null);
                setSelected("view");
              }}
            >
              Cancel
            </button>
            <button
              className="mt-6 bg-blue-500 px-6 py-3 text-white rounded hover:bg-blue-600 transition"
              onClick={updateBookHandler}
            >
              Update Book
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddBook;