import React from 'react';
import gql from "graphql-tag";
import { Query } from "react-apollo";
import  TileButton  from "./TileButton";
import  "./View.css";

const getTiles = gql`
    query {
        getTiles {
            id
            tileColor
        }
    }
`;

const onChangeTile = gql`
    subscription {
        onChangeTile {
            id
            tileColor
        }
    }
`;

let unsubscribe = null;

const View = () => (
<Query query={getTiles}>
    {({ loading, data, subscribeToMore}) => {
        if (loading) {
            return null;
        }
        if (!unsubscribe) {
            unsubscribe = subscribeToMore({
                document: onChangeTile,
                updateQuery: (prev, { subscriptionData}) => {
                    if(!subscriptionData.data) return prev;
                    const { onChangeTile } = subscriptionData.data;
                    prev.getTiles[onChangeTile.id].tileColor = onChangeTile.tileColor;
                    return {
                        ...prev
                    };
                }
            });
        }
        return (
            <div className="tile-container">
                {
                    data.getTiles.map(tile => 
                    (
                        <span>
                            <TileButton tileIdProp={tile.id} tileColorProp={tile.tileColor}/>
                            {((tile.id+1)%4 === 0)?<br></br>:""}
                        </span>
                    )
                )}
            </div>
        );
    }}
</Query>
);

export default View;