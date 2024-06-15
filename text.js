function wrapText(context, text, x, y, maxWidth, lineHeight){
	var line = '';
	var word = '';
	
	for(let c of text){
		if (c == ' ' || c == '\n'){
			var testLine = line + word;
			var metrics = context.measureText(testLine);
			var testWidth = metrics.width;
			if (testWidth > maxWidth){
			    var offsetX = (maxWidth - context.measureText(line).width) / 2;
				context.fillText(line, x + offsetX, y);
				line = word + ' ';
				y += lineHeight;
			} else if (c == '\n'){
				var offsetX = (maxWidth - testWidth)/2
				context.fillText(testLine, x + offsetX, y);
				line = '';
				y += lineHeight;
			}else{
				line += word + ' ';
			}
			word = '';
		}else{
			word += c;
		}		
	}
	var offsetX = (maxWidth - context.measureText(line + word).width) / 2;
	context.fillText(line + word, x + offsetX, y);
}