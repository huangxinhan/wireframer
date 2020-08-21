import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { getFirestore } from 'redux-firestore';
import { Link } from 'react-router-dom';
import WireframeButtonList from './WireframeButtonList.js'
import WireframeContainerList from './WireframeContainerList.js'
import WireframeLabelList from './WireframeLabelList.js'
import WireframeTextfieldList from './WireframeTextfieldList'
import { HuePicker } from 'react-color'
import { Modal } from 'react-materialize'

class WireFrameScreen extends React.Component {
    state = {
        name: '',
        owner: '',
        goHome: '',
        selectedControl: null,
        fontSize: null,
        text: null,
        borderRadius: null,
        backgroundColor: "#000000",
        borderColor: "#000000",
        textColor: "#000000",
        AllControls: [],
        reRender: null,
        saved: false,
        positionX: 0,
        positionY: 0,
        width: 0,
        height: 0,
        index: 0,
        ControlChangeStack: [], //stores index and position of the controls changed
        ControlChangeProperty: [], //stores which property was changed 
        deletedControls: [], //an array that holds information about all deleted controls
        zoom: 1,
        left: "0px",
        right: "0px",
        mainWidth: 740,
        mainHeight: 800
    }

    //save new divs to the state, state stores a copy of the current controls


    handleChange = (e) => {
        const { target } = e;
    
        this.setState(state => ({
            ...state,
            [target.id]: target.value,
        }));
  
        this.props.wireframe[target.id] = target.value;
        
        this.fireStoreUpdateAll();


    }

    returnToHome = (event) => {
        event.cancelBubble = true;
        if(event.stopPropagation) event.stopPropagation();
        //iteratively delete everything that is in the 
        var unsavedControls = this.state.AllControls;
        var deletedControls = this.state.deletedControls;


        var unsavedControlStack = this.state.ControlChangeStack;
        var unsavedControlProperty = this.state.ControlChangeProperty;

        for (var i = 0; i < deletedControls.length; i++){
            var deletedType = deletedControls[i].type; 
            var deletedKey = deletedControls[i].key; 
            //deletedControls[i].key = this.props.wireframe.controls[deletedType].length
            //this.props.wireframe.controls[deletedType].push(deletedControls[i])
            this.props.wireframe.controls[deletedType].splice(deletedKey, 0, deletedControls[i])
                for (var i = deletedKey + 1; i < this.props.wireframe.controls[deletedType].length; i++){
                    this.props.wireframe.controls[deletedType][i].key++; 
                }
        }

        for (var i = unsavedControlStack.length - 1; i >= 0; i--){
            var position = unsavedControlStack[i].position;
            var index = unsavedControlStack[i].index
            var changedProperty = unsavedControlProperty[i].property;
            var changedValue = unsavedControlProperty[i].value;
            var positionX = unsavedControlProperty[i].valueX;
            var positionY = unsavedControlProperty[i].valueY
            var width = unsavedControlProperty[i].width;
            var height = unsavedControlProperty[i].height;

            if(changedProperty === "color"){
                this.props.wireframe.controls[position][index].color = changedValue;
            }

            if(changedProperty === "borderColor"){
                this.props.wireframe.controls[position][index].borderColor = changedValue
            }

            if(changedProperty === "textColor"){
                this.props.wireframe.controls[position][index].textColor = changedValue
            }

            if(changedProperty === "text"){
                this.props.wireframe.controls[position][index].text = changedValue
            }

            if(changedProperty === "fontSize"){
                this.props.wireframe.controls[position][index].textFont = changedValue
            }

            if(changedProperty === "borderRadius"){
                this.props.wireframe.controls[position][index].borderWidth = changedValue
            }

            if(changedProperty === "position"){
                this.props.wireframe.controls[position][index].positionX = positionX
                this.props.wireframe.controls[position][index].positionY = positionY
            }

            if(changedProperty === "size"){
                this.props.wireframe.controls[position][index].positionX = positionX
                this.props.wireframe.controls[position][index].positionY = positionY
                this.props.wireframe.controls[position][index].sizeWidth = width
                this.props.wireframe.controls[position][index].sizeHeight = height
            }
        }

        for (var i = 0; i < unsavedControls.length; i++){
            
            this.props.wireframe.controls[unsavedControls[i].type].pop(); //remove that from the array
            
            this.fireStoreUpdateAll();
        }
        this.fireStoreUpdateAll();
        

        this.setState({goHome: "goback"})
    }

