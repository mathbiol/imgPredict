flearn=function(){}

var c = document.getElementById("canvas");
var ctx = c.getContext("2d");	
main();

function main()
{
    var inputFileToLoad = document.createElement("input");
    inputFileToLoad.type = "file";
    inputFileToLoad.id = "inputFileToLoad";
    document.body.appendChild(inputFileToLoad);

    var buttonLoadFile = document.createElement("button");
    buttonLoadFile.onclick = loadImageFileAsURL;
    buttonLoadFile.textContent = "Load Selected File";
    buttonLoadFile.style.position = 'absolute';
    document.body.appendChild(buttonLoadFile);
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
				}
                img.src = fileLoadedEvent.target.result;
            }
            fileReader.readAsDataURL(fileToLoad);
        }   
        c.addEventListener('click', pick);
    }
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

function pick(event) {
  //if(!flearn.imgstack){
      // the pixels were not harvested yet, let's do it
     // getStack(event)
      //debugger
  //}
 // debugger
  var x = event.layerX;
  var y = event.layerY;
  var pixel = ctx.getImageData(x, y, 1, 1);
  
  //debugger
  var data = pixel.data;
  var rgb_of_clicked_pt = pixel.data.slice(0,3);
  eucledianDistance(rgb_of_clicked_pt);
  var rgba = 'rgba(' + data[0] + ', ' + data[1] +
             ', ' + data[2] + ', ' + (data[3] / 255) + ')';
  var color = document.getElementById('color');
  color.style.background =  rgba;
  color.textContent = rgba;
}

function eucledianDistance(rgb_of_clicked_pt){
        var reqd_rga = [];
        for( i = 0; i < flearn.imgstack.length; i++){
            for( j = 0 ; j < flearn.imgstack[0].length; j++){
                reqd_rga = flearn.imgstack[i][j];
                var dist = Math.sqrt( Math.pow((rgb_of_clicked_pt[0] - reqd_rga[0]), 2) + 
                                      Math.pow((rgb_of_clicked_pt[1] - reqd_rga[1]), 2) +  
                                      Math.pow((rgb_of_clicked_pt[1] - reqd_rga[1]), 2));

                if ( dist < 0.005){
                  //highlight the coordinates
                   ctx.globalAlpha = 0.25;
                   ctx.fillStyle = "blue";
                   ctx.fillRect(i,j,8,8);
                }                          
            }

        }
  
  
}