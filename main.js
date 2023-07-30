const TAU = Math.PI * 2;
const HALF_PI = Math.PI / 2;

Math.SineInOut = function(percent, amp) {
    return amp * (Math.sin(percent * TAU - HALF_PI) + 1) * 0.5;
};

let app, graphics, space;
let total_vertices = 6;
let amplitud = 150;
let width, height, halfHeight;

function init() {
	app = new PIXI.Application({ antialias: true, resolution: window.devicePixelRatio, transparent: true });
	document.body.appendChild(app.view);
	//
	graphics = new PIXI.Graphics();
	app.stage.addChild(graphics);
	resize();
	window.addEventListener("resize", resize, false);
}

function animate() {
	requestAnimationFrame(animate);
	render();
}

function bezier(points) {
		let size = points.length;
		let last = size - 4;
		graphics.moveTo(points[0], points[1]);
		for (let i = 0; i < size - 2; i += 2) {
				let x0 = i ? points[i - 2] : points[0];
				let y0 = i ? points[i - 1] : points[1];
				let x1 = points[i + 0];
				let y1 = points[i + 1];
				let x2 = points[i + 2];
				let y2 = points[i + 3];
				let x3 = i !== last ? points[i + 4] : x2;
				let y3 = i !== last ? points[i + 5] : y2;
				let cp1x = x1 + (x2 - x0) / 6;
				let cp1y = y1 + (y2 - y0) / 6;

				let cp2x = x2 - (x3 - x1) / 6;
				let cp2y = y2 - (y3 - y1) / 6;
				graphics.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x2, y2);
		}
}

function render() {
	let time = new Date().getTime() * 0.001;
	graphics.clear();
	graphics.beginFill(0xFFFFFF);
	let points = [];
	for (let i = 0; i <= total_vertices; i ++) {
			let x = space * i;
			let amp = Math.sin(time - i) * amplitud;
			let y = Math.SineInOut(i / total_vertices, amp);
			points.push(x, halfHeight + y);
	}
	bezier(points);
	graphics.lineTo(width, height);
	graphics.lineTo(0, height);
	graphics.lineTo(0, halfHeight);
	graphics.endFill();
}


function resize() {
	width = window.innerWidth;
	height = window.innerHeight;
	halfHeight = height/2;
	space = width / total_vertices;
	app.renderer.resize(width, height);
}

init();
animate();