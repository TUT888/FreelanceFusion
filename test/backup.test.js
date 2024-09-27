

const chai = require('chai');
const chaiHttp = require('chai-http');
const { exec } = require('child_process');
const { DB_URI,BACKUP_PATH } = require('../dbBackup/config');
const fs = require('fs');
const path = require('path');
const client = require('../dbConnection');


chai.use(chaiHttp);
const expect = chai.expect;

describe('Database Backup', function()  {
    this.timeout(10000);

    it('should create a backup successfully', (done) => {
        exec('npm run backup', (error, stdout, stderr) => {
            if (error) {
                done(new Error(`Backup process error: ${error.message}`));
            } else if (stderr && stderr.includes('error')) {
                done(new Error(`Backup failed: ${stderr}`));
            } else {
                const backupDir = path.join(__dirname, '../', BACKUP_PATH);
                const backupExists = fs.existsSync(backupDir);

                expect(backupExists).to.be.true;
                done();
            }
        });
    });
});


describe('Database drop',  function()  {
    this.timeout(10000);

    it('should drop the database successfully', async () => {
        try {

            await client.connect();

            const db = client.db(); // Connect to the database
            await db.dropDatabase(); // Drop the database

            console.log('Database dropped successfully');
            // await client.close(); // Close the connection
        } catch (err) {
            throw new Error('Failed to drop database: ' + err.message);
        }
    });
});




describe('Database Restore', function()  {
    this.timeout(10000);
    it('should restore the database successfully', (done) => {
        exec('npm run restore', (error, stdout, stderr) => {
            if (error) {
                done(new Error(`Restore failed: ${stderr || error.message}`));
            } else if (stderr && stderr.includes('error')) {
                done(new Error(`Restore failed: ${stderr}`));

            }
            
            else {
  
       
                done();
            }
        });
    });
});
