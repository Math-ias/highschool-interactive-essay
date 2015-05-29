oCanvas.domReady(function(){
    image = new Image();
    image.src = "img/image.jpeg";

    smoothScroll.init();

    function scroll(element){
        smoothScroll.animateScroll(null, element);
    }

    image.onload = (function(){

    points = [
        {
            x: 1005,
            y: 100,
            click: function(){
                scroll("#p:medium");
            },
            name: "1",
        },
        {
            x: 897,
            y: 1168,
            click: function(){
                scroll("#p:cannon");
            },
            name: "2",
        },{
            x: 462,
            y: 1042,
            click: function(){
                scroll("#p:belly");
            },
            name: "3",
        },{
            x: 366,
            y: 346,
            click: function(){
                scroll("#p:upbringing");
            },
            name: "4",
        },{
            x: 194,
            y: 616,
            click: function(){
                scroll("#p:colonel");
            },
            name: '5',
        },{
            x: 614,
            y: 655,
            click: function(){
                scroll("#p:exploits");
            },
            name: '6',
        },
    ];

    var canvas = document.getElementById("mycanvas");
    canvas.width = canvas.offsetWidth;

    circle = new Circle(image, points, canvas);

	});
});
