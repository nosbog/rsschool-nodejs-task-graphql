import DataLoader = require("dataloader");
import {dbClient} from "../index.js";

export const profilesLoader = new DataLoader(async ids => {
    const data = await dbClient.profile.findMany({
        where: {
            userId: {
                in: <string[]>ids
            }
        }
    })
    return ids.map(id => data.find(profile => profile.userId === id))
})
