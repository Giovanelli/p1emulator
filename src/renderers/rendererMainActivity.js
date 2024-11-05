function init() {
    document.querySelector('#btn-add-activity').addEventListener(
    	'click', 
      () => { api.openAddActivity(); }
    );
  
    document.querySelector('#btn-search-activity').addEventListener(
      'click', 
      () => { api.openSearchActivity(); }
    );

    document.querySelector('#btn-generate-scale').addEventListener(
        'click', 
        () => { api.openGenerateScale(); }
    );

    document.querySelector('#btn-search-scale').addEventListener(
        'click', 
        () => { api.openSearchScale(); }
    );
  
  };
  
  init();