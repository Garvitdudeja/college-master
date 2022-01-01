require("dotenv").config();
const express = require("express");
const OurApp = express.Router();
const mongoose = require("mongoose");

const scholar = require("./scholar");

//importing schemas
const Teacher = require("./schema/teacher");
const Faculty = require("./schema/faculty");
const SubDepartment = require("./schema/subDepartment");
const apiData = require("./schema/api");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("connection extablished!"))
  .catch((err) => {
    console.log(err);
  });

OurApp.get("/", (request, response) => {
  response.json({ message: "link working" });
});

//getting teacher with department
OurApp.get("/teacher/:faculity/:subdepartment", async (req, res) => {
  const getTeachers = await Teacher.find({
    Faculity: req.params.faculity,
    SubDepartment: req.params.subdepartment,
  });
  return res.json({ getTeachers });
});

//Adding new teachers
OurApp.post("/teacher/new", async (req, res) => {
  try {
    const { newTeacher } = req.body;
    await Teacher.create(newTeacher);
    return res.json({ message: "new teacher added" });
  } catch (error) {
    return res.json({ error: error.message });
  }
});

//Getting all faculty
OurApp.get("/faculty", async (req, res) => {
  const getDepartment = await Faculty.find({});
  return res.json({ getDepartment });
});

//adding new faculty
OurApp.post("/faculty/new", async (req, res) => {
  try {
    const { newFaculty } = req.body;
    await Faculty.create(newFaculty);
    return res.json({ message: "new Faculty added" });
  } catch (error) {
    return res.json({ error: error.message });
  }
});

// adding new subDepartment
OurApp.post("/subDepartment/new", async (req, res) => {
  try {
    const { newSub } = req.body;
    const fullData = await apiData.find({
      subDepartment: newSub.SubDepartment,
    });
    var A = [];
    var B = [];
    fullData.map((id) => {
      A.push(id.tableData);
    });
    const getAll = (no) => {
      const y = A.map((each) => {
        return each[no];
      });
      var sum = 0,
        sum1 = 0;
      var count = 0;
      y.map((arr) => {
        sum += arr[0];
        sum1 += arr[1];
        count += 1;
      });
      B.push(sum / count);
      B.push(sum1 / count);
      return y;
    };
    getAll(0);
    getAll(1);
    getAll(2);
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();

    const newDate = year + "-" + month + "-" + day;
    console.log(newDate);
    const updateData = {
      Faculty: newSub.Faculty,
      SubDepartment: newSub.SubDepartment,
      DisplayName: newSub.DisplayName,
      getAll: B,
      Date: newDate,
    }
    await SubDepartment.findOneAndUpdate({SubDepartment: newSub.SubDepartment},updateData,{new:true});
    return res.json({message: "new Subdepartment created"})

  } catch (error) {
    return res.json({ error: error.message });
  }
});

// getting all the subDepartment Based upon faculty
OurApp.get("/subDepartment/:faculty", async (req, res) => {
  const getSubDepartment = await SubDepartment.find({
    Faculty: req.params.faculty,
  });
  return res.json({ getSubDepartment });
});

OurApp.get("/apiData/:subDepartment", async (req, res) => {
  const getApidata = await apiData.find({
    subDepartment: req.params.subDepartment,
  });
  res.json({ getApidata });
});

module.exports = OurApp;
