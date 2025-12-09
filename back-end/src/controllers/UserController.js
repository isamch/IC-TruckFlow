// import  from "./../models/";
// import {  } from '../utils/'



export const getAlluser = (req, res) => {


  res.send("Get all user");
};



export const getuser = (req, res) => {


  res.send(`Get single user with id ${req.params.id}`);
};



export const createuser = (req, res) => {

  
  res.send("Create new user");
};


export const updateuser = (req, res) => {


  res.send(`Update user with id ${req.params.id}`);
};



export const deleteuser = (req, res) => {


  res.send(`Delete user with id ${req.params.id}`);
};