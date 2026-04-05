const xlsx = require("xlsx");
const path = require("path");
const fs = require("fs");
const Income = require("../models/Income");

// Add Income Source
exports.addIncome = async (req,res) => {
    const userId = req.user._id;
    try {
        const {icon, source, amount, date} = req.body;
        // check for missing fields
        if(!source || !amount || !date) {
            return res.status(400).json({message : "All fields are required"});
        }
        const newIncome = new Income ( {
            userId,
            icon,
            source,
            amount,
            date: new Date(date)
        });
        await newIncome.save();
        res.status(200).json(newIncome);
    }
    catch (err) {
        console.log("User in request:", req.user);
        console.error("Add Income Error:", err.message);
        res.status(500).json({message : "Server Error"})
    }
}

// get all income source
exports.getAllIncome = async (req,res) => {
    const userId = req.user._id;

    try {
        const income = await Income.find({userId}).sort({date : -1});
        res.json(income);
    }
    catch(err) {
        res.status(500).json({message : "Server Error"});
    }
}

// delete income source
exports.deleteIncome = async (req,res) => {
    const userId = req.user.id;
    try {
        await Income.findByIdAndDelete(req.params.id);
        res.json({message : "Income deleted successfully"});
    } catch (error) {
        res.status(500).json({message : "Server Error"});
    }
}

// download excel sheet of income
exports.downloadIncomeExcel = async (req, res) => {
  const userId = req.user._id;
  try {
    const income = await Income.find({ userId }).sort({ date: -1 });

    const data = income.map((item) => ({
      Source: item.source,
      Amount: item.amount,
      Date: item.date ? item.date.toISOString().split("T")[0] : "",
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Income");

    // Ensure the folder exists
    const tempDir = path.join(__dirname, "../temp");
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    const filePath = path.join(tempDir, "income_details.xlsx");
    xlsx.writeFile(wb, filePath);

    res.download(filePath, "income_details.xlsx", (err) => {
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
    console.error("ExcelDownload income error", err);
    res.status(500).json({ message: "Server Error" });
  }
};