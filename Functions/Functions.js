import pool from './DBConnection.js';  // Use 'import' to get the connection pool

async function showAllPackages() {
    try {
        const [rows, fields] = await pool.query("SELECT * FROM package");
        console.log(rows);
    } catch (error) {
        console.error(error);
    }
}


//showAllPackages();

async function findPackage(id) {                    
    try {
        const [rows, fields] = await pool.query("SELECT * FROM package WHERE id = ?",[id]);
        console.log(rows);
    } catch (error) {
        console.error(error);
    }
}
//findPackage('PKG001')

//Query Entity function
async function queryForEntity(entity) {                    
    try {
        const [rows, fields] = await pool.query('SELECT * FROM ??',[entity]); // double ?? to escape table names
        console.log(rows);
    } catch (error) {
        console.error(error);
    }
}
let entity = 'pickup';
queryForEntity(entity);
