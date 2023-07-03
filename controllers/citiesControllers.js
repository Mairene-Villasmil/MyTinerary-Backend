const Cities = require("../models/citiesmodel")

const citiesControllers = {
    getAllCities: async (req, res) => {
        let cities
        let error = null

        try {
            cities = await Cities.find()
        } catch (err) {
            error = err
        }
        res.json({
            response: error ? "ERROR" : { cities },
            success: error ? false : true,
            error: error
        })
    },
    getOneCity: async (req, res) => {
        const id = req.params.id
        let city
        let error = null

        try {
            city = await Cities.find({ _id: id })
        } catch (err) { error = err }
        res.json({
            response: error ? "ERROR" : city,
            success: error ? false : true,
            error: error
        })
    },
    modifyCity: async (req, res) => {
        const id = req.params.id
        const data = req.body.data

        let city
        let error = null

        try {
            city = await Cities.findOneAndUpdate({ _id: id }, data, { new: true })
        }
        catch (err) { error = err }
        res.json({
            response: error ? "ERROR" : city,
            success: error ? false : true,
            error: error
        })
    },
    addCity: async (req, res) => {
        const { name, country, image, population, description, currency, language } = req.body.data
        let city
        let error = null

        try {
            let CityExist = await Cities.find({ name: { $regex: name, $options: 'i' } })
            if (CityExist.length == 0) {
                city = await new Cities({
                    name: name,
                    country: country,
                    image: image,
                    population: population,
                    description: description,
                    currency: currency,
                    language: language,
                }).save()
            } else {
                error = "this city already exists in the DB" + CityExist[0]._id
            }
        } catch (err) { error = err }

        res.json({
            response: error ? "ERROR" : city,
            success: error ? false : true,
            error: error
        })
    },
    addMultiplesCities: async (req, res) => {
        let error = []
        let cities = []

        try {
            for (let city of req.body.data) {
                let verifyCityExist = await Cities.find({ name: { $regex: city.name, $options: 'i' } })
                if (verifyCityExist.length == 0) {
                    let dataCity =
                    {
                        name: city.name,
                        country: city.country,
                        image: city.image,
                        population: city.population,
                        description: city.description,
                        currency: city.currency,
                        language: city.language,
                    }

                    await new Cities({
                        ...dataCity
                    }).save()
                    cities.push(dataCity)
                } else {
                    error.push({
                        name: city.name,
                        result: "the ID already exists in the DB: " + verifyCityExist[0]._id
                    })
                }
            }
        } catch (err) { error = err }
        res.json({
            response: error.length > 0 && cities.length === 0 ? "ERROR" : cities,
            success: error.length > 0 ? (cities.length > 0 ? "warning" : false) : true,
            error: error
        })
    },
    removeCity: async (req, res) => {
        const id = req.params.id
        let city
        let error = null

        try {
            city = await Cities.findOneAndDelete({ _id: id })
        } catch (err) { error = err }
        res.json({
            response: error ? "ERROR" : city,
            success: error ? false : true,
            error: error
        })
    },
    removeManyCities: async (req, res) => {
        const data = req.body.data
        let citiesDelete = []
        let error = []

        try {
            let city
            for (let id of data) {
                city = await Cities.findOneAndDelete({ _id: id })
                if (city) {
                    citiesDelete.push(city)
                } else {
                    error.push({
                        id: id,
                        error: "the ID you want to delete was not found"
                    })
                }
            }
        } catch (err) { error = err }

        res.json({
            response: error.length > 0 && citiesDelete.length === 0 ? "ERROR" : citiesDelete,
            success: error.length > 0 ? (citiesDelete.length > 0 ? "warning" : false) : true,
            error: error
        })
    }
}

module.exports = citiesControllers