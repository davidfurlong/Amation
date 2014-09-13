   
      var SVGDocument = null;
      var SVGRoot = null;

      var TrueCoords = null;
      var GrabPoint = null;
      var BackDrop = null;
      var DragTarget = null;

      var selectedElement = null;

      function Select(evt) {
         
      }

      function Init(evt) {
         SVGDocument = document.getElementById('canvas');
         console.log(evt);
         SVGRoot = SVGDocument;

         // these svg points hold x and y values...
         //    very handy, but they do not display on the screen (just so you know)
         TrueCoords = SVGRoot.createSVGPoint();
         GrabPoint = SVGRoot.createSVGPoint();

         // this will serve as the canvas over which items are dragged.
         //    having the drag events occur on the mousemove over a backdrop
         //    (instead of the dragged element) prevents the dragged element
         //    from being inadvertantly dropped when the mouse is moved rapidly
         BackDrop = SVGDocument.getElementById('canvas');
      }

      function Grab(evt) {
         // find out which element we moused down on
         var targetElement = $(evt.target).parentsUntil('svg').get(0);
         if(evt.toElement.id == 'canvas')
            return
         // you cannot drag the background itself, so ignore any attempts to mouse down on it
         if ( BackDrop != targetElement )
         {
            
            //set the item moused down on as the element to be dragged
            DragTarget = targetElement;

            // move this element to the "top" of the display, so it is (almost)
            //    always over other elements (exception: in this case, elements that are
            //    "in the folder" (children of the folder group) with only maintain
            //    hierarchy within that group
            DragTarget.parentNode.appendChild( DragTarget );

            // turn off all pointer events to the dragged element, this does 2 things:
            //    1) allows us to drag text elements without selecting the text
            //    2) allows us to find out where the dragged element is dropped (see Drop)
            DragTarget.setAttributeNS(null, 'pointer-events', 'none');

            // we need to find the current position and translation of the grabbed element,
            //    so that we only apply the differential between the current location
            //    and the new location
            var transMatrix = DragTarget.getCTM();
            GrabPoint.x = TrueCoords.x - Number(transMatrix.e);
            GrabPoint.y = TrueCoords.y - Number(transMatrix.f);

         }
      };


      function Drag(evt) { // THIS IS A HOVER CALL
         console.log('drag');
         // account for zooming and panning
         GetTrueCoords(evt);

         // if we don't currently have an element in tow, don't do anything
         if (DragTarget)
         {
            // account for the offset between the element's origin and the
            //    exact place we grabbed it... this way, the drag will look more natural
            var newX = TrueCoords.x - GrabPoint.x;
            var newY = TrueCoords.y - GrabPoint.y;

            // apply a new tranform translation to the dragged element, to display
            //    it in its new location
            DragTarget.setAttributeNS(null, 'transform', 'translate(' + newX + ',' + newY + ')');
         }
      };


      function Drop(evt) {
         console.log('drop');
         // if we aren't currently dragging an element, don't do anything
         if ( DragTarget )
         {
            // since the element currently being dragged has its pointer-events turned off,
            //    we are afforded the opportunity to find out the element it's being dropped on
            var targetElement = evt.target;

            // turn the pointer-events back on, so we can grab this item later
            DragTarget.setAttributeNS(null, 'pointer-events', 'all');
            if ( 'Folder' == targetElement.parentNode.id )
            {
               // if the dragged element is dropped on an element that is a child
               //    of the folder group, it is inserted as a child of that group
               targetElement.parentNode.appendChild( DragTarget );
               //alert(DragTarget.id + ' has been dropped into a folder, and has been inserted as a child of the containing group.');
            }
            else
            {
               // for this example, you cannot drag an item out of the folder once it's in there;
               //    however, you could just as easily do so here
               //alert(DragTarget.id + ' has been dropped on top of ' + targetElement.id);
            }

            // set the global variable to null, so nothing will be dragged until we
            //    grab the next element
            DragTarget = null;
         }
      };


      function GetTrueCoords(evt) {
         // find the current zoom level and pan setting, and adjust the reported
         //    mouse position accordingly
         var newScale = SVGRoot.currentScale;
         var translation = SVGRoot.currentTranslate;
         TrueCoords.x = (evt.clientX - translation.x)/newScale;
         TrueCoords.y = (evt.clientY - translation.y)/newScale;
      };