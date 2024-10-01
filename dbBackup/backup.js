require('dotenv').config();
const { exec } = require('child_process');
const { DB_URI, BACKUP_PATH } = require('./config');

const backupDatabase = () => {
    const command = `mongodump --uri="${DB_URI}" --out="${BACKUP_PATH}"`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error creating backup: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Error output: ${stderr}`);
            return;
        }
        console.log(`Backup successful: ${stdout}`);
    });
};

backupDatabase();
