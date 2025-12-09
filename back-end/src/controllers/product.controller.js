// import  from "./../models/";
// import {  } from '../utils/'



export const getAllproduct = (req, res) => {


  res.send("Get all product");
};



export const getproduct = (req, res) => {


  res.send(`Get single product with id ${req.params.id}`);
};



export const createproduct = (req, res) => {

  
  res.send("Create new product");
};


export const updateproduct = (req, res) => {


  res.send(`Update product with id ${req.params.id}`);
};



export const deleteproduct = (req, res) => {


  res.send(`Delete product with id ${req.params.id}`);
};