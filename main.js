const { 
  app, 
  BrowserWindow, 
  ipcMain, 
  nativeTheme,
  dialog 
} = require('electron');

const path = require('node:path');
const fs = require('fs');
const csv = require('csv-parser');


const { 
  addMilitaryData, 
  getMilitaryData,
  updateMilitaryData,
  deleteMilitaryById,
  getMilitaryByNumber,
  hasMilitaryRecords
} = require('./dataBase/military');

const { 
  addClassroomData,
  hasClassroomRecords, 
  createClassroomRecords, 
  getClassroomData,
  getClassroomById,
  getClassroomByNumber,
  updateClassroomData,
  updateNumberOfMilitary 
} = require('./dataBase/classroom');

const { 
  createClassroomMilitayData,
  addClassroomMilitaryData,
  getClassroomByMilitaryId,
  updateClassroomMilitaryData
} = require('./dataBase/classroomMilitary')

const { 
  initializeDatabase, 
  getCombinedData, 
  simpleSearchMilitary,
  advancedSearchMilitary,
  getCombinedDataEdit
} = require('./dataBase/database')

const { validateCsvRecord } = require('./src/public/js/validateCsv')


let mainWindow; 
//main window
const createWindow = () => {
  nativeTheme.themeSource = 'dark';

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  mainWindow.loadFile('./src/views/index.html');

  if(!hasClassroomRecords()){
    openClassroomDialog();
  }
}

//first dialog classroom
const openClassroomDialog = () => {
  const father = BrowserWindow.getFocusedWindow() || mainWindow;
  if(father) {
    const classroomDialogWindow = new BrowserWindow({
      parent: mainWindow,
      modal: true,
      width: 450,
      height: 250,
      resizable: false,
      autoHideMenuBar: true,
      center: true,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: false,
        contextIsolation: true
      }
    });

    classroomDialogWindow.loadFile('./src/views/classroomDialog.html');

    ipcMain.handle(
      'submit-classroomDialog-data', 
      async (event, classroomCount) => {
        try {
          // Converte o valor recebido em um número inteiro
          const count = parseInt(classroomCount, 10);
          // Cria os registros de classroom
          if (count >= 1) {
            await createClassroomRecords(count);
            // Fecha a janela de diálogo somente após o envio bem-sucedido
            if (classroomDialogWindow) {
              classroomDialogWindow.close();
            }
            return { success: true };
          } else {
            return { success: false, error: 'Número inválido de turmas' };
          }
        } catch (error) {
          console.error('Erro ao criar registros de turmas:', error);
          return { success: false, error: error.message };
        }
      }
    );

  }
}