    saveAll = (event) => {
        event.cancelBubble = true;
        if(event.stopPropagation) event.stopPropagation();
        this.setState({saved: true}); //sets saved state to true 
        this.setState({AllControls: []})//Empty out the array of controls because they are already saved
        this.setState({ControlChangeProperty: []})
        this.setState({ControlChangeStack: []})
        this.setState({deletedControls: []})
        alert("All Work Saved!")
        //discard the ones that we don't need 
    }

    selectControl = (index, position, event) =>{
        event.stopPropagation();
        console.log(this.props.wireframe.controls[position][index].sizeWidth)
        this.setState({selectedControl: this.props.wireframe.controls[position][index]}) //used for duplicating current selected
        this.setState({fontSize: this.props.wireframe.controls[position][index].textFont})
        this.setState({borderRadius: this.props.wireframe.controls[position][index].borderWidth})
        this.setState({text: this.props.wireframe.controls[position][index].text})
        this.setState({backgroundColor: this.props.wireframe.controls[position][index].color})
        this.setState({textColor: this.props.wireframe.controls[position][index].textColor})
        this.setState({borderColor: this.props.wireframe.controls[position][index].borderColor})
        this.setState({positionX: this.props.wireframe.controls[position][index].positionX})
        this.setState({positionY: this.props.wireframe.controls[position][index].positionY})
        this.setState({position: position})
        this.setState({index: index})
        this.setState({width: this.props.wireframe.controls[position][index].sizeWidth})
        this.setState({height: this.props.wireframe.controls[position][index].sizeHeight})
    }

    fireStoreUpdateAll = () => {
        var firestore = getFirestore();
        firestore.collection('wireframes').doc(this.props.wireframe.id).update({
            name: this.props.wireframe.name,
            owner: this.props.wireframe.owner,
            controls: this.props.wireframe.controls
        })
        .then(function(){
            console.log('success')
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        })
    }

    //This is a testing method used to test duplicating a control 
    duplicateTest= (e) => {
        e.preventDefault();
        var control = this.state.selectedControl;
        this.props.wireframe.controls["button"].push(control);
        console.log(control)

        this.fireStoreUpdateAll();
    }

    addNewContainer = (event) => {
        event.cancelBubble = true;
        if(event.stopPropagation) event.stopPropagation();
        var container = {
            "key": this.props.wireframe.controls["container"].length,
            "positionX": -370,
            "positionY": -400,
            "sizeWidth": 335,
            "sizeHeight": 200,
            "color": "#ffffff",
            "borderWidth" : 3,
            "textFont": 13,
            "textColor": "#ded897",
            "text": "New Container",
            "borderColor": "#000000",
            "type" : "container"
        }
        let updatedControls = this.state.AllControls;
        updatedControls.push(container)
        this.setState({AllControls: updatedControls})
        //update all to firestore first, and then iteratively delete if closed. (this.state.saved = false)

        this.props.wireframe.controls["container"].push(container);
        console.log(container);

        this.fireStoreUpdateAll();      

    }

    addNewLabel = (event) => {
        event.cancelBubble = true;
        if(event.stopPropagation) event.stopPropagation();
        var container = {
            "key": this.props.wireframe.controls["label"].length,
            "positionX": -370,
            "positionY": -400,
            "sizeWidth": 250,
            "sizeHeight": 50,
            "color": "#ffffff",
            "borderWidth" : 0,
            "textFont": 20,
            "textColor": "#000000",
            "text": "New Label",
            "borderColor": "#000000",
            "type" : "label",
            "opacity" : 1
        }
        let updatedControls = this.state.AllControls;
        updatedControls.push(container)
        this.setState({AllControls: updatedControls})
        //update all to firestore first, and then iteratively delete if closed. (this.state.saved = false)

        this.props.wireframe.controls["label"].push(container);
        console.log(container);

        this.fireStoreUpdateAll();    
    }

