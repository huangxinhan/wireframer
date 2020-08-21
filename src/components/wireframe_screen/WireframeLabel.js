import React from 'react';
import { Modal, Icon, Button } from 'react-materialize'
import { Rnd } from "react-rnd";

class WireframeLabel extends React.Component {
    

    state = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: 1
      };
    
    colorChange = (e) => {
        
    }



    render() {

        const { label } = this.props;  
        return (
            <Rnd
            type="text"
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: label.opacity
            }}

            size={{ width: label.sizeWidth,  height: label.sizeHeight }}
            position={{ x: label.positionX, y: label.positionY }}

            onMouseDown={this.props.selectControl.bind(this, label.key, "label")}
            onDragStop={this.props.reposition.bind(this)}
            onResize={this.props.selectControl.bind(this, label.key, "label")}
            onResizeStop={this.props.resize.bind(this)}>
                <label style={{fontSize: label.textFont, color: label.textColor}}>
                    {label.text}
                </label>
            </Rnd>
            
        );
    }
}
export default WireframeLabel;