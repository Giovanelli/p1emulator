const { contextBridge, ipcRenderer } = require('electron');


contextBridge.exposeInMainWorld('api', {
  
  openAddMilitary: () => ipcRenderer.send('open-add-military-window'),
  openSearchMilitary: () => ipcRenderer.send('open-search-military-window'),
  openAddClassroom: () => ipcRenderer.send('open-add-classroom-window'),
  openSearchClassroom: () => ipcRenderer.send('open-search-classroom-window'),
  
  sendMilitaryData: (formData) => ipcRenderer.invoke(
    'add-military-data', 
    formData
  ),

  addClassroomData: async (formData) => {
    return await ipcRenderer.invoke('add-classroom-data', formData)
  },
  
  getMilitaryData: () => ipcRenderer.invoke('get-military-data'),
  getClassroomData: () => ipcRenderer.invoke('get-classroom-data'),
  getClassroomMilitaryData: () => ipcRenderer.invoke(
    'get-classroomMilitary-data'
  ),
  
  submitClassroomDialogData: (classroomDialogCount) => ipcRenderer.invoke(
    'submit-classroomDialog-data',
    classroomDialogCount
  ),

  getOptionsClassroom: () => ipcRenderer.invoke('get-classroom-option'),

  // Preenche a tela inicial de searchMilitaryWindow
  getCombinedData: () => ipcRenderer.invoke('get-combined-data'),
  // Form Search Military 
  simpleSearchMilitary: (field, value) => ipcRenderer.invoke(
    'simple-search-military',
    {field, value}
  ),

  advancedSearchMilitary: (searchParams) => {
    return ipcRenderer.invoke('advanced-search-military', searchParams)
  },

  //Envia o id do militar para consulta dos dados no main
  viewMilitaryRecord: (militaryId) => ipcRenderer.send(
    'view-military-record', 
    militaryId
  ),

  viewClassroomRecord: (classroomId) => ipcRenderer.send(
    'view-classroom-record',
    classroomId
  ),
  
  //Recebe do main o id e os dados de consulta feitas pelo main
  loadMilitaryData: (callback) => ipcRenderer.on(
    'load-military-data',
    (event, data) => { callback(data) }
  ),

  loadClassroomData: (callback) => ipcRenderer.on(
    'load-classroom-data',
    (event, data) => {callback(data)}
  ),

  updateMilitaryData: (id, updateData) => ipcRenderer.invoke(
    'update-military-data',
    id,
    updateData
  ),

  updateClassroomData: (id, updateData) => ipcRenderer.invoke(
    'update-classroom-data',
    id,
    updateData
  ),

  deleteMilitaryRecord: (id) => ipcRenderer.invoke(
    'delete-military-record',
    id
  ),

  // notifyUpdate: () => ipcRenderer.send('update-table-search'),

  // on: (channel, callback) => {
  //   // Ouvinte de eventos do IPC
  //   ipcRenderer.on(channel, (event, ...args) => callback(...args));
  // }

});