export default `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="description" content="" />
  <title>TestMail</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
  <link href="index.css" rel="stylesheet" />
</head>
<body>
  <main>
    <div class="d-flex flex-column align-items-stretch flex-shrink-0 bg-white" style="width: 450px">
      <div class="d-flex align-items-center flex-shrink-0 p-3 link-dark text-decoration-none border-bottom">
        <span class="fs-5 fw-semibold">TestMail</span>
        
      </div>
      <div class="d-flex flex-column align-items-stretch flex-shrink-0 p-3 link-dark text-decoration-none border-bottom">
        <input id="apikey" class="form-control"  placeholder="apikey: xxxxx-xxxxx-xxxx-xxxx-xxxxxxxxxx">
        <input id="namespace"  class="form-control"  placeholder="namespace: xxxx">
        <button id="refresh-button" class="w-100 btn btn-lg btn-dark" type="submit">Load</button>
      </div>
      <div class="list-group list-group-flush border-bottom scrollarea">
        <!-- container -->
      </div>
    </div>
    <div class="divider"></div>
    <div id="mail-container" style="width: 100%">
      <!-- mail container -->
    </div>
  </main>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script> 
  <script src="index.js"></script>
</body>
</html>
`
