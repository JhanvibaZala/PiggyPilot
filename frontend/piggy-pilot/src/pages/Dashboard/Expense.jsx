import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import { API_PATH } from "../../utils/apiPath";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";
import ExpenseOverview from "../../components/Expense/ExpenseOverview";
import AddExpenseForm from "../../components/Expense/AddExpenseForm";
import Model from "../../components/Model";
import ExpenseList from "../../components/Expense/ExpenseList";
import DeleteAlert from "../../components/DeleteAlert";


const Expense = () => {
  useUserAuth();
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });
  const [openAddExpenseModel, setOpenAddExpenseModel] = useState(false);

  // Get all expense details
  const fetchExpenseDetails = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axiosInstance.get(
        `${API_PATH.EXPENSE.GET_ALL_EXPENSE}`
      );
      if (response.data) {
        setExpenseData(response.data);
      }
    } catch (err) {
      console.log("Something went wrong. Please try gain later", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle add expense
  const handleAddExpense = async (expense) => {
    const { category, amount, date, icon } = expense;

    // validation checks
    if (!category.trim()) {
      toast.error("Category is required");
      return;
    }
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Amount should be valid and number greater than 0.");
      return;
    }
    if (!date) {
      toast.error("Date is required");
      return;
    }
    try {
      await axiosInstance.post(API_PATH.EXPENSE.ADD_EXPENSE, {
        category,
        amount,
        date,
        icon,
      });

      setOpenAddExpenseModel(false);
      toast.success("Expense added successfully");
      fetchExpenseDetails();
    } catch (error) {
      console.error(
        "Error adding expense",
        error.response?.data?.message || error.message
      );
    }
  };

  // delete expense
  const deleteExpense = async (id) => {
    try {
      await axiosInstance.delete(API_PATH.EXPENSE.DELETE_EXPENSE(id));
      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Expense details deleted successfully");
      fetchExpenseDetails();
    } catch (error) {
      console.error(
        "Error deleting expense : ",
        error.response?.data?.message || error.message
      );
    }
  };

  // handle download expense details
  const handleDownloadExpenseDetails = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATH.EXPENSE.DOWNLOAD_EXPENSE,
        {
          responseType: "blob", // Important for downloading files
        }
      );

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob ([response.data]))
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "expense_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    }
    catch (error) {
      console.error(
        "Error downloading expense details",
        error.response?.data?.message || error.message
      );
      toast.error("Failed to download expense details");
    }
  };

  useEffect(() => {
    fetchExpenseDetails();
    // eslint-disable-next-line
  }, []);
  return (
    <DashboardLayout activeMenu="Expense">
      <div className="my-5 mx-auto">Expense Page</div>
      <div className="grid grid-cols-1 gap-6">
        <div className="">
          <ExpenseOverview
            transactions={expenseData}
            onExpenseIncome={() => setOpenAddExpenseModel(true)}
          />
        </div>
        <ExpenseList
          transactions={expenseData}
          onDelete={(id) => {
            setOpenDeleteAlert({
              show: true,
              data: id,
            });
          }}
          onDownload={handleDownloadExpenseDetails}
        />
      </div>
      <Model
        isOpen={openAddExpenseModel}
        onClose={() => setOpenAddExpenseModel(false)}
        title="Add Expense"
      >
        <AddExpenseForm onAddExpense={handleAddExpense} />
      </Model>
      <Model
        isOpen={openDeleteAlert.show}
        onClose={() => setOpenDeleteAlert({ show: false, data: null })}
        title="Delete Expense"
      >
        <DeleteAlert
          content="Are you sure you want to delete this expense detail?"
          onDelete={() => deleteExpense(openDeleteAlert.data)}
        />
      </Model>
    </DashboardLayout>
  );
};

export default Expense;
