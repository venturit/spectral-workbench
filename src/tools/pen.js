// Basic bezier and polygon drawing pen tool
Fred.tools.pen = new Fred.Tool('draw polygons',{
	polygon: false,
	deselect: function() {
		// OK, let's stop messing around - these handlers should be auto-detected.
		Fred.stop_observing('dblclick',this.on_dblclick)
		Fred.stop_observing('mousedown',this.on_mousedown)
		Fred.stop_observing('mouseup',this.on_mouseup)
		Fred.stop_observing('touchstart',this.on_touchstart)
		Fred.stop_observing('touchend',this.on_touchend)
		Fred.stop_observing('fred:postdraw',this.draw)
	},
	select: function() {
		Fred.observe('dblclick',this.on_dblclick.bindAsEventListener(this))
		Fred.observe('mousedown',this.on_mousedown.bindAsEventListener(this))
		Fred.observe('mouseup',this.on_mouseup.bindAsEventListener(this))
		Fred.observe('touchstart',this.on_touchstart.bindAsEventListener(this))
		Fred.observe('touchend',this.on_touchend.bindAsEventListener(this))
		Fred.observe('fred:postdraw',this.draw.bindAsEventListener(this))
	},
	on_mousedown: function() {
		// are we in the middle of making a polygon?
		if (this.polygon) {
			// are we editing a point?
			if (this.polygon.in_point()) {

			} else {
				// close polygon if you click on first point
				var on_final = (this.polygon.points.length > 0 && ((Math.abs(this.polygon.points[0].x - Fred.pointer_x) < Fred.click_radius) && (Math.abs(this.polygon.points[0].y - Fred.pointer_y) < Fred.click_radius)))
				if (on_final && this.polygon.points.length > 1) {
					this.polygon.closed = true
					this.complete_polygon()
				} else if (!on_final) this.polygon.points.push(new Fred.Point(Fred.pointer_x,Fred.pointer_y))
			}
		} else {
			this.polygon = new Fred.Polygon
		}
	},
	on_dblclick: function() {
		if (this.polygon.points.length > 1) {
			this.complete_polygon()
		}
	},
	on_mouseup: function() {
	},
	on_touchstart: function(e) {
		this.on_mousedown(e)
	},
	on_touchend: function(e) {
		this.on_mouseup(e)
	},
	draw: function() {
		//console.log(Fred.timestamp)
		if (this.polygon) this.polygon.draw()
	},
	complete_polygon: function() {
		// move the polygon to the active Fred layer 
		Fred.active_layer.objects.push(this.polygon)
		// stop storing the polygon in the pen tool
		this.polygon = false
		Fred.stop_observing('fred:postdraw',this.draw)
	}
})
