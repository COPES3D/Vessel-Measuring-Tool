get point coordinates from event
get_point(e){
  const matrix = this.canvas.transform.baseVal[0].matrix
  const newPoint =  [((e.pageX-matrix.e-this.x)/matrix.a),((e.pageY-matrix.f-this.y)/matrix.a)]
  return newPoint
}


<Measures />
joinTwoPolylines(poly1, poly2){
  const new_poly = join2Polylines(poly1, poly2)

  if(!new_poly){
    this.addNotification("Not joinable")
    return
  }
  return joined_poly

  const joined_poly = new Polyline({
    points: cleanedPoly(new_poly),
    id: this.id,
    type: poly1.type,
    selected: true,
    canvas: this.canvas,
    offsetX: this.x,
    offsetY: this.y,
    currentZoom: this.panZoomTiger.getZoom()
  })
  joined_poly.stopEditing({code:'Escape'})
  this.canvas.removeChild(joined_poly.el)
  this.id++

  this.canvas.removeChild(poly1.el)
  this.canvas.removeChild(poly2.el)
  this.canvas.appendChild(joined_poly.el)
  joined_poly.draw()

  let new_polylines = this.state.polylines.filter(el => el.id!==poly1.id && el.id !==poly2.id )
  new_polylines.push(joined_poly)
  this.addNotification(message)
  this.setState(
    { polylines: new_polylines,
      notification:{ id:this.not_id, message: message },
      active_polyline: joined_poly
    }
  )
  this.not_id++
}
joinTwoLines(){
  //TODO
  this.addNotification("Select first line")
}

<div
  className="interface-button"
  onClick={this.joinTwoLines.bind(this)}>
  Join 2 lines
</div>

if(this.state.active_polyline){
  if(this.state.polylines.filter(e => e.type==='int_prof').length > 1){
    if(this.state.active_polyline.type==='int_prof' || this.state.active_polyline.type==='ext_prof'){
      this.changeType(this.state.active_polyline.type, this.state.active_polyline.id)
    }
  }

changeType(type, id){
  this.setState({
    polylines: this.state.polylines.map(function(l){
      if(l.type===type && l.id !== id){
        l.type=`1_${type}`
        l.el.setAttribute('type', `1_${type}`)
      }
      return l
    })
  })
}

<div
  className="interface-button"
  onClick={this.delete_line.bind(this)}
  title="Delete selected line"
  alt="Delete selected line"
  >
  Delete
</div>
<div
  className="interface-button"
  onClick={this.edit_line.bind(this)}
  title="Edit selected line"
  alt="Edit selected line"
  >
  Edit
</div>
delete_line(){
  this.globalStopEditingMode()
  if(!this.state.active_polyline){
    this.addNotification("No line selected")
    return
  }
  this.canvas.removeChild(this.state.active_polyline.el)
  this.setState({
    polylines:this.state.polylines.filter(
      el => el.id !== this.state.active_polyline.id),
      active_polyline: undefined
    }, ()=> {
      this.checkProfile();
      recreate_snapping_points(this.state.polylines)
    }
  )
}

edit_line(){
  this.removeClickSelectEvent()
  this.globalStopEditingMode()
  if(!this.state.active_polyline){
    this.addNotification("No line selected")
    return
  }
  this.state.active_polyline.editLine()
}

/* Move aligned quote /*
//check if mouse is above or below initial line
//https://stackoverflow.com/a/36494727
//let mx = currentX - this.centerX
//let my = currentY - this.centerY
//let cross = this.dx * my - this.dy * mx    //zero means point on line
//if(cross === 0){
//  return
//}
//let below = (cross > 0)          //mouse is "at the right hand" of the directed line
//if(dx !== 0){
//  if(dy/dx < 0){
//    below = !below
//  }
//  if(this.invert){
//    below = !below
//  }
//}
//calc distance
//let r_dist = distance([this.startX, this.startY], [currentX, currentY])
//let dist
//if(below){
//  console.log('below')
//  dist = this.r_dist - r_dist
//}else{
//  dist = r_dist - this.r_dist
//}
//if(slope>0){
//  dist = -1 * dist
//}
//this.r_dist = r_dist

if(this.quote.points[0].cx < this.quote.points[1].cx &&this.quote.points[0].cy < this.quote.points[1].cy){
  console.log(1)
  this.invert = -1
}
if(this.quote.points[0].cx > this.quote.points[1].cx && this.quote.points[0].cy > this.quote.points[1].cy){
  console.log(2)
  this.invert = -1
}
if(this.quote.points[0].cx < this.quote.points[1].cx &&this.quote.points[0].cy > this.quote.points[1].cy){
  console.log(3)
  this.invert = 1
}
if(this.quote.points[0].cx > this.quote.points[1].cx && this.quote.points[0].cy < this.quote.points[1].cy){
  console.log(4)
  this.invert = 1
}
