const router = require('express').Router()
const tmdb = require('../models/tmdb_model')

router.get('/genres/movie', async (req, res) => {
    try {
        const result = await tmdb.getMovieGenres()
        res.json(result)
    } catch (err) {
        console.log(err)
        res.status(500).send({ error: err.message })
    }
})

router.get('/genres/series', async (req, res) => {
    try {
        const result = await tmdb.getTVGenres()
        res.json(result)
    } catch (err) {
        console.log(err)
        res.status(500).send({ error: err.message })
    }
})

router.get('/providers/:filter', async (req, res) => {
    try {
        const result = await tmdb.getProviders(req.params.filter)
        const filteredResult = result.results.map(provider => {
            return {
                provider_name: provider.provider_name,
                provider_id: provider.provider_id,
                logo_path: provider.logo_path
            }
        })
        res.json(filteredResult)
    } catch (err) {
        console.log(err)
        res.status(500).send({ error: err.message })
    }
})

router.get('/popular', async (req, res) => {
    try {
        const result = await tmdb.getPopularMovies()
        res.json(result)
    } catch (err) {
        console.log(err)
        res.status(500).send({ error: err.message })
    }
})

router.get('/trending', async (req, res) => {
    try {
        const result = await tmdb.getTrendingMovies()
        res.json(result)
    } catch (err) {
        console.log(err)
        res.status(500).send({ error: err.message })
    }
})

router.get('/movie/title/:title', async (req, res) => {
    try {
        const result = await tmdb.searchMovies(req.params.title)
        res.json(result)
    } catch (err) {
        console.log(err)
        res.status(500).send({ error: err.message })
    }
})

router.get('/multi/title/:title', async (req, res) => {
    try {
        const result = await tmdb.searchMulti(req.params.title)
        res.json(result)
    } catch (err) {
        console.log(err)
        res.status(500).send({ error: err.message })
    }
})

router.get('/movie/filter', async (req, res) => {
    try {
        const result = await tmdb.discoverMovies(req.query)
        res.json(result)
    } catch (err) {
        console.log(err)
        res.status(500).send({ error: err.message })
    }
})

router.get('/people/name/:name', async (req, res) => {
    try {
        const result = await tmdb.searchPeople(req.params.name)
        const filteredResult = result.results.map(person => {
            return {
                name: person.name,
                original_name: person.original_name,
                id: person.id,
                path: person.profile_path
            }
        })
        res.json(filteredResult)
    } catch (err) {
        console.log(err)
        res.status(500).send({ error: err.message })
    }
})

router.get('/movie/details/:id', async (req, res) => {
    try {
        const result = await tmdb.getMovieDetails(req.params.id)
        res.json(result)
    } catch (err) {
        console.log(err)
        res.status(500).send({ error: err.message })
    }
})

module.exports = router