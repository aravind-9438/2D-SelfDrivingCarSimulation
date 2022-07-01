class Car{
    constructor(x,y,width,height,type,maxspeed=3){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;

        this.speed = 0;
        this.acc = 0.2;

        this.maxspeed = maxspeed;
        this.friction = 0.05;

        this.angle = 0;
        this.damaged = false;
        this.useBrain = type=="real";


        if(type!="dummy"){
            this.sensor = new Sensor(this);
            this.brain = new NN(
                [this.sensor.raycnt,6,4]);
        }
        this.controls = new Controls(type);
    }


    update(roadBorders,traffic){ 
        if(!this.damaged){
    	   this.#move();
            this.polygon = this.#createPolygon();
            this.damaged = this.#damageCalc(roadBorders,traffic);
            // console.log(this.sensor.rays);
            }
        if(this.sensor){
            this.sensor.update(roadBorders,traffic);
            const offsets = this.sensor.readings.map(
                s=>s==null?0:1-s.offset);
            const outputs = NN.feedForward(offsets,this.brain);
            // console.log(outputs);

            if(this.useBrain){
                this.controls.forward=outputs[0];
                this.controls.left=outputs[1];
                this.controls.right=outputs[2];
                this.controls.backward=outputs[3];
            }
        }
    }


    #damageCalc(roadBorders,traffic){
        for(let i=0;i<roadBorders.length;i++){
            if(polysIntersect(this.polygon,roadBorders[i])){
                return true;
            }
        }
        for(let i=0;i<traffic.length;i++){
            if(polysIntersect(this.polygon,traffic[i].polygon)){
                return true;
            }
        }

    }

    #createPolygon(){
        const points = [];
        const rad = Math.hypot(this.width,this.height)/2;
        const alpha = Math.atan2(this.width,this.height);
        points.push({
            x:this.x-Math.sin(this.angle-alpha)*rad*(1),
            y:this.y-Math.cos(this.angle-alpha)*rad*(1)
        });
        points.push({
            x:this.x-Math.sin(this.angle+alpha)*rad*1,
            y:this.y-Math.cos(this.angle+alpha)*rad*1
        });
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle-alpha)*rad*1,
            y:this.y-Math.cos(Math.PI+this.angle-alpha)*rad*1
        });
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle+alpha)*rad*1,
            y:this.y-Math.cos(Math.PI+this.angle+alpha)*rad*1
        });

        return points


    }


    #move(){
        if(this.controls.forward){
            this.speed+=this.acc;
        }
        if(this.controls.backward){
            this.speed-=this.acc;
        }
        if(this.speed>this.maxspeed){
            this.speed = this.maxspeed;
        }
        if(this.speed<-this.maxspeed){
            this.speed = -this.maxspeed/2;
        }
        if(this.speed>0){
            this.speed-=this.friction;
        }
        if(this.speed<0){
            this.speed+=this.friction;
        }
        if(Math.abs(this.speed)<this.friction){
            this.speed = 0
        }
        if(this.speed!=0){
            const flag = this.speed>0?1:-1;
            if(this.controls.left){
                this.angle+=0.03*flag;
            }
            if(this.controls.right){
                this.angle-=0.03*flag;
            }  
        }

        this.x -= Math.sin(this.angle)*this.speed;
        this.y -= Math.cos(this.angle)*this.speed;
 
        this.y -= this.speed
    }

    draw(ctx,color,drawSensor=false){ 

        if(this.damaged){
            ctx.fillStyle="gray";
        }else{
            ctx.fillStyle=color;
        }


    	ctx.beginPath();
        ctx.moveTo(this.polygon[0].x,this.polygon[0].y)
        for(let i=1;i<this.polygon.length;i++){
            ctx.lineTo(this.polygon[i].x,this.polygon[i].y);
        }

        ctx.strokeStyle = "green"
        // ctx.fillStyle = "#FF0000";
        ctx.stroke(); 
        ctx.fill();   


        if(this.sensor && drawSensor){
        this.sensor.draw(ctx);
        }
    }
}