flearn=function(){}

var c = document.getElementById("canvasbase");
var ctx = c.getContext("2d");
var div1 = document.getElementById("div1");
var div2 = document.getElementById("div2");
var div3 = document.getElementById("div3");
var globali = 2;
main();

function main()
{
    var inputFileToLoad = document.createElement("input");
    inputFileToLoad.type = "file";
    inputFileToLoad.id = "inputFileToLoad";
    inputFileToLoad.addEventListener('click', enableLoadButton);
    div1.appendChild(inputFileToLoad);

    var buttonLoadFile = document.createElement("button");
    buttonLoadFile.onclick = loadImageFileAsURL;
    buttonLoadFile.textContent = "Load Selected File";
    buttonLoadFile.id = "buttonLoadFile";
    div1.appendChild(buttonLoadFile);
}

function enableLoadButton()
{
  document.getElementById("buttonLoadFile").disabled = false;
}

function isNumeric(evt)
{
  var charCode = (evt.which) ? evt.which : evt.keyCode;
  if (charCode != 8 && charCode != 46 && charCode > 3  && (charCode < 48 || charCode > 57))
  {
    alert('Enter only numbers');
    return false;
  }
  return true;
}
  
function loadImageFileAsURL()
{
    var filesSelected = document.getElementById("inputFileToLoad").files;
    if (filesSelected.length > 0)
    {
        var fileToLoad = filesSelected[0];

        if (fileToLoad.type.match("image.*"))
        {
            var fileReader = new FileReader();
            fileReader.onload = function(fileLoadedEvent) 
            {
                  var img = new Image();   	
                  img.onload = function() {
                  // scaling the image to the canvas width and height                  
                  ctx.drawImage(img, 0, 0, img.width,img.height,      // source rectangle
                                0, 0, c.width, c.height);  // destination rectangle
  				  img.style.display = 'none';
  				  // harvesting all the pixels of the image
                  getPixels();
                  addDistTextBox();
				}
                img.src = fileLoadedEvent.target.result;
            }
            fileReader.readAsDataURL(fileToLoad);
        }   
        c.addEventListener('click', pick);
    }
    document.getElementById("buttonLoadFile").disabled = true;
}

function getPixels(){
    flearn.global_canvas_info =[];
    flearn.global_checkbox_info = [];
    flearn.imgstack=[]
      for(i = 0; i < c.width; i++){
          flearn.imgstack[i] = [];
          for(j = 0; j < c.height; j++){
              flearn.imgstack[i][j]=ctx.getImageData(i, j, 1, 1).data.slice(0,3)
          }
      }
}

  
function addDistTextBox(){
    var divTemp = document.createElement("divTemp");
    divTemp.style.marginLeft = "85px";
    divTemp.appendChild(document.createTextNode('Distance'));
    div1.appendChild(divTemp);

    var dist = document.createElement("input");
    dist.setAttribute("type", "text");
    dist.setAttribute("value","0.05");
    dist.setAttribute("id", "distVal")
    dist.style.width = "70px";
    dist.style.marginLeft = "10px";
    dist.onkeydown = function(){return isNumeric(event)};
    div1.appendChild(dist);
}

//event on checkbox check and unchcek
function checkboxEvent(){
    if(this.checked){
      flearn.global_checkbox_info[this.id] = true;
      var canvasid = flearn.global_canvas_info[this.id];
      var canvas = document.getElementById(canvasid);
      canvas.hidden = false;
    }else{
      flearn.global_checkbox_info[this.id] = false;
      var canvasid = flearn.global_canvas_info[this.id];
      var canvas = document.getElementById(canvasid);
      canvas.hidden = true;
    }
}


function pick(event) {
  var x = event.layerX;
  var y = event.layerY;
  var pixel = ctx.getImageData(x, y, 1, 1);
  var data = pixel.data;
  var rgb_of_clicked_pt = pixel.data.slice(0,3);
  var copy_gloabal_i = globali++;

  //creating the canvases and adding them over
  var upcanvas = document.createElement("canvas");
  var id = "canvas" + copy_gloabal_i;
  upcanvas.id = id;
  upcanvas.width = 500;
  upcanvas.height = 400;
  upcanvas.style.position = "absolute";
  upcanvas.style.top = 0;
  upcanvas.style.left = 0;
  upcanvas.style.zIndex = copy_gloabal_i;
  upcanvas.addEventListener('click', pick);
  div2.append(upcanvas);
  var ctxupcanvas = upcanvas.getContext("2d");
  var name = x + ', ' + y + ', ' + data[0] + ', '+data[1] + ', '+data[2];
  flearn.global_canvas_info[name] = id
  flearn.global_checkbox_info[name] = true;

  //creating the checkboxes in div3
  var radioInput = document.createElement('input');
  var value = rgb_of_clicked_pt;
  var radioLabel = document.createTextNode(name);
  radioInput.id = name;
  radioInput.setAttribute('type', 'checkbox');
  radioInput.style.marginRight = "20px";
  radioInput.checked = true;
  radioInput.setAttribute('value',value);
  radioInput.addEventListener('change',checkboxEvent);
  div3.appendChild(radioLabel);
  div3.appendChild(radioInput);
  
  eucledianDistance(x, y, rgb_of_clicked_pt, upcanvas, ctxupcanvas);

  var rgba = 'rgba(' + data[0] + ', ' + data[1] +
             ', ' + data[2] + ', ' + (data[3] / 255) + ')';
  var color = document.getElementById("color");
  color.style.background =  rgba;
  color.textContent = rgba;
}


function eucledianDistance(x, y, rgb_of_clicked_pt, upcanvas, ctxupcanvas){
        var reqd_rga = [];

        for( i = 0; i < flearn.imgstack.length; i++){
            for( j = 0 ; j < flearn.imgstack[0].length; j++){
                reqd_rga = flearn.imgstack[i][j];
                var dist = Math.sqrt( Math.pow((rgb_of_clicked_pt[0] - reqd_rga[0]), 2) + 
                                      Math.pow((rgb_of_clicked_pt[1] - reqd_rga[1]), 2) +  
                                      Math.pow((rgb_of_clicked_pt[2] - reqd_rga[2]), 2));

                var constDist = document.getElementById("distVal").value;
                //var constDistInt = parseInt(constDist);
                if ( dist < 10){
                  //highlight the coordinates
                   ctxupcanvas.globalAlpha = 0.5;
                   ctxupcanvas.fillStyle = "yellow";
                   ctxupcanvas.fillRect(i-2, j+2, 5, 5);
                }                          
            }
        }
}
