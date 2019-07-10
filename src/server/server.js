import { GraphQLServer, PubSub} from "graphql-yoga";
import {find} from "lodash";

let tiles = [];

const pubsub = new PubSub();
const NEW_TILE = "NEW_TILE";
const CHG_TILE = "CHG_TILE";

const typeDefs = `
type Tile {
    id: Int!
    tileColor: Int!
}

type Result {
    val: String!
}
type Query {
    getTiles(id: Int): [Tile]
}
type Mutation {
    newTile(tileColor: Int!): String!
    updateTile(tileId: Int!, tileColor: Int!): Result
}
type Subscription {
    newTile: Tile
    onChangeTile: Tile
}
`;

const resolvers = {
    Query: {
        getTiles: (_, {id}) => {
            if(id === undefined)
                return tiles;

            const tile = find(tiles, { id: id});
            const temp = [];
            temp.push(tile);
            
            return temp;
        }
    },
    Mutation: {
        newTile: (_, { tileColor }) => {
            const id = tiles.length;
            const newTile = {
                id,
                tileColor
            };
            tiles.push(newTile);
            pubsub.publish(NEW_TILE, { newTile: newTile });
            return "YES";
        },
        updateTile: (_, {tileId, tileColor}) => {
            const tile = find(tiles, { id: tileId });
            tile.tileColor = tileColor;

            pubsub.publish(CHG_TILE,  {onChangeTile: tile} );

            const result = {val: "YES"};
            return result;
        }
    },
    Subscription: {
        newTile: {
            subscribe: () => 
                pubsub.asyncIterator(NEW_TILE)
        },
        onChangeTile: {
            subscribe: () =>
                pubsub.asyncIterator(CHG_TILE)
        }
    }
};

const server = new GraphQLServer({
    typeDefs: typeDefs,
    resolvers: resolvers,
    context: { pubsub }
});

server.start(() => {
        
    for (let index = 0; index < 16; index++) {
        const tile = {id : index, tileColor: 0};
        tiles.push(tile);
    }
    console.log("Graphql Server Running");
});