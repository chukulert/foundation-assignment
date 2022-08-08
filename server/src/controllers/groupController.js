const db = require("../config/database");

exports.getAllGroups = async (req, res, next) => {
    try {
    const query = `SELECT * FROM assignment.groups`;
    const queryUsers = await db.promise().query(query);
    const results = queryUsers[0]
    res.status(200).json(results)
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
