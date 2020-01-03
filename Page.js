class Page{
	constructor(backgroundColor, father, son){
		this.matrix = [[1, 0, 0 , 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0 , 1]];
		this.matrix3d = ""
		this.backgroundColor = backgroundColor
		this.son = $("<" + son + "></" + son + ">")
		father.append(this.son)
	}
	display () {
		this.son.css({
			transform: this.matrix3d,
			backgroundColor: this.backgroundColor
		})
	}
	matrixMul (newMatrix, oldMatrix){
		let temp = [[0, 0, 0 , 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0 , 0]];
		for(let i = 0; i < 4; i++){
			for(let j = 0; j < 4; j++){
				for(let k = 0; k < 4; k++){
					temp[i][j] += newMatrix[i][k] * oldMatrix[k][j];
				}
			}
		}
		return temp;
	}
	getMatrix3d (temp) {
		this.matrix = this.matrixMul(temp, this.matrix);
		this.matrix3d = this.toStr(this.matrix)
		return this;
	}
	tx (num){
		const temp = [[1, 0, 0 , 0], 
					[0, 1, 0, 0], 
					[0, 0, 1, 0], 
					[num, 0, 0, 1]];
		this.getMatrix3d (temp)
		this.display()
		return this
	}
	ty (num){
		const temp = [[1, 0, 0 , 0], 
					[0, 1, 0, 0], 
					[0, 0, 1, 0], 
					[0, num, 0, 1]];
		this.getMatrix3d (temp)
		this.display()
		return this
	}
	tz (num){
		const temp = [[1, 0, 0 , 0], 
						[0, 1, 0, 0], 
						[0, 0, 1, 0], 
						[0, 0, num, 1]];
		this.getMatrix3d (temp)
		this.display()
		return this
	}
	rx (num){
		const cos = Math.cos(num * 3.1415929 / 180);
		const sin = Math.sin(num * 3.1415929 / 180);
		const temp = [[1, 0, 0 , 0], 
					[0, cos, sin, 0], 
					[0, -sin, cos, 0], 
					[0, 0, 0, 1]];
		this.getMatrix3d (temp)
		this.display()
		return this
	}
	ry (num){
		const cos = Math.cos(num * 3.1415929 / 180);
		const sin = Math.sin(num * 3.1415929 / 180);
		const temp = [[cos, 0, -sin, 0], 
					[0, 1, 0, 0], 
					[sin, 0, cos, 0], 
					[0, 0, 0, 1]];
		this.getMatrix3d (temp)
		this.display()
		return this
	}
	rz (num){
		const cos = Math.cos(num * 3.1415929 / 180);
		const sin = Math.sin(num * 3.1415929 / 180);
		const temp = [[cos, sin, 0, 0], 
					[-sin, cos, 0, 0], 
					[0, 0, 1, 0], 
					[0, 0, 0, 1]];
		this.getMatrix3d (temp)
		this.display()
		return this
	}
	toStr (){
		return "matrix3d(" + this.matrix.join(",") +")";
	}
	renew (backgroundColor){
		this.matrix = [[1, 0, 0 , 0], 
					[0, 1, 0, 0], 
					[0, 0, 1, 0], 
					[0, 0, 0 , 1]];
		this.matrix3d = ""
		this.backgroundColor = backgroundColor
	}
	show () {
		this.backgroundColor = "black"
		this.display()
	}
}