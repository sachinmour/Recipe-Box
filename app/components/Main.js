import React from "react";

class Main extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            recipes: []
        }
    }

    addRecipe(name) {
        localStorage[name] = name
    }

}

export default Main;
