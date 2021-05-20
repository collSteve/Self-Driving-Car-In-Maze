function dist2D(A,B){
  return Math.sqrt((A.x - B.x)*(A.x - B.x) +
                   (A.y - B.y)*(A.y - B.y));
}

function randomNum(min, max) {
	return Math.floor(Math.random() * (max - min)) + min; // You can remove the Math.floor if you don't want it to be an integer
}

function deepCopy(A) {
  return JSON.parse(JSON.stringify(A));
}
