module.exports = (NoteService) => {
  return {
    async findAll(ctx) {
      try {
        const notes = await NoteService.findMany();
        ctx.status = 200;
        ctx.body = notes;
      } catch (err) {
        ctx.status = 500;
        ctx.body = { error: err.message };
      }
    },

    async findOne(ctx) {
      try {
        const note = await NoteService.findById(ctx.params.id);
        if (!note) {
          ctx.status = 404;
          ctx.body = { error: 'Note not found' };
          return;
        }
        ctx.status = 200;
        ctx.body = note;
      } catch (err) {
        ctx.status = 500;
        ctx.body = { error: err.message };
      }
    },

    async create(ctx) {
      try {
        const note = await NoteService.create(ctx.request.body);
        ctx.status = 201;
        ctx.body = note;
      } catch (err) {
        ctx.status = 400;
        ctx.body = { error: err.message };
      }
    },

    async update(ctx) {
      try {
        const note = await NoteService.update(ctx.params.id, ctx.request.body);
        if (!note) {
          ctx.status = 404;
          ctx.body = { error: 'Note not found' };
          return;
        }
        ctx.status = 200;
        ctx.body = note;
      } catch (err) {
        ctx.status = 400;
        ctx.body = { error: err.message };
      }
    },

    async destroy(ctx) {
      try {
        const result = await NoteService.delete(ctx.params.id);
        if (!result) {
          ctx.status = 404;
          ctx.body = { error: 'Note not found' };
          return;
        }
        ctx.status = 204;
      } catch (err) {
        ctx.status = 500;
        ctx.body = { error: err.message };
      }
    }
  };
};
