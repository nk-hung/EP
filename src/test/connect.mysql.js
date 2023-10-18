const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '@Hungnk98',
    database: 'shopDev'
})

const batchSize = 100000;
const totalSize = 10000000;

let currentId = 1;
const insertBatch = async () => {
    const values = [];
    for (let i = 0; i < batchSize && currentId <= totalSize; i++) {
        const name = `Name - ${currentId}`;
        const age = currentId;
        const address = `Address - ${currentId}`
        values.push([currentId, name, age, address]);
        currentId++
    }

    if (!values.length) {
        pool.end(err => {
            if (err) {
                console.log(`Error::: ${err}`)
            } else {
                console.log(`Connect pool successfully!!!`)
            }

            return;
        })
    }

    const sql = `INSERT INTO test_shop (id, name, age, address) VALUES ?`

    pool.query(sql, [values], async (err, result) => {
        if (err) throw err
        console.log(`Insert success ::: ${result.affectedRows} records!!!`)
        await insertBatch()
    })
}

insertBatch()