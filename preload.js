const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {

  openMilitaryWindow: () => ipcRenderer.send('open-military-window'),
  openClassroomWindow: () => ipcRenderer.send('open-classroom-window'),
  openActivityWindow: () => ipcRenderer.send('open-activity-window'),
  
  openAddMilitary: () => ipcRenderer.send('open-add-military-window'),
  openSearchMilitary: () => ipcRenderer.send('open-search-military-window'),
  openFileCsv: () => ipcRenderer.invoke('open-file-csv'),
  readCsvFile: (filePath) => ipcRenderer.invoke('read-file-csv', filePath),
  
  openAddClassroom: () => ipcRenderer.send('open-add-classroom-window'),
  openSearchClassroom: () => ipcRenderer.send('open-search-classroom-window'),

  openAddActivity: () => ipcRenderer.send('open-add-activity'),
  openSearchActivity: () => ipcRenderer.send('open-search-activity'),
  openGenerateScale: () => ipcRenderer.send('open-generate-scale'),
  openSearchScale: () => ipcRenderer.send('open-search-scale'),
  
  sendMilitaryData: (formData) => ipcRenderer.invoke(
    'add-military-data', 
    formData
  ),

  addActivityData: async (formData) => {
    return await ipcRenderer.invoke('add-activity-data', formData)
  },
  

  addClassroomData: async (formData) => {
    return await ipcRenderer.invoke('add-classroom-data', formData)
  },

  showDialogActivity: (options) => {
    const result = ipcRenderer.invoke('show-dialog-activity', options);
    return result;
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
  
  searchClassroom: (field, value) => {
    return ipcRenderer.invoke('search-classroom-data', {field, value});
  },
  
  // Form Search Military 
  simpleSearchMilitary: (field, value) => {
    return ipcRenderer.invoke('simple-search-military', {field, value})
  },

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
});