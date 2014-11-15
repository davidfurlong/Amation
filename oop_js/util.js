// converts pixels to seconds
function pTs(pos, movie){
	return movie.totalDuration * (pos / movie.totalWidth);
}