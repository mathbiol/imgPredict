flearn=function(){}

var c = document.getElementById("canvas");
var ctx = c.getContext("2d");	
c.addEventListener('mousemove', pick);
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
  				ctx.drawImage(img, 0, 0);
  				img.style.display = 'none';
				}
                img.src = fileLoadedEvent.target.result;
            }
            fileReader.readAsDataURL(fileToLoad);
        }
    }
}

function getStack(event){
    flearn.imgstack=[]
      for(j=1;j<event.layerY;j++){
          flearn.imgstack[j]=[];
          for(i=1;i<event.layerX;i++){
              flearn.imgstack[j][i]=ctx.getImageData(i, j, 1, 1).data.slice(0,3)
          }
      }
}

function pick(event) {
  //if(!flearn.imgstack){
      // the pixels were not harvested yet, let's do it
      getStack(event)
      //debugger
  //}
  //debugger
  var x = event.layerX;
  var y = event.layerY;
  var pixel = ctx.getImageData(x, y, 1, 1);
  var data = pixel.data;
  var rgba = 'rgba(' + data[0] + ', ' + data[1] +
             ', ' + data[2] + ', ' + (data[3] / 255) + ')';
  var color = document.getElementById('color');
  color.style.background =  rgba;
  color.textContent = rgba;
}