    addNewButton = (event) => {
        event.cancelBubble = true;
        if(event.stopPropagation) event.stopPropagation();
        var container = {
            "key": this.props.wireframe.controls["button"].length,
            "positionX": -370,
            "positionY": -400,
            "sizeWidth": 200,
            "sizeHeight": 50,
            "color": "#ffffff",
            "borderWidth" : 1,
            "textFont": 17,
            "textColor": "#000000",
            "text": "New Button",
            "borderColor": "#000000",
            "type" : "button",
        }
        let updatedControls = this.state.AllControls;
        updatedControls.push(container)
        this.setState({AllControls: updatedControls})
        //update all to firestore first, and then iteratively delete if closed. (this.state.saved = false)

        this.props.wireframe.controls["button"].push(container);
        console.log(container);

        this.fireStoreUpdateAll(); 
    }

    addNewTextfield = (event) => {
        event.cancelBubble = true;
        if(event.stopPropagation) event.stopPropagation();
        var container = {
            "key": this.props.wireframe.controls["textfield"].length,
            "positionX": -370,
            "positionY": -400,
            "sizeWidth": 250,
            "sizeHeight": 40,
            "color": "#ffffff",
            "borderWidth" : 1,
            "textFont": 17,
            "textColor": "#808080",
            "text": "Enter new text here",
            "borderColor": "#000000",
            "type" : "textfield",
        }
        let updatedControls = this.state.AllControls;
        updatedControls.push(container)
        this.setState({AllControls: updatedControls})
        //update all to firestore first, and then iteratively delete if closed. (this.state.saved = false)

        this.props.wireframe.controls["textfield"].push(container);
        console.log(container);

        this.fireStoreUpdateAll();     
    }

    handleChangeCompleteBackground = (color) => {
        //use color.hex to do color
        //this.setState({backgroundColor: this.props.wireframe.controls[position][index].color})
        if (this.state.selectedControl === null){
            alert("No control currently selected, please select one by clicking on a control");
            return "Nothing Selected"
        }
        const position = this.state.position;
        const index = this.state.index;

        this.props.wireframe.controls[position][index].color = color.hex

        //This is what a changeStack looks like 
        const changeStack = {
            position: this.state.position,
            index: this.state.index
        }

        //This is mapped to the same index of the change property 
        const changeProperty = {
            property: "color",
            value: this.state.backgroundColor,
        }
        const currentChangeStack = this.state.ControlChangeStack;
        const currentChangeProperty = this.state.ControlChangeProperty

        currentChangeStack.push(changeStack)
        this.setState({controlChangeStack: currentChangeStack})

        currentChangeProperty.push(changeProperty);
        this.setState({controlChangeProperty: currentChangeProperty})

        this.setState({backgroundColor: color.hex})

        this.fireStoreUpdateAll();    
    }

    handleChangeCompleteBorder = (color) => {
        if (this.state.selectedControl === null){
            alert("No control currently selected, please select one by clicking on a control");
            return "Nothing Selected"
        }
        const position = this.state.position;
        const index = this.state.index;

        this.props.wireframe.controls[position][index].borderColor = color.hex

        //This is what a changeStack looks like 
        const changeStack = {
            position: this.state.position,
            index: this.state.index
        }

        //This is mapped to the same index of the change property 
        const changeProperty = {
            property: "borderColor",
            value: this.state.borderColor,
        }
        const currentChangeStack = this.state.ControlChangeStack;
        const currentChangeProperty = this.state.ControlChangeProperty

        currentChangeStack.push(changeStack)
        this.setState({controlChangeStack: currentChangeStack})

        currentChangeProperty.push(changeProperty);
        this.setState({controlChangeProperty: currentChangeProperty})

        this.setState({borderColor: color.hex})

        this.fireStoreUpdateAll();     
    }

    handleChangeCompleteText = (color) => {
        if (this.state.selectedControl === null){
            alert("No control currently selected, please select one by clicking on a control");
            return "Nothing Selected"
        }
        const position = this.state.position;
        const index = this.state.index;

        this.props.wireframe.controls[position][index].textColor = color.hex

        //This is what a changeStack looks like 
        const changeStack = {
            position: this.state.position,
            index: this.state.index
        }

        //This is mapped to the same index of the change property 
        const changeProperty = {
            property: "textColor",
            value: this.state.textColor,
        }
        const currentChangeStack = this.state.ControlChangeStack;
        const currentChangeProperty = this.state.ControlChangeProperty

        currentChangeStack.push(changeStack)
        this.setState({controlChangeStack: currentChangeStack})

        currentChangeProperty.push(changeProperty);
        this.setState({controlChangeProperty: currentChangeProperty})

        this.setState({textColor: color.hex})

        this.fireStoreUpdateAll();       
    }