//Main Military Window
let militaryWindow
const mainMilitaryWindow = () => {
  //Does not allow more than one instance to be opened
  if (militaryWindow !== undefined && militaryWindow !== null) {
    if (militaryWindow.isMinimized()) { 
      militaryWindow.restore() 
    }
    militaryWindow.focus()
    return
  }
  
  militaryWindow = new BrowserWindow({
    width: 800,
    height: 450,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  militaryWindow.loadFile('./src/views/mainMilitaryWindow.html');

  militaryWindow.on('closed', () => {
    militaryWindow = null;
  });
}

//Add military window
let addMilitary
const addMilitaryWindow = () => {
  //Does not allow more than one instance to be opened
  if (addMilitary !== undefined && addMilitary !== null) {
    if (addMilitary.isMinimized()) { addMilitary.restore() }
    addMilitary.focus()
    return 
  }
  
  addMilitary = new BrowserWindow({
    width: 800,
    height: 670,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  addMilitary.loadFile('./src/views/addMilitary.html')

  addMilitary.on('closed', () => {
    addMilitary = null;
  });
}

//Search Military Window
const searchMilitaryWindow = () => {
  let searchMilitary = new BrowserWindow({
    width: 850,
    height: 750,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  searchMilitary.loadFile('./src/views/searchMilitary.html');
}

//Main Classroom Window
let classroomWindow
const mainClassroomWindow = () => {
  //Does not allow more than one instance to be opened
  if (classroomWindow !== undefined && classroomWindow !== null) {
    if (classroomWindow.isMinimized()) { 
      classroomWindow.restore() 
    }
    classroomWindow.focus()
    return
  }
  
  classroomWindow = new BrowserWindow({
    width: 800,
    height: 450,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  classroomWindow.loadFile('./src/views/mainClassroomWindow.html');

  classroomWindow.on('closed', () => {
    classroomWindow = null;
  });
}

//Add classroom window
let addClassroom
const addClassroomWindow = () => {
  //Does not allow more than one instance to be opened
  if (addClassroom !== undefined && addClassroom !== null) {
    if (addClassroom.isMinimized()) { addClassroom.restore() }
    addClassroom.focus()
    return 
  }
  
  addClassroom = new BrowserWindow({
    width: 800,
    height: 450,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  addClassroom.loadFile('./src/views/addClassroom.html')

  addClassroom.on('closed', () => {
    addClassroom = null;
  });
}

//Search Classroom Window
const searchClassroomWindow = () => {
  let searchClassroom = new BrowserWindow({
    width: 850,
    height: 750,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  searchClassroom.loadFile('./src/views/searchClassroom.html');
}


let militaryRecordWindows = []
const militaryRecordWindow = (militaryId) => {
  const existingWindow = militaryRecordWindows.find(
    (win) => win.militaryId === militaryId
  )

  if (existingWindow) {
    if (existingWindow.isMinimized()) { 
      existingWindow.restore() 
    }
    existingWindow.focus()
    return existingWindow
  } 

  let newMilitaryRecordWindow = new BrowserWindow({
    width: 800,
    height: 700,
    resizable: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  newMilitaryRecordWindow.loadFile('./src/views/militaryRecord.html')

  newMilitaryRecordWindow.militaryId = militaryId

  newMilitaryRecordWindow.on('close', () => {
    militaryRecordWindows = militaryRecordWindows.filter(
      (win) => win !== newMilitaryRecordWindow
    )
    newMilitaryRecordWindow = null
  })


  militaryRecordWindows.push(newMilitaryRecordWindow)

  return newMilitaryRecordWindow
}

let classroomRecordWindows = []
const classroomRecordWindow = (classroomId) => {
  const existingWindow = classroomRecordWindows.find(
    (win) => win.classroomId === classroomId
  )

  if (existingWindow) {
    if (existingWindow.isMinimized()) { 
      existingWindow.restore() 
    }
    existingWindow.focus()
    return existingWindow
  } 

  let newClassroomRecordWindow = new BrowserWindow({
    width: 800,
    height: 750,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  newClassroomRecordWindow.loadFile('./src/views/classroomRecord.html')
  newClassroomRecordWindow.classroomId = classroomId

  newClassroomRecordWindow.on('close', () => {
    classroomRecordWindows = classroomRecordWindows.filter(
      (win) => win !== newClassroomRecordWindow
    )
    newClassroomRecordWindow = null
  })

  classroomRecordWindows.push(newClassroomRecordWindow)

  return newClassroomRecordWindow
}

//Main Activity Window
let activityWindow
const mainActivityWindow = () => {
  //Does not allow more than one instance to be opened
  if (activityWindow !== undefined && activityWindow !== null) {
    if (activityWindow.isMinimized()) { 
      activityWindow.restore() 
    }
    activityWindow.focus()
    return
  }
  
  activityWindow = new BrowserWindow({
    width: 800,
    height: 450,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  activityWindow.loadFile('./src/views/mainActivityWindow.html');

  activityWindow.on('closed', () => {
    activityWindow = null;
  });
}



app.whenReady().then(() => {
  initializeDatabase();
  createWindow();

  ipcMain.on('open-military-window', () => {
    mainMilitaryWindow();
  });

  ipcMain.on('open-classroom-window', () => {
    mainClassroomWindow();
  });

  ipcMain.on('open-activity-window', () => {
    mainActivityWindow();
  });

  ipcMain.on('open-add-military-window', () => {
    addMilitaryWindow();
  });

  ipcMain.on('open-search-military-window', () => {
    searchMilitaryWindow();
  });

  ipcMain.on('open-add-classroom-window', () => {
    addClassroomWindow();
  })

  ipcMain.on('open-search-classroom-window', () => {
    searchClassroomWindow();
  })
  
  ipcMain.handle('add-military-data',  (event, formData) => {
    const data = JSON.parse(formData);

    console.log(`Dados recebidos: ${JSON.stringify(data)}`)
    try {
      
      const militaryId = addMilitaryData(data);
      const dataClassroomMilitary = {
        "classroomId": data.classroomNumber,
        "militaryId": militaryId,
        "role": data.role
      };
      
      addClassroomMilitaryData(dataClassroomMilitary);
      updateNumberOfMilitary(data.classroomNumber)
      
      return { success: true };
    
    } catch (error) {
      console.error('Error adding military data:', error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('get-military-data', () => {
    try {
      const data = getMilitaryData();
      return { success: true, data };
    } catch (error) {
      console.error('Error getting military data:', error);
      return { success: false, error: error.message };
    }
  })

  ipcMain.handle('get-classroom-data', () => {
    try {
      const data = getClassroomData();
      return data
    }catch(error) {
      console.error('Erro ao buscar dados das turmas:', error)
      return {error: 'Erro ao buscar dados das turmas'}
    }
  })

  ipcMain.handle('add-classroom-data', async (event, formData) => {
    const data = formData

    try {
      const existClassroom = await getClassroomByNumber(data.classroomNumber)
      if (!existClassroom){
        await addClassroomData(data)
        return {
          available: true,
          message: 'Turma cadastrada com sucesso'
        }

      } else {
        const busyNumbers = await getClassroomData();
        const busyClassroomNumbers = busyNumbers.map((classroom) => {
          return classroom["classroomNumber"]
        }).join(', ')

        return {
          available: false,
          message: 'O número de turma escolhido já está em uso',
          busyNumbers: busyClassroomNumbers
        }
      }
    } catch (error) {
      console.error('Erro ao cadastrar a turma: ', error)
    }

  })

  ipcMain.handle('get-classroom-option', () => {
    const options = getClassroomData()
    return options
  })

  ipcMain.handle('get-combined-data', () => {
    try {
      const data = getCombinedData();
      return data
    }catch(error) {
      console.error('Erro ao buscar dados combinados:', error)
      return {error: 'Erro ao buscar dados combinados'}
    }
  })

  ipcMain.handle('simple-search-military', async (event, { field, value }) => {
    try {
      const result = simpleSearchMilitary(field, value)
      return result
    } catch (error) {
      console.error('Erro ao buscar dados na pesquisa simples: ', error)
      return { error: 'Erro ao buscar dados na pesquisa simples.' }
    }
  })

  ipcMain.handle('advanced-search-military', async (event, searchParams) => {
    try {
      const result = await advancedSearchMilitary(searchParams)
      return result
    } catch (error) {
      console.error('Erro ao buscar dados na pesquisa avancada: ', error)
      return { error: 'Erro ao buscar dados na pesquisa avancada.' }
    }
  });

  ipcMain.on('view-military-record', async (event, militaryId) => {
    try {
      const militaryData = await getCombinedDataEdit(militaryId)
      const window = militaryRecordWindow(militaryId)

      window.webContents.on('did-finish-load', () => {
        window.webContents.send('load-military-data', { 
          id: militaryId,
          data: militaryData
        })
      })

    } catch (error) {
      console.error('Erro ao consultar os dados do militar para visualizacao: ', 
        error
      )
    }
  })

  ipcMain.on('view-classroom-record', async (event, classroomId) => {
    try {
      const classroomData = await getClassroomById(classroomId)
      const window = classroomRecordWindow(classroomId)

      window.webContents.on('did-finish-load', () => {
        window.webContents.send('load-classroom-data', { 
          id: classroomId,
          data: classroomData
        })
      })

    } catch (error) {
      console.error('Erro ao consultar os dados da turma para visualizacao: ', 
        error
      )
    }
  })

  ipcMain.handle('update-military-data', async (event, id, updateData) => {

    const { classroomNumber, role, ...militaryData} = updateData

    try {
      //id da turma atual, antes da edição
      const classroomMilitary = getClassroomByMilitaryId(id)
      //consulta o número da turma pelo id passado
      const classroom = getClassroomById(classroomMilitary.classroomId)

      /**
       * verifica se o número da turma que o militar está cadastrado 
       * é o mesmo do número de turma passado na hora da edição
       * caso sejam iguais faz o upload caso nao sejam iguais
       * o sistema deve atualizar a tabela classroomMilitary
       * com o id da nova turma
       */
      if (classroom.classroomNumber == updateData.classroomNumber) {  
        try {
          await updateMilitaryData(id, militaryData)
          await updateClassroomMilitaryData(
            id, 
            {classroomId: updateData.classroomNumber, role: updateData.role}
          )
        } catch (error) {
          console.error('Erro ao atualizar o militar: ',)
        }
        
      } else {
        const newClassroom = 
          await getClassroomByNumber(updateData.classroomNumber)
        
        try {
          await updateClassroomMilitaryData(
            id, 
            {classroomId: newClassroom.id, role: updateData.role}
          )
        } catch (error) {
          console.error('Erro ao editar o militar: ', error)
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar os dados: ', error)
    }

  })

  ipcMain.handle('update-classroom-data', async (event, id, updateData) => {

    console.log('Id da turma que sera editada: ', id)
    console.log('Os dados que serao editados: ', updateData)
    try {
      await updateClassroomData(id, updateData)
    } catch (error) {
      console.error('Erro ao atualizar os dados: ', error)
    }

  })

  ipcMain.handle('delete-military-record', async (event, id) => {
    try {
      await deleteMilitaryById(id)
    } catch (error) {
      console.error('Erro ao deletar o militar: ', error)
    }
  })

  ipcMain.handle('open-file-csv', async () => {
    const {canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        { name: 'CSV Files', extensions: ['csv'] },
        { name: 'All Files', extensions: ['*'] }
      ],
    });

    if (canceled) {
      return null;
    } else {
      return filePaths[0];
    }
  });

  ipcMain.handle('read-file-csv', async (event, filePath) => {
    const results = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => {
          console.log(data)
          console.log(validateCsvRecord(data))
          //console.log(validateCsvRecord(data))
          results.push(data)
        })
        .on('end', () => {
          resolve(results);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  });


  app.on('activate', () => {
    if(BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if(process.platform !== 'darwin') app.quit()
})

