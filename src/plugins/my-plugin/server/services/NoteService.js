module.exports = (Note) => {
  return {
    async findMany(query = {}) {
      return await Note.findAll(query);
    },

    async findById(id) {
      return await Note.findByPk(id);
    },

    async create(data) {
      return await Note.create(data);
    },

    async update(id, data) {
      const note = await this.findById(id);
      if (!note) return null;
      return await note.update(data);
    },

    async delete(id) {
      const note = await this.findById(id);
      if (!note) return null;
      await note.destroy();
      return true;
    }
  };
};
