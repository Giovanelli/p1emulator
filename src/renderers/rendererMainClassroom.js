function init() {
    document.querySelector('#btn-add-classroom').addEventListener(
      'click', 
      () => { api.openAddClassroom(); }
    );
  
    document.querySelector('#btn-search-classroom').addEventListener(
      'click', 
      () => { api.openSearchClassroom(); }
    );
  
  };
  
  init();