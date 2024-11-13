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
  hasMilitaryRecords,
  getMilitaryByFunctionalName
} = require('./dataBase/military');

const { 
  addClassroomData,
  hasClassroomRecords, 
  createClassroomRecords, 
  getClassroomData,
  getClassroomById,
  getClassroomByNumber,
  updateClassroomData,
  updateNumberOfMilitary,
  searchClassroom, 
} = require('./dataBase/classroom');

const { 
  createClassroomMilitayData,
  addClassroomMilitaryData,
  getClassroomByMilitaryId,
  updateClassroomMilitaryData,
  deleteClassroomMilitaryData,
  getClassroomMilitaryByClassroomId
} = require('./dataBase/classroomMilitary')

const { 
  initializeDatabase, 
  getCombinedData, 
  simpleSearchMilitary,
  advancedSearchMilitary,
  getCombinedDataEdit
} = require('./dataBase/database');

const {
  addActivityData,
  getActivityData,
  getActivityByName
} = require('./dataBase/activity')

const { validateCsvRecord } = require('./src/public/js/validateCsv');
const { validateObject } = require('./src/public/js/validateObject');


// Variável que armazena o arquivo CSV que é carregado
let arqCsv = [];


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
    height: 740,
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
    height: 690,
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
    height: 880,
    resizable: false,
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
    height: 690,
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

