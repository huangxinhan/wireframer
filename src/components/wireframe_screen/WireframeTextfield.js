import React from 'react';
import { Modal, Icon, Button } from 'react-materialize'
import { Rnd } from "react-rnd";

class WireframeTextfield extends React.Component {
    state = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "solid 1px #696969",
        background: "#ffffff",
   
      };
    
    colorChange = (e) => {
        
    }



    render() {

        const { textfield } = this.props;  
        return (
            <Rnd
            type="text"
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "solid " + textfield.borderWidth + "px " + textfield.borderColor ,
                background: textfield.color
            }}
            
            size={{ width: textfield.sizeWidth,  height: textfield.sizeHeight }}
            position={{ x: textfield.positionX, y: textfield.positionY }}
            onMouseDown={this.props.selectControl.bind(this, textfield.key, "textfield")}
            onDragStop={this.props.reposition.bind(this)}
            onResize={this.props.selectControl.bind(this, textfield.key, "textfield")}
            onResizeStop={this.props.resize.bind(this)}>
                <label  style={{fontSize: textfield.textFont, color: textfield.textColor}} >
                    {textfield.text}
                </label>
            </Rnd>
            
        );
    }

}
export default WireframeTextfield;