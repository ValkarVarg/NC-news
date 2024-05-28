const db = require("../db/connection");

const fs = require("fs/promises")


exports.fetchTopics = () => {
return db.query(`SELECT * FROM topics;`)
.then (({rows}) => {return rows})
}

exports.fetchEndpoints = () => {
    return fs.readFile("./endpoints.json")
    .then((endpointData) => {
    const endpoints = JSON.parse(endpointData)
    return {endpoints}
    })
    }
