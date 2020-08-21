import React from 'react';
import { Modal, Icon, Button } from 'react-materialize'
import Draggable, {DraggableCore} from 'react-draggable'; // Both at the same time
import { Resizable, ResizableBox } from 'react-resizable';
import { Rnd } from "react-rnd";

class WireframeContainer extends React.Component {
    state = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "solid 3px #000000",
        background: "#ffffff",
      };
    
    colorChange = (e) => {
        this.setState({background: "#800080"})
    }



    render() {
        const { container } = this.props;  

        return (

            <Rnd
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "solid " + container.borderWidth + "px " + container.borderColor ,
                background: container.color,

            }}
            size={{ width: container.sizeWidth,  height: container.sizeHeight }}
            position={{ x: container.positionX, y: container.positionY }}

            onMouseDown={this.props.selectControl.bind(this, container.key, "container")}
            onDragStop={this.props.reposition.bind(this)}
            onResize={this.props.selectControl.bind(this, container.key, "container")}
            onResizeStop={this.props.resize.bind(this)}
            >
                <div style={{fontSize: container.textFont, color: container.textColor}}>
                    {container.text}
                </div>
            </Rnd>


        );
    }
}
export default WireframeContainer;