    editText = (e) => {
        if (this.state.selectedControl === null){
            alert("No control currently selected, please select one by clicking on a control");
            return "Nothing Selected"
        }
        const { target } = e;
        const position = this.state.position;
        const index = this.state.index;
        this.props.wireframe.controls[position][index].text = target.value

        const changeStack = {
            position: this.state.position,
            index: this.state.index
        }

        //This is mapped to the same index of the change property 
        const changeProperty = {
            property: "text",
            value: this.state.text
        }
        const currentChangeStack = this.state.ControlChangeStack;
        const currentChangeProperty = this.state.ControlChangeProperty

        currentChangeStack.push(changeStack)
        this.setState({controlChangeStack: currentChangeStack})

        currentChangeProperty.push(changeProperty);
        this.setState({controlChangeProperty: currentChangeProperty})

        this.setState({text: target.value})

        this.fireStoreUpdateAll();       
        
    }

    editTextFontSize = (e) => {
        if (this.state.selectedControl === null){
            alert("No control currently selected, please select one by clicking on a control");
            return "Nothing Selected"
        }
        const { target } = e;
        const position = this.state.position;
        const index = this.state.index;
        this.props.wireframe.controls[position][index].textFont = parseInt(target.value);

        const changeStack = {
            position: this.state.position,
            index: this.state.index
        }

        //This is mapped to the same index of the change property 
        const changeProperty = {
            property: "fontSize",
            value: this.state.fontSize
        }
        const currentChangeStack = this.state.ControlChangeStack;
        const currentChangeProperty = this.state.ControlChangeProperty

        currentChangeStack.push(changeStack)
        this.setState({controlChangeStack: currentChangeStack})

        currentChangeProperty.push(changeProperty);
        this.setState({controlChangeProperty: currentChangeProperty})

        this.setState({fontSize: target.value})

        this.fireStoreUpdateAll();    
    }

    editBorderRadius = (e) => {
        if (this.state.selectedControl === null){
            alert("No control currently selected, please select one by clicking on a control");
            return "Nothing Selected"
        }
        const { target } = e;
        const position = this.state.position;
        const index = this.state.index;
        this.props.wireframe.controls[position][index].borderWidth = parseInt(target.value);

        const changeStack = {
            position: this.state.position,
            index: this.state.index
        }

        //This is mapped to the same index of the change property 
        const changeProperty = {
            property: "borderRadius",
            value: this.state.borderRadius
        }
        const currentChangeStack = this.state.ControlChangeStack;
        const currentChangeProperty = this.state.ControlChangeProperty

        currentChangeStack.push(changeStack)
        this.setState({controlChangeStack: currentChangeStack})

        currentChangeProperty.push(changeProperty);
        this.setState({controlChangeProperty: currentChangeProperty})

        this.setState({borderRadius: target.value})

        this.fireStoreUpdateAll();
    }

    reposition = (event, dimensions) => {

        const position = this.state.position;
        const index = this.state.index;
        this.props.wireframe.controls[position][index].positionX = dimensions.x;
        this.props.wireframe.controls[position][index].positionY = dimensions.y

        const changeStack = {
            position: this.state.position,
            index: this.state.index
        }

        //This is mapped to the same index of the change property 
        const changeProperty = {
            property: "position",
            valueX: this.state.positionX,
            valueY: this.state.positionY
        }
        const currentChangeStack = this.state.ControlChangeStack;
        const currentChangeProperty = this.state.ControlChangeProperty

        currentChangeStack.push(changeStack)
        this.setState({controlChangeStack: currentChangeStack})

        currentChangeProperty.push(changeProperty);
        this.setState({controlChangeProperty: currentChangeProperty})

        this.setState({positionX: dimensions.x})
        this.setState({positionY: dimensions.y})

        this.fireStoreUpdateAll();
    }

