const fs = require('fs')
const path = require('path')

module.exports = function (dir, excludes = []) {
  return fs.readdirSync(dir)
    .filter(filename => excludes.indexOf(filename) === -1)
    .map(filename => path.resolve(dir, filename))
}
