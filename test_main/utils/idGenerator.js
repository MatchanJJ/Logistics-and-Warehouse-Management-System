import pool from "../DBConnection.js"
import { nanoid } from "nanoid";

// Export token manager
const token_manager = {
    generateID
};

// GenerateID
async function generateID(table, primaryKeyColumn, idConvention) {
    const id = idConvention + nanoid(7);
    if (await idExists(table, primaryKeyColumn, id)) {
        return generateID(table, primaryKeyColumn, idConvention);
    }
    return id;
};

// returns 1 if idExists
async function idExists(table, primaryKeyColumn, primaryKeyValue) {
    try {
        const query = `SELECT EXISTS(SELECT 1 FROM \`${table}\` WHERE \`${primaryKeyColumn}\` = ?) AS id_exists`;
        const [rows] = await pool.query(query, [primaryKeyValue]);
        return rows[0].id_exists;
    } catch (error) {
        console.error(error);
        return false;
    }
};

export default token_manager;