    resize = (event, direction, ref, delta, dimensions) => {
        //alert(ref.style.width)
        //alert(ref.style.height)
        //alert(dimensions.x)
        //alert(dimensions.y)
        const position = this.state.position;
        const index = this.state.index;
        this.props.wireframe.controls[position][index].positionX = dimensions.x;
        this.props.wireframe.controls[position][index].positionY = dimensions.y
        this.props.wireframe.controls[position][index].sizeWidth = ref.style.width;
        this.props.wireframe.controls[position][index].sizeHeight = ref.style.height;

        const changeStack = {
            position: this.state.position,
            index: this.state.index
        }

        //This is mapped to the same index of the change property 
        const changeProperty = {
            property: "size",
            valueX: this.state.positionX,
            valueY: this.state.positionY,
            width: this.state.width,
            height: this.state.height
        }
        const currentChangeStack = this.state.ControlChangeStack;
        const currentChangeProperty = this.state.ControlChangeProperty

        currentChangeStack.push(changeStack)
        this.setState({controlChangeStack: currentChangeStack})

        currentChangeProperty.push(changeProperty);
        this.setState({controlChangeProperty: currentChangeProperty})

        this.setState({positionX: dimensions.x})
        this.setState({positionY: dimensions.y})
        this.setState({width: ref.style.width})
        this.setState({height: ref.style.height})

        this.fireStoreUpdateAll();
        
    }

    componentDidMount(){
        document.addEventListener("keydown", this.control)
        document.addEventListener("click", this.unselect)
    }

    unselect = (e) => {
        
    }

    zoomIn = (e) => {
        this.setState({zoom: 'scale(1.5)'})
        this.setState({left: '300px'})
        this.setState({right: '300px'})
    }

    zoomOut = (e) => {
        this.setState({zoom: 'scale(1.0)'})
        this.setState({left: '0px'})
        this.setState({right: '0px'})
    }

    editDiagramWidth = (e) => {
        const { target } = e;
        let width = parseInt(target.value)
        if (width > 740){
            width = 740;
        }
        this.setState({mainWidth: width})
    }

    editDiagramHeight = (e) => {
        const { target } = e;
        let height = parseInt(target.value)
        if (height > 1000){
            return;
        }
        this.setState({mainHeight: height})
    }
    
      control = (e) => {
        if(e.keyCode === 68 && e.ctrlKey && this.state.selectedControl){
            var control = this.state.selectedControl;

            var type = this.state.selectedControl.type;
            control.positionX += 100;
            control.positionY += 100;
            control.key = this.props.wireframe.controls[type].length;
            
            let updatedControls = this.state.AllControls;
            updatedControls.push(control)
            this.setState({AllControls: updatedControls})

            this.props.wireframe.controls[type].push(control);

            console.log(control)
            this.fireStoreUpdateAll();
        }
        if(e.keyCode === 46 && this.state.selectedControl){
            var control = this.state.selectedControl;
            var type = this.state.selectedControl.type;
            var key = this.state.selectedControl.key;
            var index; //this will get the index we need to delete
            var deletedControls = this.state.deletedControls;
            deletedControls.push(control);
            this.setState({deletedControls: deletedControls})
            this.setState({selectedControl: null})
            
            let updatedControls = this.state.AllControls;
            /*for (var i = 0; i < updatedControls.length; i++){

                if (updatedControls[i].type === type && updatedControls[i].key === key){//if we found the element to delete
                    index = i;
                } 
            }

            updatedControls.splice(index, 1) //delete the element from the array
            for (var i = 0; i < updatedControls.length; i++){
                if (updatedControls[i].type === type && updatedControls[i].key > key){ //if the control is of the same type AND its key is greater
                    updatedControls[i].key-- //decrement the key by 1
                }
            }
            console.log(updatedControls);
            this.setState({AllControls: updatedControls})*/

            var controlChangeStack = this.state.controlChangeStack;
            var controlChangeProperty = this.state.controlChangeProperty;

            /*for (var i = 0; i < controlChangeStack.length; i++){
                if (controlChangeStack[i].index === key && controlChangeStack[i].position === type){
                    //delete 
                    controlChangeStack.splice(i, 1)
                    controlChangeProperty.splice(i, 1)
                    i--;
                }
            }

            for (var i = 0; i < controlChangeStack.length; i++){
                if (controlChangeStack[i].index > key && controlChangeStack[i].position === type){
                    //update key
                    controlChangeStack[i].index --; //decrement those key
                }
            }

            this.setState({controlChangeStack: controlChangeStack});
            this.setState({controlChangeProperty: controlChangeProperty})
            console.log(controlChangeStack)
            console.log(controlChangeProperty)*/

            for (var i = 0; i < this.props.wireframe.controls[type].length; i++){
                if (this.props.wireframe.controls[type][i].key === key){//if we found the element to delete
                    index = i;
                } 
            }

            this.props.wireframe.controls[type].splice(index, 1);

            for (var i = 0; i < this.props.wireframe.controls[type].length; i++){
                if (this.props.wireframe.controls[type][i].key > key){ //if the control is of the same type AND its key is greater
                    this.props.wireframe.controls[type][i].key-- //decrement the key by 1
                }
            }

            this.fireStoreUpdateAll();
            
        }
      }

