Javascript Architecture

-----------------------

# Canvas.js 
## on page user canvas drawing and interaction

# Document.js

	saveDocument () : { model: documentModel, svg: String } ->

	loadDocument (model: documentModel, svg: String) : ->

	downloadSVG () : ->

# Easing.js

# Main.js

# Scrub.js

# Animation.js

# tracks.js

	createTrack (trackID, fileName) : ->

	editKeyFrame (trackID, pos) : ->

	createKeyFrame(trackID, pos, el) : ->

	deleteKeyFrame(trackID, pos) : ->

	populateDetails(trackID, pos) : ->

	removeKeyFrameByPos(ray, pos) : ->

	removeKeyFrameByPos(ray, pos) : ->

	animationReset(elId, transform, value) : ->

# util.js

	pTs(pos : Number, movie : Movie) : Number ->
		// converts pixels in a track to seconds