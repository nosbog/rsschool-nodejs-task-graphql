import {dbClient} from "../index.js";
import DataLoader = require("dataloader");

export const usersLoader = new DataLoader(async ids => {
    const data = await dbClient.user.findMany({
        where: {
            id: {in: <string[]>ids},
        },
    });
    return ids.map(id => data.find(user => user.id === id))
})

export const userSubscribedToLoader = new DataLoader(async ids => {
    const data = await dbClient.subscribersOnAuthors.findMany({
        where: {
            subscriberId: {in: <string[]>ids},
        },
    });
    return ids.map(id => data.map(({subscriberId, authorId}) => subscriberId === id ? {id: authorId} : null))
})

export const subscribedToUserLoader = new DataLoader(async ids => {
    const data = await dbClient.subscribersOnAuthors.findMany({
        where: {
            authorId: {
                in: <string[]>ids
            },
        },
    });
    return ids.map(id => data.map(({subscriberId, authorId}) => authorId === id ? {id: subscriberId} : null))
})
