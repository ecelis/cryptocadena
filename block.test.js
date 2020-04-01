const Block = require('./block');
const cryptoHash = require('./crypto-hash');
const hexToBinary = require('hex-to-binary');
const { GENESIS_DATA, MINE_RATE } = require('./config');

describe('Block', () => {
    const timestamp = 2000;
    const lastHash = 'foo-hash';
    const hash = 'bar-hash';
    const data = ['blockchain' , 'data'];
    const nonce = 1;
    const difficulty = 1;
    const block =new Block({
        timestamp,
        lastHash,
        hash,
        data,
        nonce, difficulty
    });
    

    it('has a timestamp, lastHash, hash, and data', () => {
        expect(block.timestamp).toEqual(timestamp);
        expect(block.lastHash).toEqual(lastHash);
        expect(block.hash).toEqual(hash);
        expect(block.data).toEqual(data);
        expect(block.nonce).toEqual(nonce);
        expect(block.difficulty).toEqual(difficulty);
    });

    describe('genesis()', () => {
        const genesisBlock = Block.genesis();
        it('return a block instance', () => {
            expect(genesisBlock instanceof Block).toBe(true);
        });
        it('returns the genesis data', () => {
            expect(genesisBlock).toEqual(GENESIS_DATA);
        });
    });

    describe('mineBlock()', () => {
        const lastBlock = Block.genesis();
        const data = 'mined data';
        const mineBlock = Block.mineBlock({lastBlock, data});

        it('returns a Block instance', () => {
            expect(mineBlock instanceof Block).toBe(true);
        });

        it('sets the `lastHash` to be `hash`  of the lastBlock', () => {
            expect(mineBlock.lastHash).toEqual(lastBlock.hash);
        });

        it('sets the `data`', () => {
            expect(mineBlock.data).toEqual(data);
        });
        it('sets `timestamp`', () => {
            expect(mineBlock.timestamp).not.toEqual(undefined);
        });
        it('create a SHA-256 `hash` based on the proper inputs', () => {
            expect(mineBlock.hash)
                .toEqual(cryptoHash(mineBlock.timestamp,
                    mineBlock.nonce, mineBlock.difficulty,
                    lastBlock.hash, data));
        });
        it('sets a `hash` that matches the difficulty criteria', () => {
            expect(hexToBinary(mineBlock.hash).substring(0, mineBlock.difficulty))
                .toEqual('0'.repeat(mineBlock.difficulty));
        });
        it('adjusts the dificulty', () => {
            const posibleResults = [lastBlock.difficulty+1, lastBlock.difficulty-1];
            expect(posibleResults.includes(mineBlock.difficulty)).toBe(true);
        });
    });

    describe('adjustDifficulty()', () => {
        it(' raises the difficulty for a quickly mined block', () => {
            expect(Block.adjustDifficulty({
                originalBlock: block,
                timestamp: block.timestamp + MINE_RATE - 100
            })).toEqual(block.difficulty+1);
        });
        it(' raises the difficulty for a slowly mined block', () => {
            expect(Block.adjustDifficulty({
                originalBlock: block, timestamp: block.timestamp + MINE_RATE + 100
            })).toEqual(block.difficulty-1);
        });
        it('has a lower limit of 1', () =>{
            block.difficulty = -1;
            expect(Block.adjustDifficulty({ originalBlock: block })).toEqual(1);
        });
    });
});