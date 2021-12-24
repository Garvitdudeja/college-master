require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios").default;
const cheerio = require("cheerio");
const cors = require("cors");
const { next } = require("cheerio/lib/api/traversing");

const OurApp = express();

OurApp.use(express.urlencoded({ extended: false }));
OurApp.use(cors());

//importing schemas
const Teacher = require("./schema/teacher");
const Faculty = require("./schema/faculty");
const SubDepartment = require("./schema/subDepartment");

OurApp.use(express.json());
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("connection extablished!"))
  .catch((err) => {
    console.log(err);
  });

const getData = async function (id) {
  // tableinfo = [ [citations_all , citations_since 2016] , [hindex_all, hindex_since2016 ] , [i10index_all , i10index_since2016] ]
  let tableinfo = [
    [0, 0],
    [0, 0],
    [0, 0],
  ];

  // graphinfo = [ [ year , no_of_citations ] , ... ]
  let graphinfo = [];

  const photoUrl =
    "https://scholar.googleusercontent.com/citations?view_op=view_photo&user=" +
    id;
  const url = "https://scholar.google.com/citations?user=" + id + "&hl=en";
  try {
    // gets the html data from the url
    const response = await axios.get(url);

    // loads the html data into a cheerio function
    const $ = cheerio.load(response.data);

    // uses cheerio function to select name from html
    const name = $("#gsc_prf_in").text();

    // Selects and Traverses the table data and saves data into an array 'table info'
    $("#gsc_rsb_st tbody")
      .children()
      .each((index, elem) => {
        $(elem)
          .children(".gsc_rsb_std")
          .each((j, elem2) => {
            tableinfo[index][j] = parseInt($(elem2).text());
          });
      });

    // Traverses graph data 'year' and add it to the array 'graphinfo
    $(".gsc_md_hist_b .gsc_g_t").each((index, elem) => {
      graphinfo.push([parseInt($(elem).text()), 0]);
    });

    const total = graphinfo.length;
    const Rlength = $(".gsc_md_hist_b").children(" a ").length;
    // Traverses no. of citations in that particular year and saves it to array
    $(".gsc_g_a").each((index, elem) => {
      //Exceptional case : When no. of citation in any year is zero, then its html element is not present.
      // In this case, we match the correct values by using z-index of element
      if (Rlength !== total) {
        //gets the string of style attribute
        var str = $(elem).attr("style");
        // slices the last two characters of the string, example: '10' or ':8'
        var x = str.slice(-2);
        //if x is ':8', then it becomes integer 8
        if (isNaN(x)) {
          x = parseInt(x[1]);
        } else {
          x = parseInt(x);
        }
        // adds the value to its correct index
        graphinfo[total - x][1] = parseInt($(elem).text());
      }
      // normal case
      else {
        graphinfo[index][1] = parseInt($(elem).text());
      }
    });

    // returns data object
    return {
      name: name,
      tableData: tableinfo,
      graphData: graphinfo,
      photoUrl: photoUrl,
    };
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// Route    - /user/:id
// Des      - To get a user data
// Access   - Public
// Method   - GET
// Params   - id
// Body    - none
OurApp.get("/user/:id", async (req, res) => {
  try {
    const data = await getData(req.params.id);
    console.log("express code continues");
    return res.json(data);
  } catch (error) {
    console.log(error);
    next(error);
  }
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
  const getDepartment= await Faculty.find({
  });
  return res.json( {getDepartment} );
});

//adding new faculty
OurApp.post("/faculty/new",async(req,res)=> {
  try{
  const {newFaculty}=req.body;
  await Faculty.create(newFaculty);
  return res.json({message: "new Faculty added"})
}
catch(error)
{
  return res.json({error: error.message});
}

})

// adding new subDepartment
OurApp.post("/subDepartment/new",async(req,res)=>{
  try{
    const {newSubDepartment}=req.body;
    await SubDepartment.create(newSubDepartment);
    return res.json({message: "new subDepartment added"})
  }
  catch(error)
  {
    return res.json({error: error.message});
  }
  
  })

// getting all the subDepartment Based upon faculty
OurApp.get("/subDepartment/:faculty",async(req,res)=>{
  const getSubDepartment = await SubDepartment.find({
    Faculty: req.params.faculty
  })
  return res.json({getSubDepartment})
})
OurApp.listen(5000, () => console.log("started the server"));
