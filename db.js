var sqlite3 = require('sqlite3');

function create(){
    new sqlite3.Database('./mcu.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err && err.code == "SQLITE_CANTOPEN") {
        createDatabase();
        return;
        } else if (err) {
            console.log("Getting error " + err);
            exit(1);
    }
    //runQueries(db);
});
}
function createDatabase() {
    var newdb = new sqlite3.Database('mcu.db', (err) => {
        if (err) {
            console.log("Getting error " + err);
            exit(1);
        }
        createTables(newdb);
    });
}
function createTables(newdb) {
    newdb.exec(`
    create table whitelist (
        pin int primary key not null
    );`, ()  => {
            //runQueries(newdb);
    });
}

function allow(pin){
    var newdb = new sqlite3.Database('mcu.db', (err) => {
        if (err) {
            console.log("Getting error " + err);
            exit(1);
        }
        newdb.exec(
        "insert into whitelist (pin) values ("+pin+");"
        , ()  => {
        });
    });
}
function deny(pin){
    var newdb = new sqlite3.Database('mcu.db', (err) => {
        if (err) {
            console.log("Getting error " + err);
            exit(1);
        }
        newdb.exec(
        "delete from whitelist where pin=" + pin+ ";"
        , ()  => {
        });
    });
}
async function whitelist(){
    let list = []
    var newdb = new sqlite3.Database('mcu.db', (err) => {
        if (err) {
            console.log("Getting error " + err);
            exit(1);
        }
    });
    console.log(newdb)
    let r = await new Promise((resolve, reject) => {
        newdb.all('SELECT * FROM whitelist',[],(err,rows)=>{
            if(err){
                return console.error(err.message);
            }else{   
                rows.forEach((row)=>{
                    list.push(row)    
                });
                resolve(list);
            }

        });
    });
    console.log(r)
    return list;
}
module.exports = {
    create,
    allow,
    deny,
    whitelist,
}