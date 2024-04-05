const db = require("../database/db_connection");

const groupContents = {
  getGroupContents: async (groupId) => {
    const result = await db.query("SELECT * FROM group_contents WHERE group_id = $1", [groupId]);
    return result.rows;
  },

  addGroupContent: async (groupContent) => {
    const result = await db.query(
      "INSERT INTO group_contents (group_id, media_id, showtime_id, added_by) VALUES ($1, $2, $3, $4) RETURNING *",
      [
        groupContent.groupId,
        groupContent.mediaId || null,
        groupContent.showtimeId || null,
        groupContent.addedBy,
      ],
    );
    return result.rows;
  },

  deleteGroupContentById: async (contentId) => {
    const result = await db.query("DELETE FROM group_contents WHERE content_id = $1 RETURNING *", [
      contentId,
    ]);
    return result.rows;
  },

  deleteAllGroupContent: async (groupId) => {
    await db.query("DELETE FROM group_contents WHERE group_id = $1", [groupId]);
  },

  getShowtimeById: async (id) => {
    return db.query("SELECT * FROM showtimes WHERE showtime_id = $1", [id]);
  },
};

module.exports = groupContents;