require('dotenv').config();
const db = require('./models');
const fs = require('fs');

const createCards = `
    CREATE TABLE IF NOT EXISTS cards (
        id varchar(100) PRIMARY KEY,
        name varchar(50) NOT NULL,
        cost integer NOT NULL,
        upgraded_cost integer,
        description TEXT NOT NULL,
        upgraded_description TEXT NOT NULL,
        type varchar(20) NOT NULL,
        subtype varchar(20),
        swaps_to varchar(100)
    );
`

const createUsers = `
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username varchar(50),
        password varchar(100),
        credits_name varchar(100),
        credits_url varchar(100)
    )
`

const createKeywords = `
    CREATE TABLE IF NOT EXISTS keywords (
        id varchar(100) PRIMARY KEY,
        name varchar(50),
        description TEXT
    )
`

const createArtSubmissions = `
    CREATE TABLE IF NOT EXISTS art_submissions (
        id SERIAL PRIMARY KEY,
        card_id varchar(100),
        user_id integer,
        path_to_image varchar(120),
        FOREIGN KEY (card_id) REFERENCES cards(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
    )
`

const createKeywordsOnCards = `
    CREATE TABLE IF NOT EXISTS keywords_on_cards (
        card_id varchar(100),
        keyword_id varchar(100),
        PRIMARY KEY (card_id, keyword_id),
        FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE,
        FOREIGN KEY (keyword_id) REFERENCES keywords(id) ON DELETE CASCADE
    )
`

const addKeyword = `
    INSERT INTO keywords
    VALUES ($1, $2, $3)
    ON CONFLICT (id) DO UPDATE SET
    name = excluded.name,
    description = excluded.description;
`

const addCard = `
    INSERT INTO cards
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    ON CONFLICT (id) DO UPDATE SET
    name = excluded.name,
    cost = excluded.cost,
    upgraded_cost = excluded.upgraded_cost,
    description = excluded.description,
    upgraded_description = excluded.upgraded_description,
    type = excluded.type,
    subtype = excluded.subtype,
    swaps_to = excluded.swaps_to;
`

const addKeywordToCard = `
    INSERT INTO keywords_on_cards
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING;
`

async function execute() {
    try {
        console.log(`reading "table.sql" from "connect-pg-simple`);
        const createSessions = fs.readFileSync('./node_modules/connect-pg-simple/table.sql');

        console.log(`creating table "session"...`);
        await db.query(createSessions, []);

        console.log(`creating table "cards"...`);
        await db.query(createCards, []);

        console.log(`creating table "users"...`);
        await db.query(createUsers, []);

        console.log(`creating table "keywords"...`);
        await db.query(createKeywords, []);

        console.log(`creating table "art_submissions"...`);
        await db.query(createArtSubmissions, []);

        console.log(`creating table "keywords_on_cards"...`);
        await db.query(createKeywordsOnCards, []);

        console.log("reading keyword data from .json...");
        const keywordData = JSON.parse(fs.readFileSync('./exports/hydro-keywords.json'));

        for (const keyword in keywordData) {
            console.log(`adding keyword ${keyword} to table...`);
            await db.query(addKeyword, [
                keyword,
                keywordData[keyword]["NAME"],
                keywordData[keyword]["DESCRIPTION"]
            ]);
        }

        console.log("reading card data from .json...");
        const cardData = JSON.parse(fs.readFileSync('./exports/hydro-cards.json'));

        for (const card in cardData) {
            console.log(`adding ${card} to table...`);
            await db.query(addCard, [
                card, //cardID
                cardData[card]["NAME"],
                cardData[card]["COST"],
                cardData[card]["UPGRADED_COST"],
                cardData[card]["DESCRIPTION"],
                cardData[card]["UPGRADED_DESCRIPTION"],
                cardData[card]["TYPE"],
                cardData[card]["SUBTYPE"],
                cardData[card]["SWAPS_TO"]
            ]);
            await cardData[card]["KEYWORDS"].forEach(async keyword => {
                await db.query(addKeywordToCard, [card, keyword]);
            });
        }

        console.log('Success!');
    } catch(err) {
        console.log('Not success!');
        console.log(err);
    }
}

execute();