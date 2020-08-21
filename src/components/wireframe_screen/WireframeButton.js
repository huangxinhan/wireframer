import React from 'react';
import { Modal, Icon, Button } from 'react-materialize'
import Draggable, {DraggableCore} from 'react-draggable'; // Both at the same time
import { Resizable, ResizableBox } from 'react-resizable';
import ReactDraggableResizable from 'react-draggable-resizable'
import { Rnd } from "react-rnd";

class WireframeButton extends React.Component {
    state = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "solid 1px #ddd",
        background: "#f0f0f0",
   
      };
    
    colorChange = (e) => {
        
    }

    reposition = (e, d) => {
        
    }



    render() {

        const { button } = this.props;  
        return (
            <Rnd
            type="text"
            className="hoverable"
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "solid " + button.borderWidth + "px " + button.borderColor ,
                background: button.color,
            }}
            size={{ width: button.sizeWidth,  height: button.sizeHeight }}
            position={{ x: button.positionX, y: button.positionY }}

            onDragStop={this.props.reposition.bind(this)}
            onResize={this.props.selectControl.bind(this, button.key, "button")}
            onResizeStop={this.props.resize.bind(this)}
            onMouseDown={this.props.selectControl.bind(this, button.key, "button")}>
                <a style={{fontSize: button.textFont, color: button.textColor}}>
                    {button.text}
                </a>
            </Rnd>
            //have the text inside saved to a state with all the propertie (color, size, ect)
            //when changing text size, color, ect, implement function that updates staste
            //<a color={this.state.textcolor} ect...
            
        );
    }
}
export default WireframeButton;