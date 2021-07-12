require('dotenv').config();
const db = require('./models');
const fs = require('fs');

const checkTable = `
    SELECT table_catalog, table_schema 
    FROM   information_schema.tables 
    WHERE  table_name = 'session'
`

const createCards = `
    CREATE TABLE IF NOT EXISTS cards (
        id varchar(100) PRIMARY KEY,
        name varchar(50) NOT NULL,
        cost integer NOT NULL,
        upgraded_cost TEXT,
        description TEXT NOT NULL,
        upgraded_description TEXT NOT NULL,
        rarity varchar(20) NOT NULL,
        type varchar(20) NOT NULL,
        subtype varchar(20),
        swaps_to varchar(100),
        search_vector TSVECTOR
    );
`

const createUsers = `
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username varchar(50),
        password varchar(100),
        credits_name varchar(100),
        credits_url varchar(100),
        contact_info varchar(100)
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
        image bytea NOT NULL,
        FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE SET NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    )
`

const createDefaultArts = `
    CREATE TABLE IF NOT EXISTS default_art (
        card_id varchar(100) PRIMARY KEY,
        art_id integer NOT NULL,
        FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE,
        FOREIGN KEY (art_id) REFERENCES art_submissions(id) ON DELETE CASCADE
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

const createRarityOrder = `
    CREATE TABLE IF NOT EXISTS card_rarity_order (
        rarity_order integer PRIMARY KEY,
        rarity_name varchar(20)
    )
`

const createComments = `
    CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        category varchar(30) NOT NULL,
        message text,
        user_id integer NOT NULL,
        card_id varchar(100),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE SET NULL
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
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, to_tsvector($11))
    ON CONFLICT (id) DO UPDATE SET
    name = excluded.name,
    cost = excluded.cost,
    upgraded_cost = excluded.upgraded_cost,
    description = excluded.description,
    upgraded_description = excluded.upgraded_description,
    rarity = excluded.rarity,
    type = excluded.type,
    subtype = excluded.subtype,
    swaps_to = excluded.swaps_to,
    search_vector = excluded.search_vector;
`

const addKeywordToCard = `
    INSERT INTO keywords_on_cards
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING;
`

const addRarityOrder = `
    INSERT INTO card_rarity_order
    VALUES
        (1, 'BASIC'),
        (2, 'COMMON'),
        (3, 'UNCOMMON'),
        (4, 'RARE'),
        (5, 'SPECIAL')
    ON CONFLICT DO NOTHING;
`

async function execute() {
    try {
        console.log(`checking if "session" table exists`)
        const result = await db.query(checkTable, []);
        if (!result.rows?.length) {
            console.log(`    table "session" does not exist.`)
            console.log(`    reading "table.sql" from "connect-pg-simple`);
            const createSessions = fs.readFileSync('./node_modules/connect-pg-simple/table.sql').toString();

            console.log(`    creating table "session"`);
            await db.query(createSessions, []);
        } else {
            console.log(`    table "session" exists.`);
        }

        console.log(`creating table "cards"`);
        await db.query(createCards, []);

        console.log(`creating table "users"`);
        await db.query(createUsers, []);

        console.log(`creating table "keywords"`);
        await db.query(createKeywords, []);

        console.log(`creating table "art_submissions"`);
        await db.query(createArtSubmissions, []);

        console.log(`creating table "default_art"`);
        await db.query(createDefaultArts, []);

        console.log(`creating table "keywords_on_cards"`);
        await db.query(createKeywordsOnCards, []);

        console.log(`creating table "card_rarity_order"`);
        await db.query(createRarityOrder, []);

        console.log(`    defining rarity orders`);
        await db.query(addRarityOrder, []);

        console.log(`creating table "comments"`)
        await db.query(createComments, []);

        console.log("reading keyword data from .json");
        const keywordData = JSON.parse(fs.readFileSync('./exports/hydro-keywords.json'));

        for (const keyword in keywordData) {
            console.log(`    adding keyword ${keyword} to table`);
            await db.query(addKeyword, [
                keyword,
                keywordData[keyword]["NAME"],
                keywordData[keyword]["DESCRIPTION"]
            ]);
        }

        console.log("reading card data from .json");
        const cardData = JSON.parse(fs.readFileSync('./exports/hydro-cards.json'));

        for (const card in cardData) {
            console.log(`    adding ${card} to table`);
            
            const search_array = [
                cardData[card]["NAME"],
                cardData[card]["DESCRIPTION"],
                cardData[card]["UPGRADED_DESCRIPTION"],
                cardData[card]["RARITY"],
                cardData[card]["TYPE"],
                cardData[card]["SUBTYPE"]
            ]
            
            const tableData = [
                card, //cardID
                cardData[card]["NAME"],
                cardData[card]["COST"],
                cardData[card]["UPGRADED_COST"],
                cardData[card]["DESCRIPTION"],
                cardData[card]["UPGRADED_DESCRIPTION"],
                cardData[card]["RARITY"],
                cardData[card]["TYPE"],
                cardData[card]["SUBTYPE"],
                cardData[card]["SWAPS_TO"],
                search_array
            ]

            await db.query(addCard, tableData);
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