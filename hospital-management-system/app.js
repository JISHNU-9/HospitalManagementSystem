//use path module
const path = require('path');
//use express module
const express = require('express');
//use hbs view engine
const hbs = require('hbs');
//use bodyParser middleware
const bodyParser = require('body-parser');
//use mysql database
const mysql = require('mysql');
const app = express();
 

app.use(express.static('static'));
//Create connection
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'jesussavesus',
  database: 'hospital_management'
});
 
//connect to database
conn.connect((err) =>{
  if(err) throw err;
  console.log('Mysql Connected...');
});
 
//set views file
app.set('views',path.join(__dirname,'views'));
//set view engine
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//set public folder as static folder for static file
app.use('/assets',express.static(__dirname + '/public'));
 
//route for homepage
app.get('/',(req, res) => {
  let sql = "SELECT * FROM patient";
  let sql1 =  "SELECT * FROM doctor";
  let sql2 ="select * from room where Room_status='Free'"
 

  let i =0;
  let j=0;
  let k=0;
  let query = conn.query(sql,(err, results) => {
    if(err) throw err;
    results.forEach((element)=>{
      
      i=i+1;
     
      return i
     })
  
  });
  let query0 = conn.query(sql2,(err, results) => {
    if(err) throw err;
    results.forEach((element)=>{
      
      k=k+1;
     
      return k
      
     })
     console.log(k)
  });
  let query1 = conn.query(sql1,(err, results) => {
    if(err) throw err;

    

    results.forEach((element)=>{
      
      j=j+1;
     
      return j
     })
     res.render('landing',{
      
      i,j,k,results: results
    });
  
  });
  



});


app.get('/patient',(req, res) => {
  let sql = "SELECT * FROM patient";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    // console.log(results)
    res.render('patient_view',{
      
      results: results
    });
  });
});

 
//route for insert data
app.post('/save',(req, res) => {
 
  let data = {Patient_id : req.body.Patient_id, Patient_name: req.body.patient_name, Patient_DOB: req.body.patient_dob, Patient_gender: req.body.patient_gender, Patient_address: req.body.patient_address, contact_number1: req.body.contact_number1, contact_number2 : req.body.contact_number2, Disease : req.body.Disease, patient_weight : req.body.patient_weight, Patient_age : req.body.Patient_age};
  let sql = "INSERT INTO patient SET ?";
  let query = conn.query(sql, data,(err, results) => {
    if(err) throw err;
    res.redirect('/');
  });
});


app.post('/savedoctor',(req, res) => {

  let Doctor_id = req.body.Doctor_id;
  let data1 = {Employye_id :req.body.Doctor_id,  Specialization: req.body.specialization, Doctor_category: req.body.doctor_category,Employee_name: req.body.employee_name,Email_id: req.body.email_id,contact_number1: req.body.number1,contact_number2: req.body.number2,Salary: req.body.salary,Date_of_birth: req.body.dob,Age: req.body.age,Dept_id: req.body.dept_id};
  
  
  let sql = "INSERT INTO  employee values ('"+req.body.Doctor_id+"' , '"+req.body.employee_name+"' , '"+req.body.email_id+"', '"+req.body.number1+"' , '"+req.body.number2+"' ,'"+req.body.salary+"' , '"+req.body.dob+"' ,'"+req.body.age+"' , '"+req.body.dept_id+"')"

   let sql1 = "INSERT INTO doctor values ('"+req.body.Doctor_id+"' ,'"+req.body.specialization+"' ,'"+req.body.doctor_category+"' )";
  // console.log(sql)
  // console.log(sql1)

  let query1 = conn.query(sql, data1,(err, results) => {
    if(err) throw err;
   
  });
  let query = conn.query(sql1, data1,(err, results) => {
    if(err) throw err;
    res.redirect('/doctor');
    
  });
});

 

//route for update data
app.post('/update',(req, res) => {
  let sql = "UPDATE patient SET Patient_name='"+req.body.patient_name + "', Patient_DOB='" + req.body.patient_dob+"',Patient_gender='" + req.body.patient_gender+
  "',Patient_address='" + req.body.patient_address+"' ,contact_number1='" + req.body.contact_number1 + "' ,contact_number2='" + req.body.contact_number2+ "' ,Disease='" + req.body.Disease+ "' ,patient_weight='" + req.body.patient_weight+"' ,Patient_age='" + req.body.Patient_age+"' WHERE Patient_id="+req.body.Patient_id;
  // console.log(sql)
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.redirect('/');
  });
});

