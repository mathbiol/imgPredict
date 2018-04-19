flearn=function(){}

var c = document.getElementById("canvasbase");
var ctx = c.getContext("2d");
var c1 = document.getElementById("canvastop");
var ctx1 = c1.getContext("2d");	
var div1 = document.getElementById("div1");
var div3 = document.getElementById("div3");
var addPixels = false;
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
    //inputFileToLoad.style.float = 'right';
    //buttonLoadFile.style.position = 'relative';
    //buttonLoadFile.style.float = 'right';
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
                  getAddButton();
                  getHarvestButton();
				}
                img.src = fileLoadedEvent.target.result;
            }
            fileReader.readAsDataURL(fileToLoad);
        }   
        c1.addEventListener('click', pick);
    }
    document.getElementById("buttonLoadFile").disabled = true;
}

function getPixels(){
    flearn.imgstack=[]
      for(j = 0; j < c.height; j++){
          flearn.imgstack[j] = [];
          for(i = 0; i < c.width; i++){
              flearn.imgstack[j][i]=ctx.getImageData(i, j, 1, 1).data.slice(0,3)
          }
      }
}

function getAddButton(){
    var addbutton = document.createElement("button");
    addbutton.onclick = setAddPixels;
    addbutton.textContent = "Add";
    addbutton.style.marginLeft = "85px";
    div1.appendChild(addbutton);
}

function getHarvestButton(){
    var addbutton = document.createElement("button");
    addbutton.onclick = getCheckedRadioButton;
    addbutton.textContent = "Harvest All";
    addbutton.style.marginLeft = "85px";
    div1.appendChild(addbutton);
}

function getCheckedRadioButton(){
  var checkedRBs = [];
  var radioBs = document.getElementById("div3").children;
  if (radioBs.length > 0){
    for( var i = 0 ; i < radioBs.length ; i++){
        if(radioBs[i].checked){
          checkedRBs.push(radioBs[i].value);
        }
    }
  }else{
    alert('First click the image to get the radio buttons');
    return ;
  }

  if(checkedRBs.length <= 0){
    alert('Please check the Radio buttons');
    return ;
  }
        
  var constDist = document.getElementById("distVal").value;
  var reqd_rga = [];
        ctx1.clearRect(0, 0, c1.width, c1.height);
        for( i = 0; i < flearn.imgstack.length; i++){
            for( j = 0 ; j < flearn.imgstack[0].length; j++){
                reqd_rga = flearn.imgstack[i][j];
                for( k = 0; k < checkedRBs.length; k++){
                  var dist = Math.sqrt( Math.pow((checkedRBs[k][0] - reqd_rga[0]), 2) + 
                                      Math.pow((checkedRBs[k][1] - reqd_rga[1]), 2) +  
                                      Math.pow((checkedRBs[k][2] - reqd_rga[2]), 2));

                
                if ( dist < 144){
                  //highlight the coordinates
                   ctx1.globalAlpha = 0.9;
                   ctx1.fillStyle = "red";
                   ctx1.fillRect(i,j,5,5);
                }    
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

function setAddPixels(){
    addPixels = true;
}

function pick(event) {
  var x = event.layerX;
  var y = event.layerY;
  var pixel = ctx.getImageData(x, y, 1, 1);
  
  //debugger
  var data = pixel.data;
  var rgb_of_clicked_pt = pixel.data.slice(0,3);
  eucledianDistance(rgb_of_clicked_pt);
  var rgba = 'rgba(' + data[0] + ', ' + data[1] +
             ', ' + data[2] + ', ' + (data[3] / 255) + ')';
  var color = document.getElementById("color");
  //div1.appendChild(color);
  //color.style.width = 150;
  //color.style.height = 30;
  color.style.background =  rgba;
  //color.style.float = 'right';
  color.textContent = rgba;
}

function eucledianDistance(rgb_of_clicked_pt){
        var reqd_rga = [];
        if (addPixels == false){
          ctx1.clearRect(0, 0, c1.width, c1.height);
          div3.innerHTML = "";
        }  
        for( i = 0; i < flearn.imgstack.length; i++){
            for( j = 0 ; j < flearn.imgstack[0].length; j++){
                reqd_rga = flearn.imgstack[i][j];
                var dist = Math.sqrt( Math.pow((rgb_of_clicked_pt[0] - reqd_rga[0]), 2) + 
                                      Math.pow((rgb_of_clicked_pt[1] - reqd_rga[1]), 2) +  
                                      Math.pow((rgb_of_clicked_pt[2] - reqd_rga[2]), 2));

                var constDist = document.getElementById("distVal").value;
                if ( dist < constDist){
                  //highlight the coordinates
                   ctx1.globalAlpha = 0.5;
                   ctx1.fillStyle = "blue";
                   ctx1.fillRect(i,j,5,5);

                   // creating the radio buttons in div3
                   var radioInput = document.createElement('input');
                   radioInput.setAttribute('type', 'radio');
                   radioInput.style.marginRight = "20px";
                   var value = reqd_rga;
                   radioInput.setAttribute('value',value);
                   //radioInput.innerText = "<br />";
                   var name = i + ', ' + j + ', ' + reqd_rga[0] + ', '+reqd_rga[1] + ', '+reqd_rga[2];
                   var radioLabel = document.createTextNode(name);
                   div3.appendChild(radioLabel);
                   div3.appendChild(radioInput);
                   //div3.innerHTML = "\n";
                   //radioLabel.style.marginRight = "10px";
                   
                   //dist.style.marginLeft = "10px";
                }                          
            }

        }
        addPixels = false;
}
