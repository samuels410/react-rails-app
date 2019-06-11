process.env.NODE_ENV = process.env.NODE_ENV || 'development'

process.env.REACT_APP_API_URL='https://migolympus1.greatlearning.in/api/'
process.env.REACT_APP_API_URL_1='https://migolympus.greatlearning.in/api/'
process.env.REACT_APP_API_ACCESS_TOKEN='t8ODZiHgCh8xdvJlImdeOcv4LD9HtW5ZGN8ekuYl7VF1Vv7PLK09x1WMx63jjycE'
process.env.REACT_APP_API_ACCESS_TOKEN_1='t8ODZiHgCh8xdvJlImdeOcv4LD9HtW5ZGN8ekuYl7VF1Vv7PLK09x1WMx63jjycE'


const environment = require('./environment')

module.exports = environment.toWebpackConfig()
