require('dotenv').config();
const { exec } = require('child_process');
const { DB_URI, BACKUP_PATH } = require('./config');

const restoreDatabase = () => {
    // const command = `mongorestore --uri ${DB_URI} ${BACKUP_PATH}`;
    const command = `mongorestore --uri="${DB_URI}" --nsInclude="freelancefusion_backup_test*" ${BACKUP_PATH}/freelancefusion_backup_test`;


    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error restoring database: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Error output: ${stderr}`);
            return;
        }
        console.log(`Restore successful: ${stdout}`);
    });
};

restoreDatabase();
