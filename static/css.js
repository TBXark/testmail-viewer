export default `
body {
    min-height: 100vh;
    min-height: -webkit-fill-available;
  }
  
  html {
    height: -webkit-fill-available;
  }
  
  main {
    display: flex;
    flex-wrap: nowrap;
    height: 100vh;
    height: -webkit-fill-available;
    max-height: 100vh;
    overflow-x: auto;
    overflow-y: hidden;
  }
  
  .divider {
    flex-shrink: 0;
    width: 2px;
    height: 100vh;
    background-color: rgba(0, 0, 0, .1);
    border: solid rgba(0, 0, 0, .15);
    border-width: 1px 0;
  }
  
  .dropdown-toggle { outline: 0; }
  
  .nav-flush .nav-link {
    border-radius: 0;
  }
  
  .scrollarea {
    overflow-y: auto;
  }
  
  .fw-semibold { font-weight: 600; }
  .lh-tight { line-height: 1.25; }
  
  #mail-container {
    padding: 20px
  }
`