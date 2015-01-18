	//检测图片相似度
	var getDistance = function(img1, img2){
		//使图像灰度化，返回灰度化后的图像
		var greyImg = function(img){
			var c  =document.createElement("canvas");
			var canvas = c.getContext("2d");
			c.width = img.width;
			c.height = img.height;
			canvas.drawImage(img, 0, 0, c.width, c.height);
			var imageData = canvas.getImageData(0, 0, c.width, c.height);
			for (var i = 0,
         length = imageData.data.length; i < length; i += 4) {
            var r = imageData.data[i];
            var g = imageData.data[i + 1];
            var b = imageData.data[i + 2];
            var a = imageData.data[i + 3];
            var grey = (30 * r + 59 * g + 11 * b) / 100;
            imageData.data[i] = grey;
            imageData.data[i + 1] = grey;
            imageData.data[i + 2] = grey;
         }
         canvas.putImageData(imageData, 0, 0);

			var gImg = document.createElement("img");
			gImg.src = c.toDataURL();
			document.body.appendChild(gImg);
				 return gImg;
		};
		var scaleImg = function(img){
			var canvas = document.createElement("canvas");
			var ctx = canvas.getContext("2d");
			canvas.width = 9;
			canvas.height = 8;
			ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
			var sImg = document.createElement("img");
			document.body.appendChild(canvas);
			return ctx.getImageData(0, 0, canvas.width, canvas.height);
		};

		var getHash = function(imageData){
			var arr = [];
			for(var i=0, len=imageData.data.length;i<len;i+=4){
				arr.push(imageData.data[i]);
			}


			var arr2 = []
			for(var j=0;j<arr.length-1;j++){
				if(j!==0 && (j+1)%9===0){
					continue;
				}
				if(arr[j]>arr[j+1]){
					arr2.push(1);
				}else{
					arr2.push(0);
				}
			}
			return parseInt(arr2.join(""), 2).toString(16);
		}

				var dec2hex = function(hex){
						var zero = '0000000000000000';
   					var tmp  = zero.length-hex.length;
   					return zero.substr(0,tmp) + hex;
				}


				var hash1 = dec2hex(getHash(scaleImg(greyImg(img1))));
				var hash2 = dec2hex(getHash(scaleImg(greyImg(img2))));
				var distance = 0;
		for(var m=0;m<16;m++){
			if(hash1.charAt(m) !== hash2.charAt(m)){
				distance++;
			}
		}
		return distance
	}
