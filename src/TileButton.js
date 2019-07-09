import React, { Component} from "react";
import {gql} from "apollo-boost";
import { Mutation } from "react-apollo";
import "./TileButton.css"

const update_Tile = gql`
    mutation UpdateTile($tileId: Int!, $tileColor: Int!) {
        updateTile(tileId: $tileId, tileColor: $tileColor) {
            val
        }
    }
`;

const getColor = num => {
    switch(num) {
        case 0:
            return "Black";
        case 1:
            return "Red";
        case 2:
            return "Blue";
        
        default:
            return "Black";
    }
}


class TileButton extends Component {
    
    constructor(props)
    {
        super(props);

        this.state={tileId:this.props.tileIdProp, 
                    tileColor: this.props.tileColorProp}
    }

    changeColor = num => {
        switch(num) {
            case 0:
                return 1;
            case 1:
                return 2;
            case 2:
                return 1;
    
            default:
                return 0;
        }
    }
    
    render(){
        const {tileColorProp} = this.props;
        return(
            <Mutation mutation={update_Tile}>
                {(updateTile, { data }) => (
                    <button 
                        className="tile"
                        onClick={ () => {                            
                            const temp = this.changeColor(this.state.tileColor);
                            this.setState({tileColor:temp});
                            updateTile({ variables: { tileId : this.state.tileId,
                                                        tileColor: temp}}).then(({data}) => console.log('ret', data)
                                                        );
                            
                        } }

                        style={{background: getColor(tileColorProp)}}>
                    </button>
                )}
            </Mutation>
    )}
}

export default TileButton;