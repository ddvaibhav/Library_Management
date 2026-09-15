const { model } = require('mongoose');
const { LibraryVisitSchema } = require('../schemas/LibraryVisitSchema');

const LibraryVisitModel = new model('LibraryVisit', LibraryVisitSchema);

module.exports = { LibraryVisitModel };
