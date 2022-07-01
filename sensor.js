class Sensor{
	constructor(car){
		this.car = car;
		this.raycnt = 5;
		this.raylen = 150;
		this.rayspread = Math.PI/2;

		this.rays = [];
		this.readings = [] 
	}


	update(roadBorders,traffic){
		this.#castrays();
		this.readings = []
		for(let i=0;i<this.rays.length;i++){
			this.readings.push(
				this.#getReading(this.rays[i],roadBorders,traffic));	
		}
	}

	#getReading(ray,roadBorders,traffic){

		let touches = [];
		for(let i=0;i<roadBorders.length;i++){
			const touch = getIntersection(
				ray[0],
				ray[1],
				roadBorders[i][0],
				roadBorders[i][1]);
			if(touch){
				touches.push(touch);
			}
		}


		for(let i=0;i<traffic.length;i++){
			const poly = traffic[i].polygon;
			for(let j=0;j<poly.length;j++){
				const val = getIntersection(
					ray[0],
					ray[1],
					poly[j],
					poly[(j+1)%poly.length]);
				if(val){
					touches.push(val);
				}
			}
		}
		if(touches.length==0){
			return null
		}else{
			const offsets = touches.map(e=>e.offset);
			const minOffset = Math.min(...offsets);
			return touches.find(e=>e.offset==minOffset);
		}

	}

	#castrays(){
		this.rays = [];
		for(let i=0;i<this.raycnt;i++){
			const rayAngle = linspace(
				this.rayspread/2,
				-this.rayspread/2,
				this.raycnt==1?0.5:i/(this.raycnt-1)
			)+this.car.angle;

			const st = {x:this.car.x,y:this.car.y};
			const en = {x:this.car.x-Math.sin(rayAngle)*this.raylen,
						y:this.car.y-Math.cos(rayAngle)*this.raylen};

			this.rays.push([st,en]);
		}
	}


	draw(ctx){
		for(let i=0;i<this.raycnt;i++){
			let end = this.rays[i][1];
			if(this.readings[i]){
				end = this.readings[i];
			}
			ctx.beginPath();
			ctx.lineWidth=2;
			ctx.strokeStyle="green";
			ctx.moveTo(
				this.rays[i][0].x,
				this.rays[i][0].y);
			ctx.lineTo(
				end.x,
				end.y);
			ctx.stroke();


			ctx.beginPath();
			ctx.lineWidth=2;
			ctx.strokeStyle="white";
			ctx.moveTo(
				this.rays[i][1].x,
				this.rays[i][1].y);
			ctx.lineTo(
				end.x,
				end.y);
			ctx.stroke();
		}
	}
}