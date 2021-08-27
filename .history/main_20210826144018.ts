import * as fs from 'fs';
export class TrieNode {

    value: string;
    eow: boolean;
    children: any;
    filePaths: string[];

    constructor(value: string) {
        this.value = value;
        this.eow = false;
        this.filePaths = [];
        this.children = {};
    }
}

class CreateTries {

    root: TrieNode =  new TrieNode('.');

    indexEmails() {

        this.insert('hello', '/hello.1');
        this.insert('helios', '/hello.1');
        this.insert('helios', '/hello.2');
        console.log(this.search(this.root, 'helios'));
        return this.root;
    }


    insert(word: string, filePath: string) {
        
        let currentNode = this.root;
        let characters = [...word].map(character => character.toLowerCase());

        characters.forEach((character: string) => {
            if(currentNode.children[character] == undefined) {
                currentNode.children[character] = new TrieNode(character);
            }
            currentNode = currentNode.children[character];
            

        });
        currentNode.eow = true;
        currentNode.filePaths.push(filePath);
    }


    search(trieRoot: TrieNode, searchTerm: string) {
        let currentNode = trieRoot;
        if(!searchTerm) return [];
        else {
            
            let characters = [...searchTerm].map(character => character.toLowerCase());

            characters.forEach((character: string) => {
                if(currentNode.children[character] !== undefined) {
                    currentNode = currentNode.children[character];
                }
            });

        return currentNode.filePaths;

        }
    }
}

const createTries = new CreateTries();

const trieStructure = createTries.indexEmails();
