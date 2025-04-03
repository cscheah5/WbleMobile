import {SQLiteDatabase, enablePromise, openDatabase} from 'react-native-sqlite-storage';

const databaseName = 'SampleDB';

// Enable promise for SQLite
enablePromise(true);

export const getDBConnection = async() => {
    return openDatabase(
        {name: `${databaseName}`},
        openCallback,
        errorCallback,
    );
}


export const createTableStudents = async( db: SQLiteDatabase ) => {
    try{
        const query = 'CREATE TABLE IF NOT EXISTS students(id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(20), email VARCHAR(20), state VARCHAR(20))';
        await db.executeSql(query);
      } catch (error) {
        console.error(error);
        throw Error('Failed to create table !!!');
      }
}


export const getStudents = async( db: SQLiteDatabase ): Promise<any> => {
    try{
        const studentData : any = [];
        const query = `SELECT * FROM students ORDER BY name`;
        const results = await db.executeSql(query);
        results.forEach(result => {
            (result.rows.raw()).forEach(( item:any ) => {
                studentData.push(item);
            })
          });
        return studentData;
      } catch (error) {
        console.error(error);
        throw Error('Failed to get students !!!');
      }
}


export const getStudentsById = async( db: SQLiteDatabase, studentId: string ): Promise<any> => {
    try{
        const studentData : any = [];
        const query = `SELECT * FROM students WHERE id=?`;
        const results = await db.executeSql(query,[studentId]);
        return results[0].rows.item(0)
      } catch (error) {
        console.error(error);
        throw Error('Failed to get student !!!');
      }
}


export const createStudent = async( 
        db: SQLiteDatabase,
        name: string,
        email : string,
        state : string
    ) => {
    try{
        const query = 'INSERT INTO students(name,email,state) VALUES(?,?,?)';
        const parameters = [name,email,state]
        await db.executeSql(query,parameters);
      } catch (error) {
        console.error(error);
        throw Error('Failed to create student !!!');
      }
}



export const updateStudent = async( 
    db: SQLiteDatabase,
    name: string,
    email : string,
    state : string,
    studentID: string
) => {
try{
    const query = 'UPDATE students SET name=?,email=?,state=? WHERE id=?';
    const parameters = [name,email,state, studentID]
    await db.executeSql(query,parameters);
  } catch (error) {
    console.error(error);
    throw Error('Failed to update student !!!');
  }
}

export const deleteStudent = async( 
    db: SQLiteDatabase,
    studentId: string
    ) => {
    try{
        const query = 'DELETE FROM students WHERE id = ?' ;
        await db.executeSql(query,[studentId]);
    } catch (error) {
        console.error(error);
        throw Error('Failed to delete student !!!');
    }
}

const openCallback = () => {
    console.log('database open success');
}

const errorCallback = (err: any) => {
    console.log('Error in opening the database: ' + err);
}