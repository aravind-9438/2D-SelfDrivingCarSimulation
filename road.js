class Road{
	constructor(x,width,lanes=3){
		this.x = x;
		this.width = width;
		this.lanes = lanes;

		this.left = x-width/2;
		this.right = x+width/2;

		const inf = 1000000;
		this.top = -inf;
		this.down = inf;


		const topLeft = {x:this.left,y:this.top};
		const topRight = {x:this.right,y:this.top};
		const bottomLeft = {x:this.left,y:this.down};
		const bottomRight = {x:this.right,y:this.down};
		this.borders = [[topLeft,bottomLeft],[topRight,bottomRight]];



	}

	getLaneCenter(LaneIndex){
		const LaneWidth = this.width/this.lanes;
		return this.left+LaneWidth/2+
		Math.min(LaneIndex,this.lanes-1)*LaneWidth;
	}

	draw(ctx){
		ctx.linWidth = 5;
		ctx.strokeStyle = "White";

		for(let i=1;i<this.lanes;i++){
			const x = linspace(this.left,this.right,i/this.lanes);
			
			ctx.setLineDash([20,20]);
			ctx.beginPath();
			ctx.moveTo(x,this.top);
			ctx.lineTo(x,this.down);
			ctx.stroke();
		}

		ctx.setLineDash([]);
		this.borders.forEach(border=>{
			ctx.beginPath();
			ctx.strokeStyle = "Yellow";
			ctx.moveTo(border[0].x,border[0].y);
			ctx.lineTo(border[1].x,border[1].y);
			ctx.stroke();
		});



	}
}