    render(){
        const wireframe = this.props.wireframe;
        const id = this.props.id;
        const goHome = this.state.goHome

        if (!this.props.auth.uid) {
            return <Redirect to="/login" />;
        }

        
        if(!wireframe){
            return <React.Fragment />
        }

        if(goHome==="goback"){
            return <Redirect to="/" />
        }

        return(


            <div>
                <div class="row">
                <div class="input-field col s6">
                    <input className="active" type="text" defaultValue={wireframe.name} name="name" id="name" onChange={this.handleChange}  />
                    <label class="active" for="name">Name</label>
                </div>
                <div class="input-field col s6">
                    <input className="active" type="text" defaultValue={wireframe.owner} name="owner" id="owner" onChange={this.handleChange} />
                    <label class="active" for="owner">Owner</label>
                </div>
                </div>

                <div id="wireframe diagram" class="row">
                    <div id="options-left" class="col s3" style={{MozTransform: this.state.zoom, WebkitTransform: this.state.zoom, right: this.state.right}}>

                        <div class="card pink accent-1 col s12" id="options-left-div">
                            <div class="row">
                            <a class="waves-effect waves-light btn-large purple accent-2 col s3" onClick={this.zoomIn}>
                                <i class="material-icons medium" >
                                    zoom_in
                                </i>
                            </a>
                            <a class="waves-effect waves-light btn-large purple accent-2 col s3" onClick={this.zoomOut}>
                                <i class="material-icons medium" >
                                    zoom_out
                                </i>
                            </a>
                                <a class="waves-effect waves-light btn-large purple accent-2 col s3"
                                onClick={this.saveAll}>
                                    Save
                                </a>

                                <Modal header="Close Wireframe Project?"
                                trigger={
                                <a class="waves-effect waves-light btn-large purple accent-2 col s3"
                                >
                                    Close
                                </a>}>
                                <p>
                                    <h5>Are you sure you want to close The Wireframe Project?</h5>
                                    <a class="waves-effect waves-light btn-large" id = "confirm-delete-list" onClick={this.returnToHome}>Yes</a>
                                    <a class="modal-close waves-effect waves-light btn-large" id = "confirm_cancel_list">No</a>
                                    <h5>Any unsaved edits will not be retrieveable</h5>
                                </p>
                                </Modal>
                            </div>
                            

                            <h5 class="center-align white-text">
                                Container
                            </h5>
                            <div class="center-align hoverable col s12" 
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                border: "solid 3px #000000",
                                background: "#ffffff",
                                height: 200
                            }}
                            onClick={this.addNewContainer}>
                            Click to add a new Container
                            </div>

