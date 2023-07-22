import {dbClient} from "../index.js";
import DataLoader = require("dataloader");

export const postsLoader = new DataLoader(async ids => {
    const data = await dbClient.post.findMany({
        where: {
            authorId: {
                in: <string[]>ids
            }
        }
    })
    return ids.map(id => data.filter(post => post.authorId === id))
})
