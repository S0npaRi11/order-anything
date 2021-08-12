const CRUD = {

    readAll(collection, finder = {}){
        return collection.find(finder)
    },

    readOne(collection, id){
        return collection.findById(id)
    },

    update(collection,updatedObjct,id){
        return collection.findByIdAndUpdate(id,updatedObjct)
    },

    delete(collection,id){
        return collection.findByIdAndRemove(id)
    },

    findOne(collection, finder){
        return collection.findOne(finder)
    },
    save(collection, data){
        const newData = new collection(data)
        return newData.save()
    }
}

module.exports = CRUD;