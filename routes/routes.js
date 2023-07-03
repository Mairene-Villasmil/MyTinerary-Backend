const Router = require("express").Router()

const citiesControllers = require("../controllers/citiesControllers")
const {getAllCities,getOneCity, removeCity, addCity, addMultiplesCities, modifyCity, removeManyCities} = citiesControllers

Router.route("/cities")
.get(getAllCities)
.post((req, res)=>{Array.isArray(req.body.data) ?addMultiplesCities(req, res): addCity(req, res)})
.delete(removeManyCities)

Router.route("/cities/:id")
.get(getOneCity)
.delete(removeCity)
.put(modifyCity)

module.exports = Router