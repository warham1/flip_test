import React, {Component} from 'react';
import gql from "graphql-tag";
import { graphql, compose} from "react-apollo";
import  TileButton  from "./TileButton";
import  "./View.css";

const GET_TILES_QUERY = gql`
    query GetTiles($id: Int){
        getTiles(id: $id) {
            id
            tileColor
        }
    }
`;

const ON_CHANGE_TILE_QUERY = gql`
    subscription {
        onChangeTile {
            id
            tileColor
        }
    }
`;

const UPDATE_TILE = gql`
    mutation UpdateTile($tileId: Int!, $tileColor: Int!) {
        updateTile(tileId: $tileId, tileColor: $tileColor) {
            val
        }
    }
`;

const changeColor = num => {
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


class View extends Component {

    constructor(props)
    {
        super(props);
        this.state = {
            tiles : []
        };        
    }

    componentWillMount() {
        this.props.data.subscribeToMore({
            document: ON_CHANGE_TILE_QUERY,
            updateQuery: (prev, { subscriptionData }) => {
                if(!subscriptionData.data) return prev;
                const { onChangeTile } = subscriptionData.data;
                return {
                    ...prev
                }
            }
        });
    }

    updateTile = (tileId, tileColor) => {
        this.props.updateTile(
            {variables: { tileId: tileId ,tileColor: changeColor(tileColor)}});
    }

    componentWillReceiveProps(nextprops) {
        this.setState({tiles: nextprops.data.getTiles});
    }

    genButtons = () => {     
        let temp = [];
            for (let index = 0; index < this.state.tiles.length; index++) {
                temp.push(
                    <TileButton tileIdProp={this.state.tiles[index].id} 
                    tileColorProp={this.state.tiles[index].tileColor} 
                    updateTile={ this.updateTile}/>   
                );
            }       
        return temp;
    }

    render() {
        const {data: {loading}} = this.props;

        if(loading) {
            return (
                <div className = "tile-container">
                    Loading~~
                </div>
            )
        }

        return (
            <div className = "tile-container">
                {this.genButtons()}
            </div>
        );
    }

};

const withTileData = graphql(GET_TILES_QUERY);
const MutateData = graphql(UPDATE_TILE, {name: "updateTile"});

export default compose(withTileData, MutateData)(View);