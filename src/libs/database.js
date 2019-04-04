const mysql = require('mysql');
const connection = mysql.createConnection({
    host: '39.108.99.240',
    user: 'dev',
    port: 45036,
    password: 'Dev@2019',
    database: 'deepbrief'
});
connection.connect();
export const query = () => {
    connection.query('SELECT * from dictionary', function(error, results, fields) {
        if (error) throw error;
        console.log(results);
    });
};