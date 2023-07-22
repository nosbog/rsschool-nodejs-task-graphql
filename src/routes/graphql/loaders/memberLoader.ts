import DataLoader = require("dataloader");
import {dbClient} from "../index.js";

export const membersLoader = new DataLoader(async ids => {
    const data = await dbClient.memberType.findMany({
        where: {
            id: {
                in: <string[]>ids
            }
        }
    })
    return ids.map(id => data.find(member => member.id === id))
})
