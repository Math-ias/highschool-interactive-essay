/**
 * The circlejs object.
 @constructor
 @param {string} image - An image object.
 @param {dictionary} points - {x=x, y=y, click=function}
 @param {context} context - Context of the canvas.
 @param {float} radius - Radius of the circle that is created.
 *
 */

var debug = false;

function Circle(image, points, canvas, radius){
    this.metapoints = [];
    var metapoints = this.metapoints; // Ugly hack!
    this.core = oCanvas.create({
        canvas: canvas,
    });
    this.image = this.core.display.image({
        x: 0,
        y: 0,
        image: image,
    });

    if(!radius)
        if (this.core.width>this.core.height)
            this.radius = (this.core.height)/2 - 20;
        else
            this.radius = (this.core.width)/2 - 20;

    if (image.width>image.height)
        var scale = this.radius/image.height*5/4;
    else // Height is greater than the width.
        var scale = this.radius/image.width*5/4;

    this.image.scale(scale, scale);

    this.image.moveTo(this.core.width/2 - image.width*scale/2, this.core.height/2 - image.height*scale/2);

    this.core.addChild(this.image);

    for (var i=0; i<points.length; i++){
        var point = points[i];
        var pointA = new Point((point.x - image.width/2) * scale + .1, (point.y - image.height/2) * scale + .1);
        var pointB = new Point();
        var slope = pointA.y/pointA.x;
        // Poppi's algorithm.
        if(pointA.x<0){ // In quadrant II, and III.
            pointB.x = 0 - this.radius/Math.sqrt(1+Math.pow(slope,2));
            pointB.y = 0 - (this.radius*slope)/Math.sqrt(1+Math.pow(slope,2));
        }else{
            pointB.x = this.radius/Math.sqrt(1+Math.pow(slope,2));
            pointB.y = (this.radius*slope)/Math.sqrt(1+Math.pow(slope,2));
        }

        pointA.x = Math.floor(pointA.x + (this.image.x+image.width/2*scale));
        pointA.y = Math.floor(pointA.y + (this.image.y+image.height/2*scale));
        pointB.x = Math.floor(pointB.x + (this.image.x+image.width/2*scale));
        pointB.y = Math.floor(pointB.y + (this.image.y+image.height/2*scale));

        var metapoint = {
            name: point.name,
            click: point.click,
            origin: pointA,
            endpoint: pointB,
        }

        this.metapoints.push(metapoint);
    }

    for (var i=0;i<this.metapoints.length;i++){
        var metapoint = this.metapoints[i];
        metapoint["line"] = this.core.display.line({
            start: {x: metapoint.origin.x, y: metapoint.origin.y},
            end: {x: metapoint.endpoint.x, y: metapoint.endpoint.y},
            stroke: "2px black",
        });
        metapoint["text"] = this.core.display.text({
            x: -5,
            y: 0,
            text: metapoint.name,
            baseline: 'middle',
            align: 'center',
            fill: "#FFF",
        });
        metapoint["point"] = this.core.display.ellipse({
            x: metapoint.origin.x,
            y: metapoint.origin.y,
            radius: 3,
            fill: "#000",
        },{

        });

        metapoint["bubble"] = this.core.display.ellipse({
            x: metapoint.endpoint.x,
            y: metapoint.endpoint.y,
            radius: 18,
            fill: "#000",
        });

		metapoint.xp = metapoint.endpoint.x;
		metapoint.yp = metapoint.endpoint.y;

        metapoint["bubble"].bind("click tap", metapoint.click);

        metapoint["bubble"].bind("mouseenter", function(event){
        this.stop().animate({
                radius: 25,
            },{
                duration: 'normal',
                easing: 'ease-in-out-quadratic',
            });
        });

        metapoint["bubble"].bind("mouseleave", function(){
            this.stop().animate({
                radius: 18,
            },{
                duration: 'short',
                easing: 'ease-in-out-quadratic',
            }
            );
        });

        this.core.addChild(metapoint["line"]);
        this.core.addChild(metapoint["point"]);
        metapoint["bubble"].addChild(metapoint["text"]);
        this.core.addChild(metapoint["bubble"]);
        if(debug){
			this.core.addChild(this.core.display.ellipse({
				x: metapoint.endpoint.x,
				y: metapoint.endpoint.y,
				radius: 18*4,
				stroke: "1px #000",
			}));
		}
    }

    this.core.setLoop(function(){
			for(var i=0;i<metapoints.length;i++){
				var metapoint = metapoints[i];
				var distance = Math.pow(metapoint.endpoint.x-this.mouse.x,2) + Math.pow(metapoint.endpoint.y-this.mouse.y,2);
				var ratio = 1/distance;
				if(distance < Math.pow(18*3,2)){
					var damper = 20;

					metapoint.xp += (this.mouse.x - metapoint.xp) / damper;
					metapoint.yp += (this.mouse.y - metapoint.yp) / damper;

					var x = metapoint.xp;
					var y = metapoint.yp;

					metapoint.bubble.x = x;
					metapoint.bubble.y = y;
					metapoint.line.end.x = x;
					metapoint.line.end.y = y;
				}else if(metapoint.bubble.x != metapoint.endpoint.x){
					var damper = 30;

					metapoint.xp += (metapoint.endpoint.x - metapoint.xp) / damper;
					metapoint.yp += (metapoint.endpoint.y - metapoint.yp) / damper;

					var x = metapoint.xp;
					var y = metapoint.yp;

					metapoint.bubble.x = x;
					metapoint.bubble.y = y;
					metapoint.line.end.x = x;
					metapoint.line.end.y = y;
				}
			}
	}).start();
}

function Point(x,y){
    if(x && y)
        this.x = x;
        this.y = y;
}