app.post('/updatedoctor',(req, res) => {

  
  let sql = "UPDATE doctor SET  Doctor_category='" + req.body.doctor_category+ " ' WHERE Doctor_id='"+req.body.Doctor_id +"' "
  let sql1 = " UPDATE employee SET Employee_name= '" + req.body.employee_name+ "', Email_id= '" + req.body.email_id+ "',contact_number1= '" + req.body.number1+ "',Salary= '" + req.body.salary+ "' WHERE Employee_id='"+req.body.Doctor_id +"'   "
  // console.log(sql)
  let query1 = conn.query(sql1, (err, results) => {
    if(err) throw err;
    res.redirect('/');
  });

  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
  });
});



 
//route for delete data
app.post('/delete',(req, res) => {
  let sql = "DELETE FROM patient WHERE Patient_id="+req.body.Patient_id+"";
  let sql1 = "DELETE FROM consults WHERE Patient_id="+req.body.Patient_id+"";
  let sql2 = "DELETE FROM patient_medicine WHERE Patient_id="+req.body.Patient_id+"";
  let sql3 = "DELETE FROM alloted_room WHERE Patient_id="+req.body.Patient_id+"";
  let sql4 = "DELETE FROM in_patient WHERE Patient_id="+req.body.Patient_id+"";
  let sql5 = "DELETE FROM out_patient WHERE Patient_id="+req.body.Patient_id+"";
  let sql6 = "DELETE FROM issued_bill WHERE Patient_id="+req.body.Patient_id+"";
  let sql7= "DELETE FROM patient_medicine WHERE Patient_id="+req.body.Patient_id+"";
  let sql8 = "DELETE FROM lab_report WHERE Patient_id="+req.body.Patient_id+"";
  let sql9 = "DELETE FROM registration_details WHERE Patient_id="+req.body.Patient_id+"";
  
  let sql10 = "delete from checks where lab_report_id in (select lab_report_id from lab_report where Patient_id = "+req.body.Patient_id+" ); "




  let query10 = conn.query(sql10, (err, results) => {
    if(err) throw err;
  });

  let query9 = conn.query(sql9, (err, results) => {
    if(err) throw err;
  });
 
  let query2 = conn.query(sql2, (err, results) => {
    if(err) throw err;
  });
  let query3 = conn.query(sql3, (err, results) => {
    if(err) throw err;
  });
  let query4 = conn.query(sql4, (err, results) => {
    if(err) throw err;
  });
  let query5 = conn.query(sql5, (err, results) => {
    if(err) throw err;
  });
  let query6 = conn.query(sql6, (err, results) => {
    if(err) throw err;
  });
  let query7 = conn.query(sql7, (err, results) => {
    if(err) throw err;
  });
  let query8= conn.query(sql8, (err, results) => {
    if(err) throw err;
  });
  let query1 = conn.query(sql1, (err, results) => {
    if(err) throw err;
  });
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
      res.redirect('/');
  });
});


app.post('/deletedoctor',(req, res) => {

  let sql = "DELETE FROM doctor WHERE Doctor_id="+req.body.Doctor_id+"";
  let sql1 = "DELETE FROM employee WHERE Employee_id="+req.body.Doctor_id+"";
  let sql2 = "DELETE FROM checks WHERE Doctor_id="+req.body.Doctor_id+"";
  let sql3 = "DELETE FROM in_patient WHERE Doctor_id="+req.body.Doctor_id+"";
  let sql4 = "DELETE FROM consults WHERE Doctor_id="+req.body.Doctor_id+"";

  let sql5 = "delete from alloted_room where Patient_id in (select Patient_id from in_patient where Doctor_id="+req.body.Doctor_id+" ); "


  let query5 = conn.query(sql5, (err, results) => {
    if(err) throw err;

  });
  let query4 = conn.query(sql4, (err, results) => {
    if(err) throw err;
  });
  let query3 = conn.query(sql3, (err, results) => {
    if(err) throw err;
  });
  let query2 = conn.query(sql2, (err, results) => {
    if(err) throw err;
  });
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
  });
  let query1 = conn.query(sql1, (err, results) => {
    if(err) throw err;
    res.redirect('/');

  });

});








app.get('/doctor',(req,res)=>{
  let sql = "SELECT * FROM doctor,employee where doctor.Doctor_id = employee.Employee_id"
  

  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    // console.log(results)
    res.render('doctor_view',{
      results: results
    });
  });

})


app.get('/bill',(req,res)=>{
  let sql = "SELECT * FROM doctor,employee where doctor.Doctor_id = employee.Employee_id"
  

  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.render('bill_view',{
      results: results
    });
  });

})

app.post('/displaybill',(req,res)=>{
  let sql = "SELECT * FROM bill where Bill_id =  '"+req.body.bill_id+" ' "
  // console.log(req.body.bill_id)

  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    // console.log(results)
    // console.log(req.body.bill_id)
    // let v = (results[0].Bill_id)
    // console.log(v)
    r=JSON.parse(JSON.stringify(results))
    console.log(r)
    res.render('billdisplay',{
      results: results
    });
  });

})
app.get('/allbills',(req,res)=>{
  let sql = "SELECT * FROM bill  "
  // console.log(req.body.bill_id)

  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    // console.log(results)
    res.render('display_bill',{
      results: results
    });
  });

})

app.get('/patientdetails',(req,res)=>{
  let sql = "SELECT * FROM bill  "

  getId = req.params.id
  // console.log(getId)

  let query = conn.query(sql, getId,(err, results) => {
    if(err) throw err;
    // console.log(results.Patient_id)
    res.render('patientdetails',{
      results: results
    });
  });

})



app.get('/medicine',(req,res)=>{
  let sql = "SELECT * FROM pharmacy"
  

  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    //  console.log(results)
    res.render('medicine',{
      results: results
    });
  });

})
app.get('/rooms',(req,res)=>{

  let sql ="select * from room where Room_status='Free'"
  

  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    //  console.log(results)
    res.render('rooms',{
      results: results
    });
  });

})






 
//server listening
app.listen(4000, () => {
  console.log('Server is running at port 5000');
});