//Add activity window
let addActivity
const addActivityWindow = () => {
  //Does not allow more than one instance to be opened
  if (addActivity !== undefined && addActivity !== null) {
    if (addActivity.isMinimized()) { addActivity.restore() }
    addActivity.focus()
    return 
  }
  
  addActivity = new BrowserWindow({
    width: 800,
    height: 530,
    resizable: false,
    focusable: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  addActivity.loadFile('./src/views/addActivity.html')

  addActivity.on('closed', () => {
    addActivity = null;
  });
}

//Search Military Window
const searchActivityWindow = () => {
  let searchActivity = new BrowserWindow({
    width: 850,
    height: 750,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  searchActivity.loadFile('./src/views/searchActivity.html');
}

let csvWindow;
const csvListWindow = (csvData) => {
  if (csvWindow !== undefined && csvWindow !== null) {
    if (csvWindow.isMinimized()) { csvWindow.restore() }
    csvWindow.focus()
    return 
  }

  csvWindow = new BrowserWindow({
    width: 820,
    height: 610,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

  csvWindow.loadFile('./src/views/csvListData.html');

  csvWindow.webContents.once('did-finish-load', () => {
    csvWindow.webContents.send('display-csv-list', csvData);
  });

  csvWindow.on('closed', () => {
    csvWindow = null;
  });
};

let recordCsv;
const correctionWindowCsv = (data, csvData) => {
  if (recordCsv !== undefined && recordCsv !== null) {
    if (recordCsv.isMinimized()) { recordCsv.restore() }
    recordCsv.focus()
    return 
  }

  recordCsv = new BrowserWindow({
    width: 820,
    height: 880,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false
    }
  });

  recordCsv.loadFile('./src/views/csvRecord.html');
  
  recordCsv.webContents.once('did-finish-load', () => {
    recordCsv.webContents.send('load-csv-record', data, csvData);
  });

  recordCsv.on('closed', () => {
    recordCsv = null;
  });
}

ipcMain.handle('validate-object', async (event, object) => {
  return validateObject(object);  // Chama a função de validação
});

ipcMain.handle('validate-object-csv', async (event, object) => {
  return validateCsvRecord(object);  // Chama a função de validação
});

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
  });

  ipcMain.on('open-search-classroom-window', () => {
    searchClassroomWindow();
  });
  
  ipcMain.on('open-add-activity', () => {
    addActivityWindow();
  });

  ipcMain.on('open-search-activity', () => {
    searchActivityWindow();
  });

  ipcMain.on('window-csv-record', (event, data, csvData) => {
    correctionWindowCsv(data, csvData);
  });
  
  ipcMain.handle('add-military-data', async (event, formData) => {
    const { classroomNumber, role, ...militaryData } = formData;

    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }

    try {
      
      const militaryId = await addMilitaryData(militaryData);
      const { id: classroomId } = await getClassroomByNumber(classroomNumber);
      const dataClassroomMilitary = { classroomId, militaryId, role };
      
      await addClassroomMilitaryData(dataClassroomMilitary);
      await updateNumberOfMilitary(classroomNumber, true)
      
      return { available: true };
    
    } catch (error) {

      console.error('Error adding military data:', error);
      let errorMessage = '';
      let errorType = '';
      
      const { militaryNumber, functionalName } = militaryData;
      const uniqueNumber = await getMilitaryByNumber(militaryNumber);
      const uniqueFuncName = await getMilitaryByFunctionalName(functionalName);
       
      if (uniqueNumber) {
        errorType = '[Erro] - Matrícula já cadastrada!'
        errorMessage = 'O militar cadastrado com essa matrícula: ' + 
          `${uniqueNumber.rank === 'soldado' ? 'SD' : 'CB'} ` + 
          `${capitalizeFirstLetter(uniqueNumber.functionalName)}`
      } 
      if (uniqueFuncName) {
        errorType = '[Erro] - Nome Funcional já cadastrado!'
        errorMessage = 'O militar cadastrado com esse Nome Funcional: ' + 
          `${uniqueFuncName.rank === 'soldado' ? 'SD' : 'CB'} ` + 
          `${capitalizeFirstLetter(uniqueFuncName.functionalName)}`
      }

      return { 
        available: false,
        error: errorType, 
        message: errorMessage 
      };

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

  });

  ipcMain.handle('search-classroom-data', async (event, { field, value }) => {
    //Converte o valor de value para integer quando for um número.
    if(!isNaN(value)) value = parseInt(value);
    try {
      const result = await searchClassroom(field, value);
      return result;
    } catch (error) {
      console.error('Erro ao buscar dados na pesquisa simples: ', error)
      return { error: 'Erro ao buscar dados na pesquisa simples.' }
    }
  });

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

    console.log(field, value);
    try {
      const result = simpleSearchMilitary(field, value)
      console.log(result)
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
    
      const classroomData = await getClassroomById(classroomId);
      const window = classroomRecordWindow(classroomId);

      window.webContents.on('did-finish-load', () => {
        window.webContents.send('load-classroom-data', { 
          id: classroomId,
          data: classroomData
        });
      });

    } catch (error) {
      console.error('Erro ao consultar os dados da turma para visualizacao: ', 
        error
      );
    }
  });

  ipcMain.handle('update-military-data', async (event, militaryId, updateData) => {

    const { classroomNumber, role, ...militaryData} = updateData;

    try {
      
      const classroomMilitary = getClassroomByMilitaryId(militaryId);
      //consulta o número da turma pelo id passado
      const classroom = getClassroomById(classroomMilitary.classroomId);

      /**
       * Verifica se o número da turma que o militar está cadastrando é o mesmo
       * do número de turma passado na hora da edição caso sejam iguais faz o
       * update, caso nao sejam iguais, o sistema deve atualizar a tabela
       * classroomMilitary com o id da nova turma.
       */
      if (classroom.classroomNumber == updateData.classroomNumber) {  
        try {
          await updateMilitaryData(militaryId, militaryData);
          await updateClassroomMilitaryData(
            id, 
            {classroomId: updateData.classroomNumber, role: updateData.role}
          );
        } catch (error) {
          console.error('Erro ao atualizar o militar: ', error);
        }
      } else {
        const newClassroom = 
          await getClassroomByNumber(updateData.classroomNumber);
        
        try {
          await updateClassroomMilitaryData(
            militaryId, 
            {classroomId: newClassroom.id, role: updateData.role}
          );

          const classNum = await getClassroomById(classroomMilitary.classroomId)

          //decrementa a classe antiga do militar
          await updateNumberOfMilitary(classNum.classroomNumber, false);
          //incrementa a classe nova do militar
          await updateNumberOfMilitary(updateData.classroomNumber, true);
        } catch (error) {
          console.error('Erro ao editar o militar: ', error);
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar os dados: ', error);
    }

  });

  ipcMain.handle('update-classroom-data', async (event, id, updateData) => {
    try {
      await updateClassroomData(id, updateData);
      return { available: true }
    } catch (error) {
      console.error('Erro ao atualizar os dados: ', error);
      return { available: false }
    }
  })

  ipcMain.handle('delete-military-record', async (event, militaryInfo) => {
    try {
      const { id, data: { classroomNumber } } = militaryInfo;

      // Ajusta o número de militares na turma (decrementando)
      await updateNumberOfMilitary(classroomNumber, false);
      
      // Exclui o registro militar
      await deleteMilitaryById(id);
      
      // Exclui o registro intermediário classroomMilitary
      await deleteClassroomMilitaryData(null, id);
      
      return { available: true };
    } catch (error) {
      console.error('Error deleting military record:', error);
      return { available: false };
    }
  })

  // ATENÇÃO: o sistema deve somente ler aquivos csv. CORRIGIR ISSO!!!
  let isFileDialogOpen = false; // variável de controle
  ipcMain.handle('open-file-csv', async () => {
    
    if (isFileDialogOpen) return null; // Verifique se o diálogo já está aberto

    isFileDialogOpen = true; // Marque como aberto
    
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        { name: 'CSV Files', extensions: ['csv'] },
        { name: 'All Files', extensions: ['*'] }
      ],
    });

    isFileDialogOpen = false; // Marque como fechado

    if (canceled) {
      return null;
    } else {
      return filePaths[0];
    }
  });

  ipcMain.handle('read-file-csv', async (event, filePath) => {
    const result = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv({
          // Remove espaços dos nomes das colunas
          mapHeaders: ({ header }) => header.trim()
        }))
        .on('data', (data) => {
          const validRegistration = validateObject(data)
          const recordErrors = validateCsvRecord(validRegistration);

          if (Object.keys(recordErrors).length > 0) {
            validRegistration.errors = recordErrors;
          }
          
          result.push(validRegistration);
        })
        .on('end', () => {
          resolve(result)
          arqCsv = result;
          csvListWindow(result);
        })
        .on('error', (error) => {
          reject(error);
        });
    });

  });

  ipcMain.handle('add-activity-data', async (event, formData) => {
    const data = validateObject(formData);

    try {
      const existActivity = await getActivityByName(data.activityName);
      if (!existActivity){
        await addActivityData(data)
        return {
          available: true,
          message: 'Atividade cadastrada com sucesso'
        }
      } else {
        return {
          available: false,
          message: 'Esta atividade já está cadastrada!'
        }
      }
    } catch (error) {
      console.error('Erro ao cadastrar a atividade: ', error)
    }

  });

  let csvRecordReceive;
  ipcMain.on('update-csv-data', (event, updatedData) => {
    let {errors, ...csvReceive} = updatedData;
    
    csvRecordReceive = validateObject(csvReceive);
    csvRecordReceive.errors = errors;

    const index = arqCsv.findIndex(item => 
      item.militaryNumber === csvRecordReceive.militaryNumber
    );

    if (index !== -1) {
      arqCsv[index] = csvRecordReceive;
    } else {
      arqCsv.push(csvRecordReceive);
    }

  });

  ipcMain.handle('get-stored-csv-data', () => {
    if(Object.keys(csvRecordReceive).length > 0) {  
      return arqCsv;
    }
    //return arqCsv
  });

  // DIALOGS
  ipcMain.handle('show-dialog-activity', async (event, options) => {

    // Identifica a janela que enviou o evento
    const parentWindow = BrowserWindow.fromWebContents(event.sender); 

    const dialogOptions = {
      ...options,       // Inclui opções do diálogo
      modal: true,      // Garante que o diálogo é modal
      center: true
    };

    try {
      const result = await dialog.showMessageBox(parentWindow, dialogOptions);
      return result.response; // Retorna o índice do botão escolhido
    } catch (error) {
      console.error('Erro ao mostrar o diálogo modal:', error);
    }
    
  });



  app.on('activate', () => {
    if(BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if(process.platform !== 'darwin') app.quit()
})