                            <h5 class="center-align white-text">
                                Label
                            </h5>
                            <label class="center-align hoverable col s12"

                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                opacity: 1,
                                height: 100,
                                fontSize: 17
                            }}
                            onClick={this.addNewLabel}>
                            
                                Prompt for input: click to add a new label
                            </label>


                            <h5 class="center-align white-text">
                                Button
                            </h5>

                            <button class="center-align hoverable col s12"
                            style ={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                border: "solid 1px #ddd",
                                background: "#f0f0f0",
                                
                            }}
                            onClick={this.addNewButton}
                            >
                                Submit: click to add a new button
                            </button>


                            <h5 class="center-align white-text">
                                Textfield
                            </h5>

                            <div class="center-align hoverable"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                border: "solid 1px #696969",
                                background: "#ffffff",
                            }}
                            onClick={this.addNewTextfield}
                            >
                                <label>
                                    Enter text here: click here to add a new textfield
                                </label>
                            </div>

                            <div>
                                <br></br>
                                <br></br>
                                <br></br>
                                <br></br>
                                <br></br>
                                <br></br>
                            </div>


                        </div>    
                </div>

                    <div id="main-diagram" class="col s6" style={{MozTransform: this.state.zoom, WebkitTransform: this.state.zoom}}>
                        <div class="center-align col s12"
                        style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                border: "solid 3px #000000",
                                background: "#ffffff",
                                height: this.state.mainHeight,
                                width: this.state.mainWidth
                            }}> 
                        <WireframeContainerList wireframe={wireframe} selectControl={this.selectControl} reposition={this.reposition} resize={this.resize}/>
                        <WireframeButtonList wireframe={wireframe} selectControl={this.selectControl} reposition={this.reposition} resize={this.resize}/>
                        <WireframeLabelList wireframe={wireframe} selectControl={this.selectControl} reposition={this.reposition} resize={this.resize}/>
                        <WireframeTextfieldList wireframe={wireframe} selectControl={this.selectControl} reposition={this.reposition} resize={this.resize}/>
                        
                        </div>
                    </div>

                    <div id="options-right" class="col s3" style={{MozTransform: this.state.zoom, WebkitTransform: this.state.zoom, left: this.state.left}}>
                        <div class="col s12" id="options-right-div">
                            <h5 class="center-align white-text">
                                Properties
                            </h5>
                            <input type="text" placeholder="Edit Text" defaultValue={this.state.text} onChange={this.editText}></input>

                            <div class="row">
                                <h5 class="col s5 white-text">Font Size:</h5>
                                <input type="text" class="col s6" placeholder="Font Size" defaultValue={this.state.fontSize} onChange={this.editTextFontSize}></input>
                            </div>

                            <div>
                                <h5 class="col s12 white-text">Background Color:</h5>
                                <br></br>
                                <br></br>
                                <HuePicker class="backgroundColorPicker col s12" color={this.state.backgroundColor}
                                    onChangeComplete={this.handleChangeCompleteBackground}
                                />
                                <br></br>
                                <br></br>
                            </div>

                            <div>
                                <h5 class="col s12 white-text">Border Color:</h5>
                                <br></br>
                                <br></br>
                                <HuePicker class="borderColorPicker col s12" color={this.state.borderColor}
                                    onChangeComplete={this.handleChangeCompleteBorder}
                                />
                                <br></br>
                                <br></br>
                            </div>

                            <div>
                                <h5 class="col s12 white-text">Text Color:</h5>
                                <br></br>
                                <br></br>
                                <HuePicker class="textColorPicker col 12" color={this.state.textColor}
                                    onChangeComplete={this.handleChangeCompleteText}
                                />
                                <br></br>
                                <br></br>
                            </div>

                            <div class="row">
                                <h5 class="col s5 white-text">Border Radius:</h5>
                                <input type="text" class="col s6" placeholder="Border Radius"  defaultValue={this.state.borderRadius} onChange={this.editBorderRadius}></input>
                            </div>

                            <div class="row">
                                <h5 class="col s5 white-text">Wireframe Width: </h5>
                                <input type="text" class="col s6" placeholder="Diagram Width" defaultValue={this.state.mainWidth} onChange={this.editDiagramWidth}></input>
                            </div>

                            <div class="row">
                                <h5 class="col s5 white-text">Wireframe Height: </h5>
                                <input type="text" class="col s6" placeholder="Diagram Height" defaultValue={this.state.mainHeight} onChange={this.editDiagramHeight}></input>
                            </div>
                            


                        </div>
                    </div>
                </div>
            </div>
        );

        
    }

}

const mapStateToProps = (state, ownProps) => {
    const { id } = ownProps.match.params;
    const { wireframes } = state.firestore.data;
    const wireframe = wireframes ? wireframes[id] : null;

    if(wireframe){
        wireframe.id = id;
    }

    return {
        wireframe,
        auth: state.firebase.auth,
    };
};

export default compose(
    connect(mapStateToProps),
    firestoreConnect([
        { collection: 'wireframes' },
    ]),
)(WireFrameScreen);