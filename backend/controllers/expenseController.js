const xlsx = require("xlsx");
const path = require("path");
const fs = require("fs");
const Expense = require("../models/Expense");

// Add Expense Category
exports.addExpense = async (req,res) => {
    const userId = req.user._id;
    try {
        const {icon, category, amount, date} = req.body;
        // check for missing fields
        if(!category || !amount || !date) {
            return res.status(400).json({message : "All fields are required"});
        }
        const newExpense = new Expense ( {
            userId,
            icon,
            category,
            amount,
            date: new Date(date)
        });
        await newExpense.save();
        res.status(200).json(newExpense);
    }
    catch (err) {
        console.log("User in request:", req.user);
        console.error("Add Expense Error:", err.message);
        res.status(500).json({message : "Server Error"})
    }
}

// get all Expense expense
exports.getAllExpense = async (req,res) => {
    const userId = req.user._id;

    try {
        const expense = await Expense.find({userId}).sort({date : -1});
        res.json(expense);
    }
    catch(err) {
        res.status(500).json({message : "Server Error"});
    }
}

// delete expense expense
exports.deleteExpense = async (req,res) => {
    const userId = req.user.id;
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.json({message : "Expense deleted successfully"});
    } catch (error) {
        res.status(500).json({message : "Server Error"});
    }
}

// download excel sheet of Expense
exports.downloadExpenseExcel = async (req, res) => {
  const userId = req.user._id;
  try {
    const expense = await Expense.find({ userId }).sort({ date: -1 });

    const data = expense.map((item) => ({
      category: item.category,
      Amount: item.amount,
      Date: item.date ? item.date.toISOString().split("T")[0] : "",
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Expense");

    // Ensure the folder exists
    const tempDir = path.join(__dirname, "../temp");
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    const filePath = path.join(tempDir, "expense_details.xlsx");
    xlsx.writeFile(wb, filePath);

    res.download(filePath, "expense_details.xlsx", (err) => {
      if (err) {
        console.error("Download error:", err);
        return res.status(500).send("Download failed");
      }

      // Clean up the file after download
      fs.unlink(filePath, (err) => {
        if (err) console.error("Failed to delete temp file:", err);
      });
    });
  } catch (err) {
    console.error("ExcelDownload expense error", err);
    res.status(500).json({ message: "Server Error" });
  }
};